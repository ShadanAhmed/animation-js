import {
  Box,
  Center,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { SketchPicker } from "react-color";
import { save, imageUrlToDataURI } from "../../utils/Util";

const Tools = ({
  drawWidth,
  setDrawWidth,
  currentFrameImageRef,
  setDrawColor,
  context,
  setRestoreArray,
  setIndex,
  index,
  restoreArray,
  drawColor,
  currImageName,
  currImageTransparentName,
  canvasRef,
  imageRef,
  currRealImageName,
  fps,
  frames,
  reloadFrames,
  isMobile,
  currentTool,
  setCurrentTool,
}) => {
  const images = frames;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showSlider, setShowSlider] = useState(false);

  const addImage = (image, index) => {
    console.log(image);
    image.crossOrigin = "anonymous";
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
    const stream = canvas.captureStream(fps);
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
        setTimeout(drawNextFrame, 1000 / fps);
      } else {
        setTimeout(() => mediaRecorder.stop(), 1000 / fps);
      }
    };

    drawNextFrame();
  };

  const downloadVideo = (chunks) => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack
      position="absolute"
      right={isMobile ? 2 : "8"}
      top={isMobile ? 2 : "8"}
      zIndex={5}
    >
      <Box>
        <Box
          position={"relative"}
          right="0"
          w={isMobile ? "10" : "12"}
          h={isMobile ? "10" : "12"}
          background={drawColor}
          rounded="full"
          borderWidth={isMobile ? 2 : 4}
          borderColor="gray.600"
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        ></Box>
        {isColorPickerOpen && (
          <ClickAwayListener onClickAway={() => setIsColorPickerOpen(false)}>
            <Box
              position={"absolute"}
              top={isMobile ? 4 : "8"}
              right="8"
              zIndex={3}
            >
              <SketchPicker
                color={drawColor}
                onChangeComplete={(color, event) => {
                  setDrawColor(color.hex);
                }}
              />
            </Box>
          </ClickAwayListener>
        )}
      </Box>

      {/* <Box
        zIndex={2}
        position={"relative"}
        right="0"
        w={isMobile ? "10" : "12"}
        h={isMobile ? "10" : "12"}
        bg="gray.700"
        rounded="full"
        borderWidth={isMobile ? 2 : 4}
        borderColor="gray.600"
        onClick={async () => {
          var canvas = canvasRef.current.cloneNode(true);
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          convertImagesToVideo(canvas);
        }}
      >
        <Center h={isMobile ? "5" : "10"}>
          <span
            class="material-symbols-outlined"
            style={
              isMobile
                ? { userSelect: "none", fontSize: "16px" }
                : { userSelect: "none" }
            }
          >
            play_arrow
          </span>
        </Center>
        {frames.map((frame, index) => {
          return (
            <img
              key={index}
              src={frame.currentFrameImage + "?id=" + Date.now()}
              style={{ position: "absolute", visibility: "hidden" }}
              onLoad={(e) => addImage(e.target, index)}
            />
          );
        })}
      </Box> */}
      <Box
        zIndex={2}
        position={"relative"}
        right="0"
        w={isMobile ? "10" : "12"}
        h={isMobile ? "10" : "12"}
        bg="gray.700"
        rounded="full"
        borderWidth={isMobile ? 2 : 4}
        borderColor="gray.600"
        onClick={() => {
          setShowSlider(!showSlider);
        }}
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
      >
        {/* <Center h={isMobile ? "5" : "10"}> */}
        <Box
          style={{
            width: `${drawWidth * 2}px`,
            height: `${drawWidth * 2}px`,
          }}
          backgroundColor={"white"}
          rounded="full"
        />
        {/* </Center> */}
        {showSlider && (
          // <ClickAwayListener onClickAway={() => setShowSlider(false)}>
          <Box
            w="24"
            boxShadow={"base"}
            background="white"
            p="2"
            rounded={"sm"}
            position={"absolute"}
            right="5"
          >
            <Slider
              aria-label="slider-ex-1"
              defaultValue={drawWidth}
              onChangeEnd={(val) => {
                setDrawWidth(val);
                setShowSlider(false);
              }}
              min={2}
              max={16}
              step={2}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          // </ClickAwayListener>
        )}
      </Box>
      <Box
        zIndex={2}
        position={"relative"}
        right="0"
        w={isMobile ? "10" : "12"}
        h={isMobile ? "10" : "12"}
        bg="gray.700"
        rounded="full"
        borderWidth={isMobile ? 2 : 4}
        borderColor={currentTool == "p" ? "#3385f0" : "gray.600"}
        onClick={() => {
          setCurrentTool("p");
        }}
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
        // style={{ borderColor: "#33BDF0" }}
      >
        <span
          class="material-symbols-outlined"
          style={{
            userSelect: "none",
            color: currentTool == "p" ? "#33BDF0" : "white",
          }}
        >
          draw
        </span>
      </Box>
      <Box
        zIndex={2}
        position={"relative"}
        right="0"
        w={isMobile ? "10" : "12"}
        h={isMobile ? "10" : "12"}
        bg="gray.700"
        rounded="full"
        borderWidth={isMobile ? 2 : 4}
        borderColor={currentTool == "e" ? "#3385f0" : "gray.600"}
        onClick={() => {
          setCurrentTool("e");
        }}
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          class="material-symbols-outlined"
          style={{ userSelect: "none" }}
          backgroundImage={
            currentTool == "e"
              ? `url("/eraser.png")`
              : `url("/eraser_inActive.png")`
          }
          w="6"
          h="6"
          backgroundSize={"contain"}
        ></Box>
      </Box>
    </Stack>
  );
};

export default Tools;
