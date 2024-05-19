import React, { useState } from 'react'
import { Avatar, Flex, Skeleton, SkeletonCircle, Text, useToast, Button, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getShortenedProfileDataByUsername } from '../../api/Api';
import { Error, Success } from "../../models/Toast.js";
import { MdDelete } from "react-icons/md";
import { deleteComment } from '../../api/Api';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'

const CommentSkeleton = () => {
	return (
		<Flex gap={4} w={"full"} alignItems={"center"}>
			<SkeletonCircle h={10} w='10' />
			<Flex gap={1} flexDir={"column"}>
				<Skeleton height={2} width={100} />
				<Skeleton height={2} width={50} />
			</Flex>
		</Flex>
	);
};

export const Comment = ({ userName, profilePic, text, postOwner, commentId, fetch }) => {
  //const [picURL, setPicURL] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  /*getShortenedProfileDataByUsername(userName)
    .then((res) => {
      const data = res.data;
      setPicURL(data.profilePicURL)

    })
    .catch((err) => {
      console.log(err.response.data.message);
      toast(new Error(err));
    });*/

  const handleDeleteComment = (event) => {
    event.preventDefault();
    setDisabled(true)
    const commentData = {
      commentId: commentId,
      username: sessionStorage.getItem("currentUser")
    }
    deleteComment(commentData)
      .then((res) => {
        fetch()
        setDisabled(false)
        onClose()
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

  }
  
  

  //if (loading) return (<CommentSkeleton/>)

  return (
    <Flex gap={4} >
      <Link to={`/profile/${userName}`}>
        <Avatar src={profilePic} size={"sm"} />
      </Link>
      <Flex direction={"column"}>
        <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
          <Flex gap={2} width={{ base: 50, md: 100, lg: 200, xl: 320 }}>
            <Link to={`/profile/${userName}`}  >
              <Text fontWeight={"bold"} fontSize={14}>
                {userName}
              </Text>
            </Link>
            <Text fontSize={14}>{text}</Text>
          </Flex>
          {((userName === sessionStorage.getItem("currentUser")) || (userName === postOwner)) &&
            <Button
              size={"sm"}
              bg={"transparent"}
              _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
              borderRadius={4}
              p={1}
              onClick={onOpen}
            >
              <MdDelete size={20} cursor='pointer' />
            </Button>}
        </Flex>

      </Flex>
      <AlertDialog
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay
          bg="blackAlpha.500"
          backdropFilter="blur(10px) "
        />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Comment?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete comment "{text}"?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose} isDisabled={disabled}>
              No
            </Button>
            <Button colorScheme='red' ml={3} onClick={handleDeleteComment} isLoading={disabled}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  )
}

