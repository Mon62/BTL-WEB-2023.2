import React from "react";
import { Grid, Skeleton, VStack, Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProfilePost } from "./ProfilePost.js";

export const ProfilePosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <Grid
      templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={1}
      columnGap={1}
    >
      {!isLoading && (
        <>
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
          <ProfilePost img="https://bit.ly/dan-abramov" />
        </>
      )}
    </Grid>
  );
};
