import { Box, Flex, IconButton, useToast, Container } from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import SuggestedUserHeader from "../../components/SuggestedUsers/SuggestedUserHeader";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { getProfileByUsername, getMyNewStories } from "../../api/Api.js";
import CreateStoryModal from "../../components/Story/CreateStoryModal.js";
import { SkeletonCircle } from "@chakra-ui/react";
import StoryView from "../../components/Story/StoryView.js";
import FeedPosts from "../../components/FeedPosts/FeedPosts.js";


export const Home = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  const toast = useToast()
  const [profilePicURL, setProfilePicURL] = useState("");
  const [fullName, setFullName] = useState("");
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)
  const [loading, setLoading] = useState(true)
  const [showStory, setShowStory] = useState(false)
  const [myStory, setMyStory] = useState([])

  const handleClickAvatar = () => {
    setMyStory([])
    getMyNewStories(currentUser)
      .then((res) => {
        const test = res.data;
        console.log(test.data)
        const storyArray = test.data.map((file) => {
          return {
            type: file.typeOfMedia === "picture" ? "image" : "video",
            url: file.mediaURL,
            music: file.musicURL,
            duration: 5000,
            header: {
              heading: currentUser,
              subheading: JSON.parse(file.caption),
              profileImage: profilePicURL,
            },
          }
        })
        setMyStory(storyArray);

        setTimeout(() => {
          setShowStory(true)
          console.log(myStory)
        }, 100);
        //setFollowers(profileData.followers);
        //setFollowing(profileData.followingUsers);
        //setPosts(profileData.posts);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

  }

  useEffect(() => {
    getProfileByUsername(currentUser)
      .then((res) => {
        const profileData = res.data;
        setProfilePicURL(profileData.profilePicURL);
        setFullName(profileData.fullName);
        setLoading(false);
        //setFollowers(profileData.followers);
        //setFollowing(profileData.followingUsers);
        //setPosts(profileData.posts);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
    setTimeout(() => {
      setLoading(false);
    }, 4500)
  }, [currentUser])
  return (
    <Container maxW={"container.lg"} top={0} maxH={"80vh"}>
      {showStory && <StoryView isOpen={showStory} onClick={() => setShowStory(false)} handleClose={() => setShowStory(false)} stories={myStory} />}
      <Flex gap={20} alignItems={"start"}>
        <Box flex={2} py={10}  maxWidth={550}>

            {loading && <SkeletonCircle size='20' />}
            {!loading &&
              <Avatar src={profilePicURL} size="lg" cursor="pointer" onClick={handleClickAvatar}>
                <AvatarBadge
                  cursor="pointer"
                  boxSize='1.25em'
                  bg='gray.200'
                  _hover={{ bg: "gray.400" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShow();
                  }}
                >
                  <AddIcon color="black" fontSize="10px" />
                </AvatarBadge>
              </Avatar>
            }
            {show && (<CreateStoryModal func={handleClose} show={show} />)}
            <Flex>
              <FeedPosts/>
            </Flex>
          </Box>
          
        <Box
          flex={3}
          mr={20}
          display={{ base: "none", xl: "block" }}
          maxW={"300px"}
          //border={"1px solid red"}
        >
          <SuggestedUserHeader />
        </Box>
      </Flex>
    </Container>

    //<Container maxW={"container.lg"}>
    // <Flex gap={40}>
    //<Box flex={2} py={10} border={"1px solid blue"}>post</Box>
    //<Box flex={3} mr={20} display={{base:"none", md:"block"}} maxW={"300px"} border={"1px solid red"}>
    //Suggested user
    //</Box>
    //</Flex>
    //</Container>
  );
}
