import React from "react";
import { Avatar, Text, Box } from "@chakra-ui/react";

export const StorySnapshot = ({ img, caption }) => {
  return (
    <Box
      className="mt-2"
      direction={"column"}
      justifyContent={"center"}
      cursor={"pointer"}
    >
        <Avatar src={img} size={"xl"} />
      <Box className="d-flex"  justifyContent={"center"}>
        <Text className="mb-0 mt-2"F>
          {caption}
        </Text>
      </Box>
    </Box>
  );
};
