import React, { useState } from 'react'
import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ViewPost from '../ViewPost/ViewPost';
const PostHeader = () => {
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
				
						<Avatar src="https://phunuvietnam.mediacdn.vn/thumb_w/700/179072216278405120/2021/1/15/1-1-1610728588864708959962-566-167-1920-2333-crop-1610728634812636188636.jpg" alt='user profile pic' size={"sm"} />
					
				

				  <Flex fontSize={12} fontWeight={"bold"} gap='2'>
					testname

					<Box color={"gray.500"}>• 1w</Box>
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