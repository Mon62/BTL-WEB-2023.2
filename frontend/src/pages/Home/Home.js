import { Box, Flex, useToast, Container } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SuggestedUserHeader from "../../components/SuggestedUsers/SuggestedUserHeader";
import { Avatar, AvatarBadge, Tooltip } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { getShortenedProfileDataByUsername, getMyNewStories, getNewStoriesByUsername } from "../../api/Api.js";
import CreateStoryModal from "../../components/Story/CreateStoryModal.js";
import { SkeletonCircle } from "@chakra-ui/react";
import StoryView from "../../components/Story/StoryView.js";
import FeedPosts from "../../components/FeedPosts/FeedPosts.js";
import { CiPlay1 } from "react-icons/ci";



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
  const [showOtherStory, setShowOtherStory] = useState(false)
  const [otherStory, setOtherStory] = useState([])
  //const [savedPost, setSavedPost] = useState([])


  const handleClickOtherAvatar = () => {
    setOtherStory([])
    getNewStoriesByUsername(currentUser)
      .then((res) => {
        console.log(res.data.data)
        //console.log(typeof res.data.data)
        //console.log(Object.keys(res.data.data))
        if(JSON.stringify(res.data.data) === '{}') return
        else {
        const usernames = Object.keys(res.data.data)

        for (let username of usernames) {
          const stories = res.data.data[username]
          //console.log(stories)
          const storyArray = stories.map((file) => {
            return {
              type: file.typeOfMedia === "picture" ? "image" : "video",
              url: file.mediaURL,
              music: file.musicURL,
              duration: 4000,
              header: {
                heading: username,
                subheading: JSON.parse(file.caption),
                //profileImage: profilePicURL,
              },
            }
          })
          setOtherStory((prev) => prev.concat(storyArray))
        }
        setTimeout(() => {
          setShowOtherStory(true)
          //console.log()
        }, 500);
      }
      })
      
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

  }
  const handleClickAvatar = () => {
    setMyStory([])
    getMyNewStories(currentUser)
      .then((res) => {
        const test = res.data;
        //console.log(test.data)
        if (test.data.length === 0) {
          //console.log("empty")
          toast({
            title: "Bạn không có Story nào",
            variant: "subtle",
            duration: 2000,
            isClosable: true,
            position: 'top-right',
          })
        }
        else {
          const storyArray = test.data.map((file) => {
            return {
              type: file.typeOfMedia === "picture" ? "image" : "video",
              url: file.mediaURL,
              music: file.musicURL,
              duration: 4000,
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
          }, 800);
          //setFollowers(profileData.followers);
          //setFollowing(profileData.followingUsers);
          //setPosts(profileData.posts);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

  }

  useEffect(() => {
    getShortenedProfileDataByUsername(currentUser)
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
    }, 3000)
  }, [currentUser])


  return (
    <>
      {showStory && <StoryView isOpen={showStory} onClick={() => setShowStory(false)} handleClose={() => setShowStory(false)} stories={myStory} />}
      {showOtherStory && <StoryView isOpen={showOtherStory} onClick={() => setShowOtherStory(false)} handleClose={() => setShowOtherStory(false)} stories={otherStory} />}

      <Container maxW={"container.lg"} top={0} maxH={"80vh"}>

        <Flex gap={20} alignItems={"start"}>
          <Box flex={2} py={10} maxWidth={550}>

            {loading &&
            <Flex gap={8}>
            <SkeletonCircle size='20' />
            <SkeletonCircle size='20' />
            </Flex>
            }
            {!loading &&
            <Flex gap={8}>
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
              <Tooltip label="Xem story của người mà bạn follow" bg="blue.400">
              <Avatar bg='red.400' icon={<CiPlay1 fontSize='1.5rem' />}
              size="lg" cursor="pointer" onClick={handleClickOtherAvatar}>
              </Avatar>
              </Tooltip>
              </Flex>
            }
            {show && (<CreateStoryModal func={handleClose} show={show} />)}
            <Flex>
              <FeedPosts />
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
    </>

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
