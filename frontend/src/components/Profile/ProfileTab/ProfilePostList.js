import React from "react";
import { Grid, Skeleton, VStack, Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePost } from "./ProfilePost.js";
import { useParams } from "react-router-dom";
import { getProfileByUsername, getPostById } from "../../../api/Api.js";
import { Error } from "../../../models/Toast.js";

export const ProfilePostList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { profileUser, tabName } = useParams();
  const [postList, setPostList] = useState([]);
  const isGetShortListData = "false";
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    getProfileByUsername(profileUser, isGetShortListData)
      .then((res) => {
        const profileData = res.data;
        const posts = [];

        profileData.posts.forEach((postId) => {
          getPostById(postId)
            .then((res) => {
              posts.push(res.data.data);
            })
            .catch((err) => {
              console.log(err.response.data.message);
              toast(new Error(err));
            });
        });
        setPostList(posts);
      })
      .catch((err) => {
        // console.log(err);
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, [profileUser]);

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
        postList.map((post, index) => <ProfilePost key={index} img={post.imgURLs[0]} nam="nam" />)}
    </Grid>
  );
};
