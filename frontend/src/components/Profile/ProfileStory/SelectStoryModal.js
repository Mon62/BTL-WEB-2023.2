import React, { useEffect } from "react";
import {
  Flex,
  Container,
  useToast,
  Grid,
  VStack,
  Skeleton,
  Box,
  GridItem,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import { BiSolidHeartCircle } from "react-icons/bi";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import { useState } from "react";

export const SelectStoryModal = ({
  storiesData,
  isSelectedStories,
  handleSelectStory,

}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Container className="m-0 p-0" h={"540px"} overflow={"auto"}>
      <Grid
        className=""
        mx={15}
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        columnGap={1}
        rowGap={1}
      >
        {isLoading &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
            <VStack key={idx} alignItems={"flex-start"} gap={4}>
              <Skeleton w={"full"}>
                <Box h="170px"></Box>
              </Skeleton>
            </VStack>
          ))}
        {!isLoading &&
          storiesData.map((story, index) => (
            <GridItem
              key={index}
              _hover={{ opacity: 0.5 }}
              className="shadow"
              cursor={"pointer"}
              borderRadius={4}
              border={"1px solid"}
              borderColor={"blackAlpha.300"}
              position={"relative"}
              aspectRatio={3 / 4}
              onClick={() => handleSelectStory(index)}
            >
              <Flex
                position={"absolute"}
                top={1}
                right={1}
                zIndex={1}
                className="shadow"
              >
                {story.isInHighlight === true ? (
                  <BiSolidHeartCircle color="white" size={25} />
                ) : (
                  <></>
                )}
              </Flex>
              <Flex
                position={"absolute"}
                top={1}
                left={1}
                zIndex={1}
                className="shadow"
              >
                {isSelectedStories[index] ? (
                  <FaCircleCheck color="white" size={25} />
                ) : (
                  <RiCheckboxBlankCircleLine color="white" size={25} />
                )}
              </Flex>
              {story.typeOfMedia === "picture" ? (
                <Image
                  src={story.mediaURL}
                  w={"100%"}
                  h={"100%"}
                  objectFit={"cover"}
                ></Image>
              ) : (
                <AspectRatio ratio={3 / 4} objectFit={"cover"}>
                  <iframe title="archive story" src={story.mediaURL} />
                </AspectRatio>
              )}
            </GridItem>
          ))}
      </Grid>
    </Container>
  );
};
