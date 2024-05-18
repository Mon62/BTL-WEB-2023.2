import React from 'react'
import {
	Avatar,
	Button,
	Divider,
	Flex,
	GridItem,
	Image,

	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PostFooter from '../FeedPosts/PostFooter';
import Modal from 'react-bootstrap/Modal';
const ViewPost = ({ show, onHide, imageURL, createdBy, avatar, likes, caption, comments, postID, typeFirst }) => {

	return (
		<Modal show={show} onHide={onHide} centered size='xl'>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body bg={"black"} pb={5}>
				<Flex
					gap='4'
					w={{ base: "90%", sm: "70%", md: "full" }}
					mx={"auto"}
					maxH={"90vh"}
					minH={"50vh"}
				>
					<Flex
						borderRadius={4}
						overflow={"hidden"}
						border={"1px solid"}
						borderColor={"whiteAlpha.300"}
						flex={1.5}
						justifyContent={"center"}
						alignItems={"center"}
					>
						{typeFirst === 'picture' && <Image src={imageURL} alt={"FEED POST IMG"} />}
						{typeFirst === 'video' && <video
							src={imageURL}
							controls
							playsinline
							autoplay
						></video>}
					</Flex>
					<Flex flex={1} flexDir={"column"} px={10} display={{ base: "none", md: "flex" }}>
						<Flex alignItems={"center"} justifyContent={"space-between"}>
							<Flex alignItems={"center"} gap={4}>
								<Avatar src={avatar} size={"sm"} name='As a Programmer' />
								<Text fontWeight={"bold"} fontSize={12}>
									{createdBy}
								</Text>
							</Flex>

							{true && (
								<Button
									size={"sm"}
									bg={"transparent"}
									_hover={{ bg: "whiteAlpha.300", color: "red.600" }}
									borderRadius={4}
									p={1}
								//onClick={handleDeletePost}
								//isLoading={isDeleting}
								>
									<MdDelete size={20} cursor='pointer' />
								</Button>
							)}
						</Flex>
						<Divider my={4} bg={"gray.500"} />

						<VStack w='full' alignItems={"start"} maxH={"350px"} overflowY={"auto"}>
							{/* CAPTION */}
							{/*post.caption && <Caption post={post} />*/}
							{/* COMMENTS */}
							{/*post.comments.map((comment) => (
										<Comment key={comment.id} comment={comment} />
									))*/}
						</VStack>
						<Divider my={4} bg={"gray.8000"} />

						<PostFooter likes={likes} createdBy={createdBy} caption={caption} numOfComments={0} postID={postID}
							imageURL={imageURL} avatar={avatar} />
					</Flex>
				</Flex>
			</Modal.Body>

		</Modal>
	)
}

export default ViewPost