import React from "react";
import { Avatar, Text, AvatarGroup, Flex } from "@chakra-ui/react";

export const StorySnapshot = ({ img, caption }) => {
  return (
    <Flex>
      <AvatarGroup flexDirection={"column"}>
        <Avatar src="img" />
        <Text>caption</Text>
      </AvatarGroup>
    </Flex>
  );
};
