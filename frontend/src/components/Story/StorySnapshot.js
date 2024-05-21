import React from "react";
import { Avatar, Text, Box } from "@chakra-ui/react";

export const StorySnapshot = ({ img, caption }) => {
  return (
    <Box
      className="mt-0"
      direction={"column"}
      justifyContent={"center"}
      cursor={"pointer"}
    >
      <Box className="d-flex" justifyContent={"center"}>
        <Text className="mb-0 mt-0" F>
          {caption}
        </Text>
      </Box>
      <Avatar src={img} size={"xl"} />
    </Box>
  );
};
