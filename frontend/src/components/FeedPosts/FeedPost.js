import React from 'react'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter';
import { Box, Image } from "@chakra-ui/react";
const FeedPost = ({files, likes, createdBy, caption, numOfComments, avatar}) => {
  return (
    <Box borderTop={"1px solid gray"}>
			<PostHeader avatar={avatar} createdBy={createdBy} />
			<Box my={2} borderRadius={4} overflow={"hidden"}>
				<Image src={files} alt={"FEED POST IMG"} />
			</Box>
			<PostFooter likes={likes} createdBy={createdBy} caption={caption} numOfComments={numOfComments} />
		</Box>
  )
}

export default FeedPost