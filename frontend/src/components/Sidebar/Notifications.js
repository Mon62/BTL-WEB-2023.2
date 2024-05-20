import React, { useState, useEffect } from 'react'
import { Box, DrawerBody, Flex, Tooltip, Container, useDisclosure } from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { VStack, Text } from '@chakra-ui/react';
import { getNotificationsByUsername, getShortenedProfileDataByUsername } from '../../api/Api';
import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import ViewPost from '../ViewPost/ViewPost';
import { useNavigate } from 'react-router-dom';

const NotiSkeleton = () => {
  return (
  <Flex gap={4} w={"full"} alignItems={"center"}>
    <SkeletonCircle h={10} w='10' />
    <Flex gap={1} flexDir={"column"}>
      <Skeleton height={2} width={100} />
      <Skeleton height={2} width={50} />
    </Flex>
  </Flex>
  )
}

const Notifications = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const userName = sessionStorage.getItem("currentUser")
  const [notiData, setNotiData] = useState([])
  //const [avaArray, setAvaArray] = useState ([])
  const [loading, setLoading] = useState(true)
  const [showPost, setShowPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState("")
  //const [from, setFrom] = useState("")
  const navigate = useNavigate()
  const handleShowPost = (postID, sender) => {
    setSelectedPost(postID)
    //setFrom(sender)
    setShowPost(true)
    onClose();
    //setAvaArray([])
    if (postID === ""){
      navigate(`/profile/${sender}`)
    }
  }
  const handleClosePost = () => {
    setShowPost(false)
    setSelectedPost("")
    //setFrom("")
    //onClose()
  }

  const handleClick = () => {
    onOpen();
    setShowPost(false)
    if (typeof props.handleBg === 'function') {
      props.handleBg();
    }

    getNotificationsByUsername(userName)
      .then((res) => {
        //console.log("fetch again");
        const dataArray = res.data;
        setNotiData((prev) => [
          ...prev,
          ...dataArray.map((file) => ({
            message: file.message,
            sender: file.sender,
            postID: file.postId,
            type: file.type,
            ava: file.senderProfilePicURL,
          })),
        ]);
        setLoading(false)

      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
      //setTimeout(() => {
      //}, 3000);
  };

  /*useEffect(() => {
    if (notiData.length > 0) {
      notiData.forEach((file) => {
        getShortenedProfileDataByUsername(file.sender)
          .then((res) => {
            //console.log(res.data);
            setAvaArray((prev) => prev.concat(res.data.profilePicURL))
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      });
    }
  }, [notiData]);*/

  const handleClose = () => {
    setNotiData([])
    //setAvaArray([])
    setSelectedPost("")
    //setFrom("")
    setLoading(true)
    setShowPost(false)
    onClose();
    if (typeof props.handlePrevBg === 'function') {
      (props.handlePrevBg)();
    }
    //console.log(notiData)
    //console.log(avaArray)
    
  }
  return (
    <>
    <Tooltip
      hasArrow
      label="Notifications"
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Flex
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "blackAlpha.300" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        onClick={handleClick}
        bg={props.bg}
      >
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={handleClose}
        //finalFocusRef={btnRef}
        >
          <DrawerContent marginLeft={{ base: 70, md: 60 }} zIndex={500}>
            <DrawerCloseButton />
            <DrawerHeader>Notifications</DrawerHeader>
            <DrawerBody>
            <hr className="solid mt-0" />

              <Container className="p-0" gap={10} h={"620px"} overflow={"auto"}>
                {loading && (
                  <VStack gap={3}>
                  <NotiSkeleton />
                  <NotiSkeleton/>
                  <NotiSkeleton/>
                  <NotiSkeleton/>
                  <NotiSkeleton/>
                  <NotiSkeleton/>
                  </VStack>
                )}
                {!loading &&
                  notiData.map((each, index) => (
                    
                  <Flex >
                    <Flex className="mb-2 mt-2" w={"400px"} dir="row" gap={3} cursor={"pointer"} onClick={() => handleShowPost(each.postID, each.sender)}>
                      <AvatarGroup alignSelf={"center"}>
                        <Avatar
                          //cursor={"pointer"}
                          src={each.ava}
                        //onClick={() =>
                        //navigate(`/profile/${result.username}`)
                        //}
                        />
                      </AvatarGroup>
                      <VStack
                        className=""
                        justifyContent={"flex-start"}
                        gap={0}
                      >
                        <Text
                          className="m-0"
                          style={{ fontWeight: "500" }}
                          //cursor={"pointer"}
                          alignSelf={"flex-start"}
                        >
                         {each.sender}
                        </Text>
                        {true && (
                          <Text className="m-0" style={{}}>
                            {each.message}
                          </Text>
                        )}
                      </VStack>
                    </Flex>
                  </Flex>
                  
                  ))}
                
              </Container>
            </DrawerBody>

          </DrawerContent>
        </Drawer>
        <NotificationsLogo />
        <Box display={{ base: "none", md: "block" }} fontWeight={props.fontWeight}>Notifications</Box>

      </Flex>
    </Tooltip>
    {showPost && selectedPost !== "" && <ViewPost show={showPost} onHide={handleClosePost} postID={selectedPost} createdBy={sessionStorage.getItem("currentUser")}/>}

    </>
    
  )
}

export default Notifications
