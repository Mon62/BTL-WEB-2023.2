import React, {useEffect, useState} from "react";
import { Tooltip, Flex, Box, Avatar, Link, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getProfileByUsername } from "../../api/Api.js";
import { SkeletonCircle } from "@chakra-ui/react";

const Profile = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [profilePicURL, setProfilePicURL] = useState("");
  const [loading, setLoading] = useState(true)
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    getProfileByUsername(currentUser)
      .then((res) => {
        const profileData = res.data;
        setProfilePicURL(profileData.profilePicURL);
        
        
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
  const handleClick = (e) => {
    navigate(`/profile/${sessionStorage.getItem("currentUser")}`);
  };
  return (
    <Tooltip
      hasArrow
      label="Profile"
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Flex
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "blackAlpha.200" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        onClick={handleClick}
      >
        {loading && <SkeletonCircle size='6'/>}
        {!loading && <Avatar size={"xs"} src={profilePicURL} />}
        <Box display={{ base: "none", md: "block" }}>Profile</Box>
      </Flex>
    </Tooltip>
  );
};

export default Profile;
