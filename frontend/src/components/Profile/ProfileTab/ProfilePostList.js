import React from "react";
import { Grid, Skeleton, VStack, Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePost } from "./ProfilePost.js";
import { useParams } from "react-router-dom";
import { getProfileByUsername } from "../../../api/Api.js";
import { Error } from "../../../models/Toast.js";

export const ProfilePostList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { profileUser } = useParams();
  const [postIdList, setPostIdList] = useState([]);
  const toast = useToast();

  useEffect(() => {
    getProfileByUsername(profileUser)
    .then((res) => {
      const profileData = res.data;
      setPostIdList(profileData.posts)
      // console.log(res.data.posts)
    })
    .catch(err => {
      console.log(err.response.data.message);
      toast (new Error(err));
    })
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Grid
      templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={1}
      columnGap={1}
    >
      {isLoading &&
        [0, 1, 2, 3, 4, 5].map((_, idx) => (
          <VStack key={idx} alignItems={"flex-start"} gap={4}>
            <Skeleton w={"full"}>
              <Box h="300px"></Box>
            </Skeleton>
          </VStack>
        ))}
      {/* {!isLoading && (
        posts.map((post) => (
          <ProfilePost img={(post.imgURLs)[0]}/>
        ))
      )} */}
    </Grid>
  );
};
