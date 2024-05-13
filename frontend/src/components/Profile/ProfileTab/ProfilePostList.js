import React from "react";
import { Grid, Skeleton, VStack, Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePost } from "./ProfilePost.js";
import { useParams } from "react-router-dom";
import { getPostsByUsername } from "../../../api/Api.js";
import { Error } from "../../../models/Toast.js";

export const ProfilePostList = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { profileUser } = useParams();
  const [postsData, setPostsData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
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
        postsData.map((post, index) => (
          <ProfilePost
            key={index}
            img={post.firstPicURL}
            likes={post.numberOfLikes}
            comments={post.numberOfComments}
          />
        ))}
    </Grid>
  );
};
