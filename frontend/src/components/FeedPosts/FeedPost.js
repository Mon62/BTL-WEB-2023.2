import React, { useEffect, useState } from 'react'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter';
import { Box, Image } from "@chakra-ui/react";
import { Carousel } from 'react-responsive-carousel';
const FeedPost = ({files, likes, createdBy, caption, numOfComments, avatar, postID, comments, typeFirst, savedPost}) => {
	
  return (
    <Box borderTop={"1px solid gray"}>
			<PostHeader likes={likes} createdBy={createdBy} caption={caption} numOfComments={numOfComments} postID={postID} imageURL={files} avatar={avatar} comments={comments} typeFirst={typeFirst} savedPost={savedPost}/>
			<Box my={2} borderRadius={4} overflow={"hidden"}>
			
			
				{typeFirst === 'picture' && <Image src={files} alt={"FEED POST IMG"} />} 
				{typeFirst === 'video' && <video
                                  src={files}
                                  controls
                                  playsinline
								  autoplay
                                ></video>}
								
					
			</Box>
			<PostFooter likes={likes} createdBy={createdBy} caption={caption} numOfComments={numOfComments} postID={postID} imageURL={files} avatar={avatar} comments={comments} typeFirst={typeFirst} savedPost={savedPost} iconShow={true}/>
		</Box>
  )
}

export default FeedPost