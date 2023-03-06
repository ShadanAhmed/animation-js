import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const Frame = ({ frame, imageRef, index, onClick, isMobile }) => {
  let longPressTimer;
  if (frame == null)
    return (
      <Flex
        onClick={onClick}
        cursor="pointer"
        className="Frame"
        ml="2"
        bg={"gray.700"}
        style={{ aspectRatio: "21/9" }}
        h="full"
        rounded={"md"}
        bgSize={"cover"}
        alignItems="center"
        justifyContent="center"
      >
        <span
          style={{
            cursor: "pointer",
            userSelect: "none",
            fontSize: isMobile ? "24px" : "48px",
          }}
          class="material-symbols-outlined"
        >
          add
        </span>
      </Flex>
    );
  let startY = null;

  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      ref={imageRef}
      className={`Frame ${imageRef ? "current" : ""}`}
      ml="2"
      bg={"gray.700"}
      style={{ aspectRatio: "21/9" }}
      h="full"
      rounded={"md"}
      bgImage={frame.currentFrameImage}
      bgSize={"cover"}
      position="relative"
      onTouchStart={(event) => {
        startY = event.touches[0].clientY;
      }}
      onTouchEnd={(event) => {
        const endY = event.changedTouches[0].clientY;
        if (startY && endY && endY < startY) {
          console.log("Swipe up detected!");
        }
        startY = null;
      }}
    >
      <Box
        position="absolute"
        top={isMobile ? "1" : "2"}
        right={isMobile ? "1" : "2"}
        px={isMobile ? "1" : "2"}
        rounded="sm"
      >
        <Text
          textColor="black"
          fontWeight="bold"
          style={{ cursor: "pointer", userSelect: "none" }}
          fontSize={isMobile ? "sm" : ""}
        >
          {index + 1}
        </Text>
      </Box>
    </Box>
  );
};

export default Frame;
