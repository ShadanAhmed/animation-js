import {
  Box,
  Center,
  Flex,
  Heading,
  position,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Frame from "../../components/animation/Frame";
import { SketchPicker } from "react-color";
import Canvas from "../../components/animation/Canvas";
import ClickAwayListener from "react-click-away-listener";
import Tools from "../../components/animation/Tools";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import axios from "axios";
import { dataURItoBlob, imageUrlToDataURI, save } from "../../utils/Util";

const Animation = () => {
  const [isMobile] = useMediaQuery(
    "(max-width: 480px) and (orientation: portrait), (max-height: 480px) and (orientation: landscape)"
  );

  const queryClient = useQueryClient();

  const canvasRef = useRef();
  const imageRef = useRef();
  const [context, setContext] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const [drawColor, setDrawColor] = useState("#000000");
  const [restoreArray, setRestoreArray] = useState([]);
  const [index, setIndex] = useState(-1);
  const [drawWidth, setDrawWidth] = useState(6);
  const [currentFrame, setCurrentFrame] = useState(0);
  const currentFrameImageRef = useRef();

  const router = useRouter();
  const { id } = router.query;

  const [currentTool, setCurrentTool] = useState("p");
  // p for pen
  // e for eraser

  const editFramesMutation = useMutation((frames) =>
    axios.patch(
      `https://animation-server.vercel.app/api/animation/${data.data.animation._id}`,
      {
        frames,
      }
    )
  );

  const { isLoading, error, data } = useQuery(["animation", id], () =>
    axios
      .get(`https://animation-server.vercel.app/api/animation/${id}`)
      .then((res) => res)
  );

  const [frames, setFrames] = useState([]);

  useEffect(() => {
    if (!data) return;
    setFrames([...data.data.animation.frames]);
  }, [data]);

  useEffect(() => {
    console.log(currentFrame);
    if (canvasRef.current != null && data.data) {
      console.log({ data: data.data });
      console.log(canvasRef.current);
      let context = canvasRef.current.getContext("2d");
      setContext(context);
      console.log(canvasRef.current.parentNode.clientWidth);
      console.log(canvasRef.current.clientHeight);
      canvasRef.current.width = canvasRef.current.parentNode.clientWidth;
      canvasRef.current.height = canvasRef.current.parentNode.clientHeight;
      // context.fillStyle = "white";
      // context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      imageRef.current.src =
        data.data.animation.frames[currentFrame]
          .currentFrameImageWithoutBackground +
        "?id=" +
        Date.now();
      console.log(data.data.animation.frames[currentFrame]);
      console.log(imageRef.current);
      imageRef.current.crossOrigin = "Anonymous";
      // imageRef.current.src =
      //   data.data.animation.frames[currentFrame].previousFrameImage;
      // console.log(data.data.animation.frames[currentFrame]);
      // console.log(imageRef.current);
      // imageRef.current.crossOrigin = "Anonymous";
      // context.drawImage(imageRef.current, 0, 0);
    }
  }, [canvasRef.current, data, currentFrame]);
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  if (error) {
    console.log(error);
    return <Box>Error...</Box>;
  }

  const drawImageOnCanvas = () => {
    console.log("drawing image on canvas");
    context.drawImage(
      imageRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const createNewFrame = async () => {
    let dataUrl = await imageUrlToDataURI(
      "https://animation-server.vercel.app/frame.jpg"
    );
    var blobObject = dataURItoBlob(dataUrl);
    var fdataobj = new FormData();
    fdataobj.append("frame", blobObject);
    const rsp = await axios.post(
      "https://animation-server.vercel.app/api/frames",
      fdataobj,
      {}
    );
    let dataUrl3 = await imageUrlToDataURI(
      "https://animation-server.vercel.app/frame.png"
    );
    var blobObject3 = dataURItoBlob(dataUrl3);
    var fdataobj3 = new FormData();
    fdataobj3.append("frame", blobObject3);
    const rsp2 = await axios.post(
      "https://animation-server.vercel.app/api/frames",
      fdataobj3,
      {}
    );
    console.log({ rsp });
    let dataUrl2 = await imageUrlToDataURI(
      "https://animation-server.vercel.app/frame_transparent.png"
    );
    var blobObject2 = dataURItoBlob(dataUrl2);
    var fdataobj2 = new FormData();
    fdataobj2.append("frame", blobObject2);
    const rsp3 = await axios.post(
      "https://animation-server.vercel.app/api/frames",
      fdataobj2,
      {}
    );
    const previousFrameImage =
      data.data.animation.frames[data.data.animation.frames.length - 1]
        .currentFrameImageTransparent;
    const frames = [
      ...data.data.animation.frames,
      {
        currentFrameImageWithoutBackground: `https://animation-server.vercel.app/${rsp3.data.filename}`,
        currentFrameImage: `https://animation-server.vercel.app/${rsp.data.filename}`,
        previousFrameImage,
        currentFrameImageTransparent: `https://animation-server.vercel.app/${rsp2.data.filename}`,
      },
    ];
    editFramesMutation.mutate(frames, {
      onSuccess: async (f) => {
        console.log({ f });
        console.log({ data });
        await queryClient.invalidateQueries("animation");
        console.log({ data });
        setCurrentFrame(data.data.animation.frames.length);
        setIndex(-1);
      },
    });
  };

  const clearCanvas = async () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setRestoreArray([]);
    setIndex(-1);
    const result = await save(
      canvasRef,
      data.data.animation.frames[
        currentFrame
      ].currentFrameImageWithoutBackground
        .split("/")[3]
        .split(".")[0],
      data.data.animation.frames[currentFrame].currentFrameImageTransparent
        .split("/")[3]
        .split(".")[0],
      data.data.animation.frames[currentFrame].currentFrameImage
        .split("/")[3]
        .split(".")[0]
    );
    setFrames([...data.data.animation.frames]);

    const randomId = new Date().getTime();
    currentFrameImageRef.current.style.backgroundImage = `url(https://animation-server.vercel.app/${result.data.filename}?randomId=${randomId})`;
  };

  const undo = async (event) => {
    if (index <= 0) {
      clearCanvas();
    } else {
      let index1 = index - 1;
      setIndex(index1);
      console.log({ restoreArray });
      restoreArray.pop();
      setRestoreArray(restoreArray);
      context.putImageData(restoreArray[index1], 0, 0);
      const result = await save(
        canvasRef,
        data.data.animation.frames[
          currentFrame
        ].currentFrameImageWithoutBackground
          .split("/")[3]
          .split(".")[0],
        data.data.animation.frames[currentFrame].currentFrameImageTransparent
          .split("/")[3]
          .split(".")[0],
        data.data.animation.frames[currentFrame].currentFrameImage
          .split("/")[3]
          .split(".")[0]
      );
      setFrames([...data.data.animation.frames]);
      const randomId = new Date().getTime();
      currentFrameImageRef.current.style.backgroundImage = `url(https://animation-server.vercel.app/${result.data.filename}?randomId=${randomId})`;
    }
  };

  const images = [...data?.data?.animation?.frames] || null;

  const addImage = (image, index) => {
    console.log(image);
    image.crossOrigin = "anonymous";
    console.log(images);
    images[index] = image;
  };

  const drawFrame = (canvas, frameCount) => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(images[frameCount], 0, 0, canvas.width, canvas.height);
  };

  const displayVideo = (url) => {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    document.getElementById("modal").classList.remove("hide");
    document.getElementById("modal").classList.add("show");
    document.getElementById("modal").appendChild(video);
  };

  const convertImagesToVideo = async (canvas) => {
    const stream = canvas.captureStream(data.data.animation.frameRate);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      // downloadVideo(chunks);
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      displayVideo(url);
    };

    mediaRecorder.start();

    let frameCount = 0;
    const drawNextFrame = () => {
      drawFrame(canvas, frameCount);
      frameCount++;
      if (frameCount < images.length) {
        setTimeout(drawNextFrame, 1000 / data.data.animation.frameRate);
      } else {
        setTimeout(
          () => mediaRecorder.stop(),
          1000 / data.data.animation.frameRate
        );
      }
    };

    drawNextFrame();
  };

  const deleteFrame = () => {
    {
      if (data.data.animation.frames.length == 1) return;
      let framesCopy = [...data.data.animation.frames];
      const currentFrameRef = data.data.animation.frames[currentFrame];
      console.log({ framesCopy, currentFrameRef });
      framesCopy.splice(currentFrame, 1);
      console.log({ framesCopy, currentFrameRef });

      // editFramesMutation.mutate(frames, {
      //   onSuccess: async (f) => {
      //     console.log({ f });
      //     console.log({ data });
      //     await queryClient.invalidateQueries("animation");
      //     console.log({ data });
      //     setCurrentFrame(data.data.animation.frames.length);
      //   },
      // });

      editFramesMutation.mutate(framesCopy, {
        onSuccess: async () => {
          await queryClient.invalidateQueries("animation");
          setCurrentFrame(currentFrame == 0 ? currentFrame : currentFrame - 1);
          imageRef.current.src =
            data.data.animation.frames[
              currentFrame == 0 ? currentFrame : currentFrame - 1
            ].currentFrameImageWithoutBackground;

          axios.delete(
            `https://animation-server.vercel.app/api/frames/${
              currentFrameRef.currentFrameImage.split("/")[3]
            }`
          );
          axios.delete(
            `https://animation-server.vercel.app/api/frames/${
              currentFrameRef.currentFrameImageTransparent.split("/")[3]
            }`
          );
          axios.delete(
            `https://animation-server.vercel.app/api/frames/${
              currentFrameRef.currentFrameImageWithoutBackground.split("/")[3]
            }`
          );
        },
      });
    }
  };

  return (
    <Box
      pt={isMobile ? 2 : 6}
      pl={isMobile ? 0 : 2}
      pr={isMobile ? 2 : 6}
      bg="gray.800"
      h="100vh"
      color="gray.200"
      overflow={"hidden"}
      width="100%"
    >
      <Head>
        <title>Shadan animation</title>
        <meta
          name="description"
          content="Animation app created using next js"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
      </Head>
      {[...data.data.animation.frames].map((frame, index) => {
        return (
          <img
            key={index}
            src={frame.currentFrameImage + "?id=" + Date.now()}
            style={{ position: "absolute", visibility: "hidden" }}
            onLoad={(e) => addImage(e.target, index)}
          />
        );
      })}
      <img
        onLoad={drawImageOnCanvas}
        src=""
        alt=""
        ref={imageRef}
        style={{ position: "absolute", visibility: "hidden" }}
      />
      <Heading w="full" fontSize={isMobile ? "2xl" : "4xl"}>
        <Flex alignItems={"center"} justifyContent="space-between">
          <Flex
            px={3}
            py="1.5"
            rounded="full"
            display={"inline"}
            zIndex="3"
            cursor={"pointer"}
            onClick={() => {
              console.log("Back button clicked");
            }}
          >
            <span style={{ textTransform: "capatalize" }}>
              {data.data.animation.name}
            </span>
          </Flex>
          <Flex
            position={"relative"}
            h="full"
            alignItems={"center"}
            w="140px"
            justifyContent={"space-between"}
          >
            <span
              style={{ userSelect: "none" }}
              className="material-symbols-outlined"
              onClick={clearCanvas}
            >
              mop
            </span>
            <span
              style={{ userSelect: "none" }}
              className="material-symbols-outlined"
              onClick={undo}
            >
              undo
            </span>
            <span
              onClick={async () => {
                var canvas = canvasRef.current.cloneNode(true);
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = "#FFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                convertImagesToVideo(canvas);
              }}
              style={{ userSelect: "none" }}
              class="material-symbols-outlined"
            >
              play_arrow
            </span>
            <span
              class="material-symbols-outlined"
              onClick={() => setShowMore(!showMore)}
            >
              more_vert
            </span>
            {showMore && (
              <ClickAwayListener onClickAway={() => setShowMore(false)}>
                <Box
                  w="36"
                  zIndex={"100"}
                  boxShadow={"base"}
                  background="white"
                  p="2"
                  top="5"
                  rounded={"sm"}
                  position={"absolute"}
                  right="3"
                >
                  <Text
                    color="black"
                    fontSize="md"
                    userSelect={"none"}
                    cursor="pointer"
                    onClick={() => deleteFrame()}
                    display="flex"
                    alignItems={"center"}
                    fontWeight="semibold"
                    // justifyContent="space-around"
                  >
                    <span
                      class="material-symbols-outlined"
                      style={{
                        userSelect: "none",
                        paddingRight: "8px",
                      }}
                    >
                      delete
                    </span>
                    {"  "}
                    Delete
                  </Text>
                </Box>
              </ClickAwayListener>
            )}
          </Flex>
        </Flex>
      </Heading>
      <Flex justifyContent="center" height="100%">
        <Box
          height={isMobile ? "62%" : "68%"}
          style={{ aspectRatio: "21/9" }}
          position={"relative"}
        >
          <Canvas
            tool={currentTool}
            key={currentFrame}
            currImageName={
              data.data.animation.frames[
                currentFrame
              ].currentFrameImageWithoutBackground
                .split("/")[3]
                .split(".")[0]
            }
            currRealImageName={
              data.data.animation.frames[currentFrame].currentFrameImage
                .split("/")[3]
                .split(".")[0]
            }
            canvasRef={canvasRef}
            context={context}
            drawColor={drawColor}
            index={index}
            restoreArray={restoreArray}
            setIndex={setIndex}
            setRestoreArray={setRestoreArray}
            drawWidth={drawWidth}
            frame={currentFrame}
            currentFrameImageRef={currentFrameImageRef}
            currImageTransparentName={
              data.data.animation.frames[
                currentFrame
              ].currentFrameImageTransparent
                .split("/")[3]
                .split(".")[0]
            }
            animationId={data.data.animation._id}
            imageRef={imageRef}
            prevImage={
              data.data.animation.frames[currentFrame].previousFrameImage
            }
            reloadFrames={() => setFrames([...data.data.animation.frames])}
          />
          <Tools
            drawWidth={drawWidth}
            setDrawWidth={setDrawWidth}
            isMobile={isMobile}
            currentFrameImageRef={currentFrameImageRef}
            context={context}
            index={index}
            restoreArray={restoreArray}
            setDrawColor={setDrawColor}
            setIndex={setIndex}
            setRestoreArray={setRestoreArray}
            drawColor={drawColor}
            canvasRef={canvasRef}
            imageRef={imageRef}
            currImageName={
              data.data.animation.frames[
                currentFrame
              ].currentFrameImageWithoutBackground
                .split("/")[3]
                .split(".")[0]
            }
            currRealImageName={
              data.data.animation.frames[currentFrame].currentFrameImage
                .split("/")[3]
                .split(".")[0]
            }
            currImageTransparentName={
              data.data.animation.frames[
                currentFrame
              ].currentFrameImageTransparent
                .split("/")[3]
                .split(".")[0]
            }
            fps={data.data.animation.frameRate}
            frames={[...frames]}
            reloadFrames={() => setFrames([...data.data.animation.frames])}
            currentTool={currentTool}
            setCurrentTool={(tool) => setCurrentTool(tool)}
          />
        </Box>
      </Flex>
      <Flex
        position={"absolute"}
        bottom={isMobile ? "1" : "3"}
        left="3"
        width={"98%"}
        height="20%"
        overflow={"auto"}
        zIndex="5"
        className="scrollbar-hidden"
        p="2"
      >
        {data.data.animation.frames.map((frame, index) => {
          if (index == currentFrame)
            return (
              <Frame
                frame={frame}
                imageRef={currentFrameImageRef}
                index={index}
                isMobile={isMobile}
              />
            );
          else
            return (
              <Frame
                frame={frame}
                imageRef={null}
                index={index}
                onClick={() => {
                  setCurrentFrame(index);
                  imageRef.current.src =
                    data.data.animation.frames[
                      index
                    ].currentFrameImageWithoutBackground;
                  console.log(data.data.animation.frames[index]);
                  console.log(imageRef.current);
                  imageRef.current.crossOrigin = "Anonymous";
                  context.drawImage(
                    imageRef.current,
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                  );
                }}
                isMobile={isMobile}
              />
            );
        })}
        <Frame frame={null} onClick={createNewFrame} isMobile={isMobile} />
      </Flex>
    </Box>
  );
};

export default Animation;
