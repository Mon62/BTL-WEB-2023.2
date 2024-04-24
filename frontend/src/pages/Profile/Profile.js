import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import { ProfileHeader } from "../../components/ProfileComponents/ProfileHeader";
import { ProfileTabs } from "../../components/ProfileComponents/ProfileTabs";
import { ProfilePost } from "../../components/ProfileComponents/ProfilePosts";
import { useState } from "react";
import { storage } from "../../firebase/firebase.js";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export const Profile = () => {
  return (
    <Container className="p-3 shadow m-2" maxW="container.lg" py={5}>
      {/* <Flex
        py={10}
        px={4}
        pl={{ base: 4, md: 10 }}
        w={"full"}
        mx={"auto"}
        flexDirection={"column"}
      >
        <ProfileHeader />
      </Flex>
      <Flex
        px={{ base: 2, sm: 4 }}
        maxW={"full"}
        mx={"auto"}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        direction={"column"}
      >
        <ProfileTabs />
        <ProfilePost />
      </Flex> */}

      <form action="account/edit" method="POST" encType="multipart/form-data">
        <input type="file" name="profilePic" accept="image/*"></input>
        <button type="submit" className="border">
          Upload Image
        </button>
      </form>
    </Container>
  );
};
