import React from 'react'
import { useState, useEffect } from 'react';
import { Avatar, Flex, Link, Skeleton, Text, VStack, useToast } from '@chakra-ui/react'
//import { useNavigate } from 'react-router-dom';
//import { logout } from "../../api/Api.js";
import SwitchAccountForm from '../Sidebar/SwitchAccountForm.js';
import { getShortenedProfileDataByUsername } from "../../api/Api.js";
import { SkeletonCircle } from '@chakra-ui/react'


const SuggestedUserHeader = () => {
  const [show, setShow] = useState(false);
  const currentUser = sessionStorage.getItem("currentUser");
  const [profilePicURL, setProfilePicURL] = useState("");
  const [fullName, setFullName] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(true)
  //Logout
  //const navigate = useNavigate()
  const toast = useToast()
  useEffect(() => {
    getShortenedProfileDataByUsername(currentUser)
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
      setLoading(false)
    }, 2000)
  }, [currentUser])

  /*const handleLogout = (e) => {
    e.preventDefault();
    // Call API to logout
    logout()
      .then((res) => {
        toast({
          title: 'Logging Out',
          description: "You need to log back in",
          status: 'loading',
          duration: 2000,
          isClosable: true,
        })
        setTimeout(() => navigate("/login"), 2000
        )
      })
      .catch((err) => {
        console.log(err.response.data);
      });

  }*/

  return (
    <VStack py={8} px={6} gap={4}>
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} gap={10}>
        {loading && <Skeleton1 />}
        {!loading &&
          <>
            <Flex alignItems={"center"} gap={2}>



              <Avatar src={profilePicURL} size={'lg'} />
              <Text fontSize={14} fontWeight={'bold'} alignItems={"center"} marginBottom={0} >{currentUser}</Text>


            </Flex>
            <Link
              fontWeight={'medium'}
              fontSize={14}
              color='blue.400'
              cursor={'pointer'}
              style={{ textDecoration: "none" }}
              _hover={{ color: "black" }}
              onClick={handleShow}
            >Switch</Link>
            <SwitchAccountForm showAtt={show} handleCloseAtt={handleClose} />
          </>}
      </Flex>
    </VStack>
  )
}

export default SuggestedUserHeader

const Skeleton1 = () => {
  return (
    <Flex alignItems={"center"} gap={2}>
      <SkeletonCircle size='20' />

      <Skeleton width="130px" height="8px" />

    </Flex>
  )
}