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

export const ProfileTabs = () => {
  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{ base: 4, sm: 10 }}
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      {/* <Flex gap={{base: 12}}>
        <hr className="solid" style={{ width: 500 }}></hr>
      </Flex> */}
      <Tabs position="relative" variant="unstyled">
        <TabList>
          <Tab>
            {" "}
            <BsGrid3X3 />
            POSTS
          </Tab>
          <Tab>
            <BsBookmark />
            SAVED
          </Tab>
          <Tab>
            <BsPersonSquare />
            TAGGED
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
