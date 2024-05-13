import { Box, Flex, IconButton, useToast } from "@chakra-ui/react";
import { Col, Row, Container } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import SuggestedUserHeader from "../../components/SuggestedUsers/SuggestedUserHeader";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { getProfileByUsername } from "../../api/Api.js";
import CreateStoryModal from "../../components/CreateStory/CreateStoryModal.js";
import { SkeletonCircle } from "@chakra-ui/react";

export const Home = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  const toast=useToast()
  const [profilePicURL, setProfilePicURL] = useState("");
  const [fullName, setFullName] = useState("");
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)
  const[loading, setLoading] = useState(true)

  useEffect(() => {
    getProfileByUsername(currentUser)
      .then((res) => {
        const profileData = res.data;
        setProfilePicURL(profileData.profilePicURL);
        setFullName(profileData.fullName);
        
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
    },[currentUser])
  return (
    <Container maxW={"container.lg"}>
      <Flex gap={20}>
        <Box flex={2} py={10}>
        {loading && <SkeletonCircle size='20'/>}
        {!loading && 
        <Avatar src={profilePicURL} size="lg">
        <AvatarBadge
            cursor="pointer"
            boxSize='1.25em' 
            bg='gray.200'
            _hover={{bg: "gray.400"}}
            onClick={handleShow}
          >
            <AddIcon color="black" fontSize="10px" />
          </AvatarBadge>
          </Avatar>
        }
          {show && (<CreateStoryModal func={handleClose} show={show} />) }
          
        </Box>
        <Box
          flex={3}
          mr={20}
          display={{ base: "none", lg: "block" }}
          maxW={"300px"}
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
