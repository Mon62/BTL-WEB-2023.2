import React, { useEffect } from "react";
import { Container, Flex } from "@chakra-ui/react";
import { ProfileHeader } from "../../components/Profile/ProfileHeader/ProfileHeader.js";
import { ProfileTabs } from "../../components/Profile/ProfileTab/ProfileTabs.js";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const Profile = () => {
  const pathnameParts = window.location.pathname.split("/");
  const [defaultIndexTab, setDefaultIndexTab] = useState(
    pathnameParts[pathnameParts.length - 1] === "saved" ? 1 : 0
  );
  const { profileUser } = useParams();

  return (
    <Container className="mw-100" h={"800px"} overflowY={"auto"}>
      <Flex
        className="py-10 w-full mx-auto"
        px={{ base: 4, md: 20 }}
        justify={"center"}
      >
        <ProfileHeader />
      </Flex>

      <Flex
        className="mw-full mx-auto"
        px={{ base: 4, md: 20 }}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        flexDirection={"column"}
      >
        <ProfileTabs />
      </Flex>
    </Container>
  );
};
