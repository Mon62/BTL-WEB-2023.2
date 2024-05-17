import React, { useState } from 'react'
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react";
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import { FaRegBookmark } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa";
const PostFooter = ({likes, createdBy, caption, numOfComments}) => {
  const [liked, setLiked] = useState(false)
  
  const [saved, setSaved] = useState(false)
  const handleLike = () => {
    if(liked){
      setLiked(false);
      
    }else{
      setLiked(true);
      
    }
  }

  const handleSaved = () => {
    if(saved){
      setSaved(false)
    }
    else setSaved(true)
  }
  return (
    <Box mb={10} marginTop={"auto"}>
			<Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
				<Box onClick={handleLike} cursor={"pointer"} fontSize={18}>
					{!liked ? <NotificationsLogo /> : <UnlikeLogo />}
				</Box>
				<Box cursor={"pointer"} fontSize={18} >
					<CommentLogo />
				</Box>
        <Box cursor={"pointer"} fontSize={18} onClick={handleSaved} >
    {saved ? <FaBookmark size={22} /> : <FaRegBookmark size={22}/>}  {/* Replace with your actual icon component */}
  </Box>
			</Flex>
			<Text fontWeight={600} fontSize={"sm"}>
				{likes} likes
			</Text>

					<Text fontSize='sm' fontWeight={700}>
						{createdBy}
						<Text as='span' fontWeight={400}>
							{caption}
						</Text>
					</Text>
					
						{numOfComments !== 0 && <Text fontSize='sm' color={"gray"} cursor={"pointer"} >
							View all {numOfComments} comments
						</Text>}
					
					{/* COMMENTS MODAL ONLY IN THE HOME PAGE */}
					{/*isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null*/}
				

			
				<Flex alignItems={"center"} gap={2} justifyContent={"space-between"} w={"full"}>
					<InputGroup>
						<Input
							variant={"flushed"}
							placeholder={"Add a comment..."}
							fontSize={14}
							//onChange={(e) => setComment(e.target.value)}
							//value={comment}
							//ref={commentRef}
						/>
						<InputRightElement>
							<Button
								fontSize={14}
								color={"blue.500"}
								fontWeight={600}
								cursor={"pointer"}
								_hover={{ color: "white" }}
								bg={"transparent"}
								//onClick={handleSubmitComment}
								//isLoading={isCommenting}
							>
								Post
							</Button>
						</InputRightElement>
					</InputGroup>
				</Flex>
		
		</Box>
  )
}

export default PostFooter