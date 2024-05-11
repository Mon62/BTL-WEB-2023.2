import React, { useEffect } from "react";
import {
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabIndicator,
} from "@chakra-ui/react";
import { BsGrid3X3, BsBookmark, BsPersonSquare } from "react-icons/bs";
import { ProfilePostList } from "./ProfilePostList";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export const ProfileTabs = () => {
  const { profileUser, tabName } = useParams();
  const [tabIndex, setTabIndex] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    setTabIndex((tabName === undefined ? 0 : (tabName === "saved" ? 1 : 2)));
  }, [tabName])
  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{ base: 4, sm: 10 }}
      textTransform={"uppercase"}
      fontWeight={"bold"}
      direction="column"
    >
      <Tabs
        position="relative"
        className="mb-4"
        isFitted
        index={tabIndex}
        
      >
        <TabList className="mb-4">
          <Tab gap={2} onClick={() => navigate("/profile/" + profileUser)}>
            <BsGrid3X3 />
            Posts
          </Tab>
          <Tab
            gap={2}
            onClick={() => navigate("/profile/" + profileUser + "/saved")}
          >
            <BsBookmark />
            Saved
          </Tab>
          <Tab
            gap={2}
            onClick={() => navigate("/profile/" + profileUser + "/tagged")}
          >
            <BsPersonSquare />
            Tagged
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding={0}>
            <ProfilePostList />
          </TabPanel>
          <TabPanel>
            <p>SAVED</p>
          </TabPanel>
          <TabPanel>
            <p>TAGGED</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
