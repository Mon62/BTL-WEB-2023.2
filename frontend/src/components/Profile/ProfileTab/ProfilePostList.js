import React from "react";
import {
  Grid,
  Skeleton,
  VStack,
  Box,
  useToast,
  Flex,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  Button,
  AlertDialogCloseButton,
  AlertDialogOverlay,
  AlertDialogHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePost } from "./ProfilePost.js";
import { useParams } from "react-router-dom";
import {
  getPostsByUsername,
  getSavedPosts,
  deletePost,
} from "../../../api/Api.js";
import { Error, Success } from "../../../models/Toast.js";

export const ProfilePostList = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const { profileUser } = useParams();
  const [postsData, setPostsData] = useState([]);
  const toast = useToast();
  const [savedPost, setSavedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(-1);
  const currentUser = sessionStorage.getItem("currentUser");

  useEffect(() => {
    if (!isOpen) setIsLoading(true);
    getPostsByUsername(profileUser)
      .then((res) => {
        setPostsData(res.data.postsData.reverse());
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [profileUser, isOpen]);

  useEffect(() => {
    getSavedPosts(profileUser)
      .then((res) => {
        const savedArray = res.data.data.map((file) => {
          return { pid: file.pid };
        });
        setSavedPost(savedArray);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  }, [profileUser, isOpen]);

  const handleDeletePost = (index) => {
    // console.log(postsData[index])
    deletePost({ pid: postsData[index].postId })
      .then((res) => {
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };

  return (
    <Grid
      templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={2}
      columnGap={2}
    >
      {isLoading &&
        [0, 1, 2, 3, 4, 5].map((_, idx) => (
          <VStack key={idx} alignItems={"flex-start"} gap={4}>
            <Skeleton w={"full"}>
              <Box h="300px"></Box>
            </Skeleton>
          </VStack>
        ))}
      {!isLoading &&
        postsData.map((post, index) => (
          <Flex direction={"column"}>
            <ProfilePost
              key={index}
              img={post.firstPicURL}
              typeOfFirstMedia={post.typeOfFirstMedia}
              numberOfMediaFile={post.numberOfMediaFile}
              postID={post.postId}
              savedPost={savedPost}
            />
            {currentUser === profileUser && (
              <Text
                color={"red"}
                textTransform={"none"}
                fontWeight={"normal"}
                onClick={() => {
                  setSelectedPostIndex(index);
                  onOpen();
                }}
              >
                Delete
              </Text>
            )}
          </Flex>
        ))}

      <AlertDialog onClose={onClose} isOpen={isOpen} isCentered>
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Highlight Story</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody className="fs-5">
            Are you sure you want to delete this highlight story?
            <hr className="solid my-2" />
            <Flex justifyContent={"flex-end"}>
              <Button className="mt-2 mb-2" onClick={onClose}>
                No
              </Button>
              <Button
                className="mb-2 mt-2"
                onClick={() => handleDeletePost(selectedPostIndex)}
                colorScheme="red"
                ml={3}
              >
                Yes
              </Button>
            </Flex>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </Grid>
  );
};
