import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { dataURItoBlob, imageUrlToDataURI } from "../utils/Util";

const NewAnimation = () => {
  const [name, setName] = useState("");
  const [frameRate, setFrameRate] = useState(8);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      let dataUrl = await imageUrlToDataURI(
        "https://animation-js-server.onrender.com/frame.jpg"
      );
      var blobObject = dataURItoBlob(dataUrl);
      var fdataobj = new FormData();
      fdataobj.append("frame", blobObject);
      const rsp = await axios.post(
        "https://animation-server.vercel.app/frames",
        fdataobj,
        {}
      );
      let dataUrl3 = await imageUrlToDataURI(
        "https://animation-js-server.onrender.com/frame.png"
      );
      var blobObject3 = dataURItoBlob(dataUrl3);
      var fdataobj3 = new FormData();
      fdataobj3.append("frame", blobObject3);
      const rsp2 = await axios.post(
        "https://animation-server.vercel.app/frames",
        fdataobj3,
        {}
      );
      console.log({ rsp });
      let dataUrl2 = await imageUrlToDataURI(
        "https://animation-js-server.onrender.com/frame_transparent.png"
      );
      var blobObject2 = dataURItoBlob(dataUrl2);
      var fdataobj2 = new FormData();
      fdataobj2.append("frame", blobObject2);
      const rsp3 = await axios.post(
        "https://animation-server.vercel.app/frames",
        fdataobj2,
        {}
      );

      const result = await axios.post(
        "https://animation-server.vercel.app/animation/",
        {
          name,
          frameRate,
          frames: [
            {
              currentFrameImageWithoutBackground: `https://animation-js-server.onrender.com/${rsp3.data.filename}`,
              currentFrameImage: `https://animation-js-server.onrender.com/${rsp.data.filename}`,
              previousFrameImage: null,
              currentFrameImageTransparent: `https://animation-js-server.onrender.com/${rsp2.data.filename}`,
            },
          ],
        }
      );
      console.log(result.data);
      router.push("/");
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("animations");
      },
    }
  );
  const router = useRouter();
  const createAnimation = () => {
    mutation.mutate();
  };
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        p="3"
        pb={0}
        bg="gray.800"
        h="100vh"
        color="gray.200"
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
        <Box
          bg="gray.700"
          p="6"
          rounded={"lg"}
          style={{ width: "min(95%, 600px)" }}
        >
          <Heading w="full" fontSize={"3xl"} mb="2">
            New animation
          </Heading>
          <FormControl variant="floating">
            <Input
              placeholder=" "
              mt="4"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <FormLabel>Animation Name</FormLabel>
          </FormControl>
          <FormControl variant="floating">
            <Input
              placeholder=" "
              mt="4"
              value={frameRate}
              onChange={(event) => setFrameRate(event.target.value)}
            />
            <FormLabel>Frame Rate</FormLabel>
          </FormControl>
          <Button w="full" onClick={createAnimation} colorScheme="green" mt={4}>
            Create
          </Button>
        </Box>
      </Flex>
      <div class="animeTWD">
        <div class="animeBlurTWD"></div>
      </div>
    </>
  );
};

export default NewAnimation;
