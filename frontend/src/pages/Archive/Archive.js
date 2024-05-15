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
  Text,
} from "@chakra-ui/react";
import { getStoriesByUsername } from "../../api/Api";
import { ArchiveStory } from "../../components/Story/ArchiveStory";
import { Error, Success } from "../../models/Toast";
import { useParams } from "react-router-dom";

export const Archive = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  const { profileUser } = useParams();
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

  return currentUser === profileUser ? (
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
        templateColumns={{base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)"}}
        gap={5}
        columnGap={5}
      >
        {isLoading &&
          [0, 1, 2, 3].map((_, idx) => (
            <VStack key={idx} alignItems={"flex-start"} gap={4}>
              <Skeleton w={"full"}>
                <Box h="360px"></Box>
              </Skeleton>
            </VStack>
          ))}
        {!isLoading &&
          (storiesData.length > 0 ? (
            storiesData.map((story, index) => (
              <ArchiveStory
                key={index}
                img={story.mediaURL}
                typeOfMedia={story.typeOfMedia}
                isInHighlight={story.isInHighlight}
              />
            ))
          ) : (
            <Text>You don't have any stories</Text>
          ))}
      </Grid>
    </Container>
  ) : (
    <Container className="d-flex mw-100 me-0 ms-0" mt={20} justifyContent={"center"}>
    <Text alignSelf={"center"} fontWeight={"bolder"} fontSize={"20px"}>Only {profileUser} can view this section</Text>
    </Container>
  );
};
