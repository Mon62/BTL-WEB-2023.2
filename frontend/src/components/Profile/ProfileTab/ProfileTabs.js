import React from "react";
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

export const ProfileTabs = ({ defaultIndexTab, profileUser }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  // console.log(currentUser, profileUser);
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
        defaultIndex={defaultIndexTab}
      >
        <TabList className="mb-3">
          <Tab gap={2}>
            <BsGrid3X3 />
            Posts
          </Tab>
          <Tab gap={2}>
            <BsBookmark />
            Saved
          </Tab>
          <Tab gap={2}>
            <BsPersonSquare />
            Tagged
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
