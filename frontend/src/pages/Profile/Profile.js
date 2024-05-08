import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import { ProfileHeader } from "../../components/Profile/ProfileHeader/ProfileHeader.js";
import { ProfileTabs } from "../../components/Profile/ProfileTab/ProfileTabs.js";

export const Profile = () => {
  return (
    <Container className="mw-100" h={"800px"} overflowY={"auto"}>
      <Flex
        className="py-10 px-4 w-full mx-auto"
        pl={{ base: 4, md: 10 }}
        justify={"center"}
      >
        <ProfileHeader />
      </Flex>

      <Flex
        className="mw-full mx-auto"
        px={{ base: 2, sm: 4 }}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        flexDirection={"column"}
      >
        <ProfileTabs />
      </Flex>
    </Container>
  );
};
