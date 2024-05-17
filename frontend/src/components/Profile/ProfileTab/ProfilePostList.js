import React from "react";
import { Grid, Skeleton, VStack, Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePost } from "./ProfilePost.js";
import { useParams } from "react-router-dom";
import { getPostsByUsername, getShortenedProfileDataByUsername } from "../../../api/Api.js";
import { Error } from "../../../models/Toast.js";

export const ProfilePostList = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { profileUser } = useParams();
  const [postsData, setPostsData] = useState([]);
  const toast = useToast();
  const [profilePicURL, setProfilePicURL] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getPostsByUsername(profileUser)
      .then((res) => {
         console.log(res);
        setPostsData(res.data.postsData.reverse());
        // console.log(res.data.postsData.reverse());
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    setTimeout(() => {
      // console.log(postsData);
      setIsLoading(false);
    }, 2000);
  }, [profileUser]);

  useEffect(() => {
    getShortenedProfileDataByUsername(profileUser)
      .then((res) => {
        // console.log(res.data);
        const profileData = res.data;
        setProfilePicURL(profileData.profilePicURL);        
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
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
            createdBy={profileUser}
            likes={post.numberOfLikes}
            comments={post.numberOfComments}
            typeOfFirstMedia={post.typeOfFirstMedia}
            numberOfMediaFile = {post.numberOfMediaFile}
            avatar={profilePicURL}
          />
        ))}
    </Grid>
  );
};
