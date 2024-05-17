import React from 'react'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter';
import { Box, Image } from "@chakra-ui/react";
const FeedPost = () => {
  return (
    <Box borderTop={"1px solid gray"}>
			<PostHeader  />
			<Box my={2} borderRadius={4} overflow={"hidden"}>
				<Image src="https://media.vov.vn/sites/default/files/styles/large/public/2021-02/unnamed_12.jpg" alt={"FEED POST IMG"} />
			</Box>
			<PostFooter  />
		</Box>
  )
}

export default FeedPost