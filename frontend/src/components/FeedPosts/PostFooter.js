import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import { FaRegBookmark } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa";
import { commentOnPost } from '../../api/Api';
import { Success, Error } from "../../models/Toast.js";
import ViewPost from '../ViewPost/ViewPost';

const PostFooter = ({likes, createdBy, caption, numOfComments, postID, imageURL, avatar, comments, typeFirst, onPostComment, commentCount}) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [comment , setComment] = useState("")
  const userName = sessionStorage.getItem("currentUser")
  const commentRef = useRef()

  const [show, setShow] = useState(false)
  const handleShowPost = () => {
    setShow(true)
  }
  const handleClosePost = () => {
    setShow(false)
  }

  const toast = useToast()
  const handleLike = () => {
    if(liked){
      setLiked(false);
      
    }else{
      setLiked(true);
      
    }
  }
  useEffect(() => {
	if(comment === "") setDisabled(true)
	else setDisabled(false)
  },[comment])

  
  const handleComment = (event) => {
	event.preventDefault();
	setDisabled(true)
	const commentData = {
		postId: postID,
		username: userName,
		textComment: comment,
	}
	console.log(commentData)
	commentOnPost(commentData)
	.then((res) => {
        toast(new Success(res));
        setDisabled(false)
		onPostComment();
		commentRef.current.value = "";
		setComment("")
      })
      .catch((err) => {
        // console.log(err);
        console.log(err.response.data.message);
        toast(new Error(err));
      });
    
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
				<Box cursor={"pointer"} fontSize={18} onClick={handleShowPost} >
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
						{createdBy}{"  "}
						<Text as='span' fontWeight={400}>
							{caption}
						</Text>
					</Text>
					
						{numOfComments !== 0 && <Text fontSize='sm' color={"gray"} cursor={"pointer"} onClick={handleShowPost}>
							View all comments
						</Text>}
					
					{/* COMMENTS MODAL ONLY IN THE HOME PAGE */}
					{/*isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null*/}
				

			
				<Flex alignItems={"center"} gap={2} justifyContent={"space-between"} w={"full"}>
					<InputGroup>
						<Input
							variant={"flushed"}
							placeholder={"Add a comment..."}
							fontSize={14}
							onChange={(e) => setComment(e.target.value)}
							value={comment}
							ref={commentRef}
						/>
						<InputRightElement>
							<Button
								fontSize={14}
								color={"blue.500"}
								fontWeight={600}
								cursor={"pointer"}
								_hover={{ color: "white" }}
								bg={"transparent"}
								onClick={handleComment}
								//isLoading={isCommenting}
								isDisabled={disabled}
							>
								Post
							</Button>
						</InputRightElement>
					</InputGroup>
				</Flex>
				{show && <ViewPost 
				show={show} 
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
				/>}
		</Box>
  )
}

export default PostFooter