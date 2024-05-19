import React, { useEffect, useState } from 'react'
import {
	Avatar,
	Button,
	Divider,
	Flex,
	Image,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import PostFooter from '../FeedPosts/PostFooter';
import Modal from 'react-bootstrap/Modal';
import { getCommentsByPostId, getPostById } from '../../api/Api';
import { Error } from "../../models/Toast.js";
import { Comment } from '../Comment/Comment.js';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

const ViewPost = ({ show, onHide, imageURL, createdBy, avatar, likes, caption, postID, typeFirst, savedPost }) => {
	const [comment, setComment] = useState([])
	const [likedBy, setLikedBy] = useState([])
	const [loading, setLoading] = useState(true)
	const toast = useToast()
	setTimeout(() => {
		setLoading(false)
	}, 2000);
	const fetchComments = () => {
		getCommentsByPostId(postID)
			.then((res) => {
				const commentArray = res.data;
				//console.log(commentArray);
				setComment(commentArray);
			})
			.catch((err) => {
				console.log(err.response.data.message);
				toast(new Error(err));
			});
	};

	const fetchLikes = () => {
		getPostById(postID)
			.then((res) => {
				console.log(res.data.data)
				const dataArray = res.data.data.likes;
				console.log(dataArray);
				setLikedBy(dataArray)

			})
			.catch((err) => {
				console.log(err.response.data.message);
				toast(new Error(err));
			});
	}
	useEffect(() => {
		fetchComments();
		fetchLikes();
	}, [postID]);


	return (
		<Modal show={show} onHide={onHide} centered size='xl'>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body bg={"black"} pb={5}>
				{loading ? <ViewPostSkeleton /> :
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


							</Flex>
							<Divider my={4} bg={"gray.500"} />

							<VStack w='full' alignItems={"start"} maxH={"350px"} overflowY={"auto"}>
								{/* CAPTION */}
								{/*post.caption && <Caption post={post} />*/}

								{comment.map((each) => (
									<Comment commentId={each.commentId} userName={each.createdBy} text={JSON.parse(each.textComment)} postOwner={createdBy} fetch={fetchComments} />
								))}
							</VStack>
							<Divider my={4} bg={"gray.8000"} />

							<PostFooter likes={likedBy} createdBy={createdBy} caption={caption} numOfComments={0} postID={postID}
								imageURL={imageURL} avatar={avatar} onPostComment={fetchComments} savedPost={savedPost} />
						</Flex>
					</Flex>}
			</Modal.Body>

		</Modal>
	)
}

export default ViewPost

const ViewPostSkeleton = () => {
	return (
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
				<Skeleton height={300} width={500} />
			</Flex>
			<Flex flex={1} flexDir={"column"} px={10} display={{ base: "none", md: "flex" }}>
				<Flex alignItems={"center"} justifyContent={"space-between"}>
					<Flex alignItems={"center"} gap={4}>
						<SkeletonCircle size='10' />
						<Skeleton height={2} width={100} />
					</Flex>


				</Flex>
				<Divider my={4} bg={"gray.500"} />

				<VStack w='full' alignItems={"start"} maxH={"350px"} overflowY={"auto"}>


					<Flex gap={4} w={"full"} alignItems={"center"}>
						<SkeletonCircle h={10} w='10' />
						<Flex gap={1} flexDir={"column"}>
							<Skeleton height={2} width={100} />
							<Skeleton height={2} width={50} />
						</Flex>
					</Flex>
				</VStack>
				<Divider my={4} bg={"gray.8000"} py={10} />
				<Skeleton height={20} width={400}/>
			</Flex>
			
		</Flex>
	)
}