import React, { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  Grid,
  useToast,
  VStack,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import { getStoriesByUsername } from "../../api/Api";
import { ArchiveStory } from "../../components/Story/ArchiveStory";
import { Error, Success } from "../../models/Toast";

export const Archive = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [isLoading, setIsLoading] = useState(true);
  const [storiesData, setStoriesData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);

    getStoriesByUsername(currentUser)
      .then((res) => {
        setStoriesData(res.data.storiesData.reverse());
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <Container className="m-0 mw-100" px={10} h={"800px"} overflow={"auto"}>
      <Container className="mw-100">
        <Flex>
          <Button
            className="p-0 mb-3"
            gap={4}
            dir="row"
            bg={"white.alpha300"}
            fontSize={"20px"}
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon />
            Archive
          </Button>
        </Flex>
        <h6 className="fs-6 fw-normal">
          Only you can see your archived stories unless you choose to share
          them.
        </h6>
        <hr className="solid m-0" />
      </Container>

      <Grid
        className="mt-5 mb-5"
        mx={15}
        templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
        gap={5}
        columnGap={5}
      >
        {isLoading &&
          [0, 1, 2].map((_, idx) => (
            <VStack key={idx} alignItems={"flex-start"} gap={4}>
              <Skeleton w={"full"}>
                <Box h="480px"></Box>
              </Skeleton>
            </VStack>
          ))}
        {!isLoading &&
          storiesData.map((story, index) => (
            <ArchiveStory key={index} img={story.mediaURL} h={"480px"}/>
          ))}
      </Grid>
    </Container>
  );
};
