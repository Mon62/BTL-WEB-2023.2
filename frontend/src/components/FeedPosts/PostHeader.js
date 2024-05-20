import React, { useState } from 'react'
import { Avatar, Box, Button, Flex, Link } from "@chakra-ui/react";
import { Link as RouterLink} from "react-router-dom";
import ViewPost from '../ViewPost/ViewPost';

const PostHeader = ({likes, createdBy, caption, numOfComments, postID, imageURL, avatar, comments, typeFirst, savedPost}) => {
  const [show, setShow] = useState(false)
  const handleShowPost = () => {
    setShow(true)
  }
  const handleClosePost = () => {
    setShow(false)
  }
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
			<Flex alignItems={"center"} gap={2}>
				
						<Avatar src={avatar} alt='user profile pic' size={"sm"} />
					

				  <Link as={RouterLink} to={`/profile/${createdBy}`} fontSize={12} fontWeight={"bold"} gap='2'>
					{createdBy} 

					<Box color={"gray.500"}></Box>
				</Link>
			</Flex>
			<Box cursor={"pointer"}>
				<Button
					size={"xs"}
					bg={"transparent"}
					fontSize={12}
					color={"blue.500"}
					fontWeight={"bold"}
					_hover={{
						color: "white",
					}}
					transition={"0.2s ease-in-out"}
					onClick={handleShowPost}
				>
					View Post
				</Button>
			</Box>
      {show && <ViewPost show={show} 
				onHide={handleClosePost} 
				imageURL={imageURL} 
				createdBy={createdBy}
				avatar={avatar}
				likes={likes}
				caption={caption}
				numOfComments={numOfComments}
				postID={postID}
				comments={comments}	
				typeFirst={typeFirst}
				savedPost={savedPost}
					
				/>}
		</Flex>
	
  )
}

export default PostHeader