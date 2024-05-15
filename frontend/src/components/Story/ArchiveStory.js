/* eslint-disable jsx-a11y/iframe-has-title */
import { Flex, GridItem, Image, Box, AspectRatio } from "@chakra-ui/react";

export const ArchiveStory = ({ img }) => {
  return (
    <>
      <GridItem
        className="shadow"
        cursor={"pointer"}
        borderRadius={4}
        border={"1px solid"}
        borderColor={"blackAlpha.300"}
        position={"relative"}
        aspectRatio={3 / 4}

        // onClick={onOpen}
      >
        <Image src={img} w={"100%"} h={"100%"} objectFit={"cover"}></Image>
        {/* <AspectRatio  ratio={3 / 4} objectFit={"cover"}>
          <iframe
            title=""
            src={img}
            // allowFullScreen
          />
        </AspectRatio> */}
      </GridItem>
    </>
  );
};
