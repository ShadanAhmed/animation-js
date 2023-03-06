import axios from "axios";
const dataURItoBlob = (dataURI) => {
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);
  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
};

module.exports.save = async (
  canvasRef,
  currImageName,
  currImageTransparentName,
  currRealImageName
) => {
  let img = canvasRef.current.toDataURL();
  var newCanvas = canvasRef.current.cloneNode(true);
  var ctx = newCanvas.getContext("2d");
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
  ctx.drawImage(canvasRef.current, 0, 0);

  let img_real = newCanvas.toDataURL("image/jpeg");
  let file = dataURItoBlob(img);
  let file_real = dataURItoBlob(img_real);
  const formData = new FormData();
  const formData_real = new FormData();
  formData.append(`frame`, file);
  formData_real.append(`frame`, file_real);
  let context = canvasRef.current.getContext("2d");
  const imageData = context.getImageData(
    0,
    0,
    canvasRef.current.width,
    canvasRef.current.height
  );
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  let img2 = canvasRef.current.toDataURL();
  let file2 = dataURItoBlob(img2);
  const formData2 = new FormData();
  formData2.append(`frame`, file2);
  axios.post(
    `https://animation-server.vercel.app/frames/${currImageTransparentName}`,
    formData2
  );
  context.putImageData(imageData, 0, 0);
  await axios.post(
    `https://animation-server.vercel.app/frames/${currImageName}`,
    formData
  );
  console.log({ currRealImageName, formData_real });
  return axios.post(
    `https://animation-js-server.onrender.com/frames/${currRealImageName}`,
    formData_real
  );
};

module.exports.dataURItoBlob = dataURItoBlob;

module.exports.imageUrlToDataURI = async (imageUrl) => {
  let blob = await fetch(imageUrl).then((r) => r.blob());
  let dataUrl = await new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  return dataUrl;
};
