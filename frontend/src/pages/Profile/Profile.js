import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import { ProfileHeader } from "../../components/Profile/ProfileHeader.js";
import { ProfileTabs } from "../../components/Profile/ProfileTabs.js";
import { ProfilePosts } from "../../components/Profile/ProfilePosts.js";
// import { useState } from "react";
// import { storage } from "../../firebase/firebase.js";
// import { ref, uploadBytes } from "firebase/storage";
// import { v4 } from "uuid";

export const Profile = () => {
  return (
    <Container
      className="shadow"
      maxW="container.lg"
      py={5}
      h={"800px"}
      overflowY={"auto"}
    >
      <Flex
        py={10}
        px={4}
        pl={{ base: 4, md: 10 }}
        w={"full"}
        mx={"auto"}
        justify={"center"}
      >
        <ProfileHeader />
      </Flex>
    
      <Flex
        px={{ base: 2, sm: 4 }}
        maxW={"full"}
        mx={"auto"}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        flexDirection={"column"}
      >
        <ProfileTabs />
        <ProfilePosts />
      </Flex>
    </Container>
  );
};
