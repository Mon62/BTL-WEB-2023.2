import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Divider,
  Flex,
  Image,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import PostFooter from '../FeedPosts/PostFooter';
import Modal from 'react-bootstrap/Modal';
import {
  getCommentsByPostId,
  getPostById,
  getSavedPosts,

} from '../../api/Api';
import { Error } from '../../models/Toast.js';
import { Comment } from '../Comment/Comment.js';
import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Carousel from "react-bootstrap/Carousel";


const ViewPost = ({
  show,
  onHide,
  imageURL,
  createdBy,
  avatar,
  likes,
  caption,
  postID,
  typeFirst,
  savedPost,
}) => {
  const [comment, setComment] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPost1, setSavedPost1] = useState([]);
  const [caption1, setCaption1] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [files, setFiles] = useState([])
  const [type, setType] = useState([])
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchComments = () => {
    getCommentsByPostId(postID)
      .then((res) => {
        const commentArray = res.data;
        console.log(commentArray);
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
        const dataArray = res.data.data.likes;
        const temp = res.data.data.caption;
        //console.log(res)
        setLikedBy(dataArray);
        setCaption1(JSON.parse(temp))
        //setOwner(own);
        setProfilePic(res.data.profilePicURL)
        setFiles(res.data.data.imgURLs)
        //console.log(res.data.data.imgURLs)
        setType(res.data.data.typesOfMedia)
        //console.log(res.data.data.typesOfMedia)

      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };

  const fetchSaved = () => {
    const profileUser = sessionStorage.getItem('currentUser');
    getSavedPosts(profileUser)
      .then((res) => {
        const savedArray = res.data.data.map((file) => ({
          pid: file.pid,
        }));
        setSavedPost1(savedArray);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };

  useEffect(() => {
    fetchComments();
    fetchLikes();
    fetchSaved();
  }, [postID]);

  /*useEffect(() => {
    if (owner) {
      getShortenedProfileDataByUsername(owner)
        .then((res) => {
          setProfilePic(res.data.profilePicURL);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          toast(new Error(err));
        });
    }
  }, [owner, toast]);*/

  return (
    <Modal show={show} onHide={onHide} centered size='xl' backdrop="static">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body bg={"black"} pb={5}>
        {loading ? (
          <ViewPostSkeleton />
        ) : (
          <Flex
            gap='4'
            w={{ base: '90%', sm: '70%', md: 'full' }}
            mx={'auto'}
            maxH={'90vh'}
            minH={'50vh'}
          >
            <Flex
              borderRadius={4}
              overflow={'hidden'}
              border={'1px solid'}
              borderColor={'whiteAlpha.300'}
              flex={1.5}
              justifyContent={'center'}
              alignItems={'center'}
            >
              {files.length === 1 &&
                <Flex
                  style={{ maxWidth: "700px", maxHeight: "500px" }}
                >
                  {type[0] === "video" ? (
                    <video
                      src={files[0]}
                      controls
                      playsinline
                    ></video>
                  ) : (
                    <Image src={files[0]} rounded fluid />
                  )}
                </Flex>}
              {files.length !== 1 && <Carousel
                data-bs-theme="light"
                interval={null}
                indicators={false}
                slide={false}
              >

                {files.map((file, index) => {
                  return (
                    <Carousel.Item>
                      <Flex
                        key={index}
                        style={{ maxWidth: "700px", maxHeight: "500px" }}
                      >
                        {type[index] === "video" ? (
                          <video
                            src={file}
                            controls
                            playsinline
                          ></video>
                        ) : (
                          <Image src={file} rounded fluid />
                        )}
                      </Flex>
                    </Carousel.Item>
                  );
                })}
              </Carousel>}

            </Flex>
            <Flex
              flex={1}
              flexDir={'column'}
              px={10}
              display={{ base: 'none', md: 'flex' }}
            >
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Flex alignItems={'center'} gap={4}>
                  <Avatar src={profilePic} size={'sm'} name='name' />
                  <Link to={`/profile/${createdBy}`}>
                    <Text fontWeight={'bold'} fontSize={14}>
                      {createdBy}
                    </Text>
                  </Link>
                </Flex>
              </Flex>
              <Divider my={4} bg={'gray.500'} />

              <VStack w='full' alignItems={'start'} maxH={'350px'} overflowY={'auto'}>
                {comment.map((each) => (
                  <Comment
                    key={each.commentId}
                    commentId={each.commentId}
                    userName={each.createdBy}
                    text={JSON.parse(each.textComment)}
                    postOwner={createdBy}
                    fetch={fetchComments}
                    profilePic={each.profilePicURL}
                  />
                ))}
              </VStack>
              <Divider my={4} bg={'gray.8000'} />

              <PostFooter
                likes={likedBy}
                createdBy={createdBy}
                caption={caption1}
                numOfComments={0}
                postID={postID}
                imageURL={imageURL}
                avatar={avatar}
                onPostComment={fetchComments}
                savedPost={savedPost1}
                iconShow={false}
              />
            </Flex>
          </Flex>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewPost;

const ViewPostSkeleton = () => {
  return (
    <Flex
      gap='4'
      w={{ base: '90%', sm: '70%', md: 'full' }}
      mx={'auto'}
      maxH={'90vh'}
      minH={'50vh'}
    >
      <Flex
        borderRadius={4}
        overflow={'hidden'}
        border={'1px solid'}
        borderColor={'whiteAlpha.300'}
        flex={1.5}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Skeleton height={300} width={500} />
      </Flex>
      <Flex
        flex={1}
        flexDir={'column'}
        px={10}
        display={{ base: 'none', md: 'flex' }}
      >
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'} gap={4}>
            <SkeletonCircle size='10' />
            <Skeleton height={2} width={100} />
          </Flex>
        </Flex>
        <Divider my={4} bg={'gray.500'} />

        <VStack w='full' alignItems={'start'} maxH={'350px'} overflowY={'auto'}>
          <Flex gap={4} w={'full'} alignItems={'center'}>
            <SkeletonCircle h={10} w='10' />
            <Flex gap={1} flexDir={'column'}>
              <Skeleton height={2} width={100} />
              <Skeleton height={2} width={50} />
            </Flex>
          </Flex>
        </VStack>
        <Divider my={4} bg={'gray.8000'} py={10} />
        <Skeleton height={20} width={400} />
      </Flex>
    </Flex>
  );
};
