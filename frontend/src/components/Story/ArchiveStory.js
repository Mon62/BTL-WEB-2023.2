import { Flex, GridItem, Image, Box, AspectRatio } from "@chakra-ui/react";
import { BiSolidHeartCircle } from "react-icons/bi";

export const ArchiveStory = ({ img, typeOfMedia, isInHighlight }) => {
  return (
    <>
      <GridItem
        _hover={{ opacity: 0.5 }}
        className="shadow"
        cursor={"pointer"}
        borderRadius={4}
        border={"1px solid"}
        borderColor={"blackAlpha.300"}
        position={"relative"}
        aspectRatio={3 / 4}
      >
        <Flex
          position={"absolute"}
          top={1}
          right={1}
          zIndex={1}
          className="shadow"
        >
          {isInHighlight === true ? (
            <BiSolidHeartCircle color="white" size={25} />
          ) : (
            <></>
          )}
        </Flex>
        {typeOfMedia === "picture" ? (
          <Image src={img} w={"100%"} h={"100%"} objectFit={"cover"}></Image>
        ) : (
          <AspectRatio ratio={3 / 4} objectFit={"cover"}>
            <iframe title="archive story" src={img} />
          </AspectRatio>
        )}
      </GridItem>
    </>
  );
};
