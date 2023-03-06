import Head from "next/head";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import AnimationComponent from "../components/home/AnimationComponent";
import { useRouter } from "next/router";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function Home() {
  const Router = useRouter();
  const { isLoading, error, data } = useQuery("animations", () =>
    axios
      .get("https://animation-server.vercel.app/api/animation")
      .then((res) => res)
  );
  const queryClient = useQueryClient();
  const deleteAnimationMutation = useMutation(
    (animationId) =>
      axios.delete(
        `https://animation-server.vercel.app/api/animation/${animationId}`
      ),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("animations");
        console.log(data);
      },
    }
  );
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  if (error) {
    console.log(error);
    return <Box>Error...</Box>;
  }

  const deleteAnimation = (animationId) => {
    const animation = data.data.animation.filter(
      (e) => e._id == animationId
    )[0];
    console.log({ animation });
    deleteAnimationMutation.mutate(animationId);
    animation.frames.forEach((frame) => {
      console.log({ frame });
      axios.delete(
        `https://animation-server.vercel.app/api/frames/${
          frame.currentFrameImage.split("/")[3]
        }`
      );
      axios.delete(
        `https://animation-server.vercel.app/api/frames/${
          frame.currentFrameImageTransparent.split("/")[3]
        }`
      );
      axios.delete(
        `https://animation-server.vercel.app/api/frames/${
          frame.currentFrameImageWithoutBackground.split("/")[3]
        }`
      );
    });
  };
  return (
    <Box p="6" pb={0} bg="gray.800" h="100vh" color="gray.200">
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
      <Heading w="full">Animations</Heading>
      <Flex
        flexWrap={"nowrap"}
        py="4"
        flexDir={"column"}
        className="AnimationContainer"
      >
        <Flex
          className="Animation"
          bg={"gray.700"}
          // w="full"
          // h="52"
          rounded={"md"}
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            Router.push("/new");
          }}
        >
          <span class="material-symbols-outlined" style={{ fontSize: "48px" }}>
            add
          </span>
        </Flex>
        {data.data.animation.map((animation) => (
          <AnimationComponent
            key={animation._id}
            animation={animation}
            deleteAnimation={deleteAnimation}
          />
        ))}
      </Flex>
    </Box>
  );
}
