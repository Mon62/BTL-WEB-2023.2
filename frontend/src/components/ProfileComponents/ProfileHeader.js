import React from "react";
import {
  Avatar,
  AvatarGroup,
  Flex,
  Stack,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";

export const ProfileHeader = () => {
  return (
    <Flex
      gap={{ base: 4, sm: 10 }}
      py={10}
      direction={{ base: "column", md: "row" }}
    >
      <AvatarGroup
        size={{ base: "xl", md: "2xl" }}
        justifyContent={"center"}
        alignSelf={"flex-start"}
        mx={"auto"}
      >
        <Avatar name="" src="" alt="Ảnh đại diện"></Avatar>
      </AvatarGroup>
      <VStack  gap={2} alignItems={"start"} flex={1}>
        <Flex
          gap={4}
          direction={{ base: "column", md: "revert" }}
          justify={{ base: "center", md: "flex-start" }}
          // alignContent={"center"}
          w={"full"}
        >
          <Flex fontSize={{ base: "sm", md: "lg" }} alignItems={"center"} m={0}>dddd</Flex>
          <Flex gap={4} justifyItems={"center"}>
            <Button
              bg={"white"}
              color={"black"}
              _hover={{ bg: "whiteAlpha.800" }}
              size={{ base: "xs", md: "sm" }}
            >
              Edit profile
            </Button>
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={{base: 2, sm: 4}}>
          <Text fontSize={{base: "xs", md: "sm"}}>
            <Text as="span" fontWeight={"bold"} mr={1}>4</Text>
            Posts
          </Text>
          <Text fontSize={{base: "xs", md: "sm"}}>
            <Text as="span" fontWeight={"bold"} mr={1}>10</Text>
            Followers
          </Text>
          <Text fontSize={{base: "xs", md: "sm"}}>
            <Text as="span" fontWeight={"bold"} mr={1}>20</Text>
            Following
          </Text>
        </Flex>

        <Flex alignItems={"center"} gap={4}>
          <Text fontSize={"sm"} fontWeight={"bold"}>ddddd</Text>
          <Text fontSize={"sm"}>mmmmmmmmmm</Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
