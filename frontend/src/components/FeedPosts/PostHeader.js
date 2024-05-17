import React, { useState } from 'react'
import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ViewPost from '../ViewPost/ViewPost';
const PostHeader = ({avatar, createdBy}) => {
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
					
				

				  <Flex fontSize={12} fontWeight={"bold"} gap='2'>
					{createdBy} 

					<Box color={"gray.500"}></Box>
				</Flex>
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
					Unfollow
				</Button>
			</Box>
      {show && <ViewPost show={show} onHide={handleClosePost}/>}
		</Flex>
	
  )
}

export default PostHeader