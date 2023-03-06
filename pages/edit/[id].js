import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Box,
  Button,
  extendTheme,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";

const EditAnimation = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery(["animation", id], () =>
    axios
      .get(`https://animation-server.vercel.app/api/animation/${id}`)
      .then((res) => res)
  );

  const [name, setName] = useState("");
  const [frameRate, setFrameRate] = useState("");

  const editAnimationMutation = useMutation(
    () =>
      axios.patch(`https://animation-server.vercel.app/api/animation/${id}`, {
        name,
        frameRate,
      }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("animations");
        console.log(data);
        Router.push("/");
      },
    }
  );

  useEffect(() => {
    if (!data) return;
    setName(data.data.animation.name);
    setFrameRate(data.data.animation.frameRate);
  }, [data]);
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  if (error) {
    console.log(error);
    return <Box>Error...</Box>;
  }

  const editAnimation = () => {
    editAnimationMutation.mutate();
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
            Edit animation
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
          <Button w="full" onClick={editAnimation} colorScheme="green" mt={4}>
            Edit
          </Button>
        </Box>
      </Flex>
      <div class="animeTWD">
        <div class="animeBlurTWD"></div>
      </div>
    </>
  );
};

export default EditAnimation;
