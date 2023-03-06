import axios from "axios";
import React, { useEffect, useState } from "react";
import { dataURItoBlob, save } from "../../utils/Util";

const Canvas = ({
  tool,
  currImageName,
  canvasRef,
  drawColor,
  restoreArray,
  setRestoreArray,
  index,
  setIndex,
  context,
  drawWidth,
  frame,
  animationId,
  currImageTransparentName,
  currentFrameImageRef,
  imageRef,
  key,
  currRealImageName,
  prevImage,
  reloadFrames,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    const disableScroll = (event) => {
      event.preventDefault();
    };

    canvas.addEventListener("touchmove", disableScroll, { passive: false });

    return () => {
      canvas.removeEventListener("touchmove", disableScroll);
    };
  }, []);

  const start = (event) => {
    event.preventDefault();
    if (canvasRef.current == null) {
      event.preventDefault();
      return;
    }
    let x, y;
    if (event.touches && event.touches.length) {
      x = event.touches[0].clientX + 100;
      y = event.touches[0].clientY + 20;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(x - 210, y - 79.2);
    draw(event);
  };

  const draw = (event) => {
    event.preventDefault();
    if (canvasRef.current == null) {
      return;
    }
    if (isDrawing) {
      let x, y;
      if (event.touches && event.touches.length) {
        x = event.touches[0].clientX + 100;
        y = event.touches[0].clientY + 20;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      console.log(x, y);
      context.lineTo(x - 210, y - 79.2);
      context.strokeStyle = tool == "p" ? drawColor : "white";
      context.lineWidth = drawWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
      context.beginPath();
      context.moveTo(x - 210, y - 79.2);
      //   console.log("drawing");
    }
  };

  const stop = async (event) => {
    if (isDrawing) {
      context.stroke();
      context.closePath();
      setIsDrawing(false);
      context.beginPath();
      const data = await save(
        canvasRef,
        currImageName,
        currImageTransparentName,
        currRealImageName
      );
      reloadFrames();
      console.log({ data });
      const randomId = new Date().getTime();
      currentFrameImageRef.current.style.backgroundImage = `url(https://animation-server.vercel.app/${data.data.filename}?randomId=${randomId})`;
    }
    event.preventDefault();
    if (event.type != "mouseout") {
      console.log({
        value: [
          ...restoreArray,
          context.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          ),
        ],
      });
      setRestoreArray([
        ...restoreArray,
        context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        ),
      ]);
      setIndex(index + 1);
      console.log(restoreArray);
    }
  };
  console.log({ prevImage });
  return (
    <canvas
      onMouseUp={stop}
      onMouseDown={start}
      onMouseMove={draw}
      onMouseOut={stop}
      onTouchEnd={stop}
      onTouchStart={start}
      onTouchMove={draw}
      onClick={(e) => e.preventDefault()}
      ref={canvasRef}
      style={{
        // pointerEvents: "none",
        cursor: "pointer",
        height: "100%",
        width: "100%",
        zIndex: 1,
        backgroundColor: "white",
        backgroundImage: `url(${prevImage}?id=${Date.now()})`,
        userSelect: "none",
        borderRadius: "10px",
        position: "absolute",
        zIndex: "4",
      }}
    />
  );
};

export default Canvas;
