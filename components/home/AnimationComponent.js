import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import ClickAwayListener from "react-click-away-listener";

const AnimationComponent = ({ animation, deleteAnimation }) => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Box
        className="Animation"
        position={"relative"}
        //   mt="2"
        bg={"gray.700"}
        //   w="full"
        h="full"
        style={{ aspectRatio: "21/9" }}
        backgroundSize="cover"
        rounded={"md"}
        // bgImage={animation.frames[0]}
        backgroundPosition="center"
        onClick={() => router.push(`/animation/${animation._id}`)}
        background={`linear-gradient(180deg, rgba(255,255,255,0) 50%, rgba(0,0,0,.5) 100%), url(${animation.frames[0].currentFrameImage})`}
      >
        <Text
          fontSize={24}
          position="absolute"
          bottom="2"
          left="2"
          textTransform={"capitalize"}
          fontWeight="700"
          color={"white"}
        >
          {animation.name}
        </Text>
        <Box
          color={"white"}
          position="absolute"
          bottom="1"
          right="2"
          p="1"
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(!showPopup);
          }}
        >
          <span
            class="material-symbols-outlined"
            style={{ userSelect: "none" }}
          >
            settings
          </span>
        </Box>
        {showPopup && (
          <ClickAwayListener onClickAway={() => setShowPopup(false)}>
            <Box
              w="36"
              boxShadow={"2xl"}
              background="gray.800"
              p="2"
              bottom="7"
              rounded={"lg"}
              position={"absolute"}
              right="7"
              zIndex={"40"}
              className="settings"
            >
              <Stack>
                <Text
                  color="white"
                  fontSize="md"
                  userSelect={"none"}
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    Router.push(`/edit/${animation._id}`);
                  }}
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
                    edit
                  </span>
                  {"  "}
                  Edit
                </Text>
                <Divider />
                <Text
                  color="white"
                  fontSize="md"
                  userSelect={"none"}
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                    setShowPopup(false);
                  }}
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
              </Stack>
            </Box>
          </ClickAwayListener>
        )}
      </Box>
      {showModal && (
        <Flex
          alignItems="center"
          justifyContent="center"
          id="modal"
          className="show"
          left={0}
        >
          <Box background={"gray.900"} p="5" m="2" rounded={"xl"}>
            <Heading
              fontSize={"2xl"}
              pb="1"
              display={"flex"}
              justifyContent="space-between"
            >
              Delete animation
              <Text
                onClick={() => {
                  setShowModal(false);
                }}
                class="material-symbols-outlined"
                style={{ userSelect: "none" }}
              >
                close
              </Text>
            </Heading>
            <Text pb="3" fontSize={"lg"}>
              Are you sure you want to delete this animation({animation.name})
            </Text>
            {/* <Divider />
            <Flex w="full" mt="2" justifyContent={"right"}>
              <ButtonGroup variant="outline" spacing="2">
                <Button>Cancel</Button>
                <Button colorScheme={"red"}>Delete</Button>
              </ButtonGroup>
            </Flex> */}
            <Button
              onClick={() => deleteAnimation(animation._id)}
              w="full"
              colorScheme={"red"}
            >
              Delete
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default AnimationComponent;
