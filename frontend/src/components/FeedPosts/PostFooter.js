import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react';
import { CommentLogo, NotificationsLogo, UnlikeLogo } from '../../assets/constants';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { commentOnPost, likePost, unlikePost, unSavePost, savePost } from '../../api/Api';
import { Success, Error } from '../../models/Toast.js';
import ViewPost from '../ViewPost/ViewPost';

const PostFooter = ({
  likes,
  createdBy,
  caption,
  numOfComments,
  postID,
  imageURL,
  avatar,
  comments,
  typeFirst,
  onPostComment,
  savedPost,
  iconShow,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [comment, setComment] = useState('');
  const userName = sessionStorage.getItem('currentUser');
  const commentRef = useRef();

  const [show, setShow] = useState(false);
  const [numLikes, setNumLikes] = useState(likes.length);

  useEffect(() => {
    setNumLikes(likes.length);
  }, [likes]);

  useEffect(() => {
    savedPost.forEach((file) => {
      if (file.pid === postID) setSaved(true);
    });
  }, [postID, savedPost]);

  useEffect(() => {
    if (likes.includes(userName)) {
      setLiked(true);
    }
  }, [postID, likes, userName]);

  const handleShowPost = () => {
    setShow(true);
  };
  const handleClosePost = () => {
    setShow(false);
  };

  const toast = useToast();

  const handleLike = (event) => {
    event.preventDefault();
    if (liked) {
      setLiked(false);
      setNumLikes(numLikes - 1);
      unlikePost(postID, userName)
        .then((res) => {
          toast(new Success(res));
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'An error occurred';
          toast(new Error(errorMessage));
        });
    } else {
      setLiked(true);
      setNumLikes(numLikes + 1);
      likePost(postID, userName)
        .then((res) => {
          toast(new Success(res));
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'An error occurred';
          toast(new Error(errorMessage));
        });
    }
  };

  useEffect(() => {
    setDisabled(comment === '');
  }, [comment]);

  const handleComment = (event) => {
    event.preventDefault();
    setDisabled(true);
    const commentData = {
      postId: postID,
      username: userName,
      textComment: comment,
    };
    console.log(commentData);
    commentOnPost(commentData)
      .then((res) => {
        toast(new Success(res));
        setDisabled(false);
		if(typeof onPostComment === 'function'){
			(onPostComment)();

		}
        commentRef.current.value = '';
        setComment('');
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'An error occurred';
        toast(new Error(errorMessage));
      });
  };

  const handleSaved = (event) => {
    event.preventDefault();
    if (saved) {
      setSaved(false);
      const postData = {
        username: userName,
        postId: postID,
      };
      unSavePost(postData)
        .then((res) => {
          toast(new Success(res));
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'An error occurred';
          toast(new Error(errorMessage));
        });
    } else {
      setSaved(true);
      const postData = {
        username: userName,
        postId: postID,
      };
      savePost(postData)
        .then((res) => {
          toast(new Success(res));
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response?.data?.message || 'An error occurred';
          toast(new Error(errorMessage));
        });
    }
  };

  return (
    <Box mb={10} mt="auto">
      <Flex alignItems="center" gap={4} w="full" pt={0} mb={2} mt={4}>
        <Box onClick={handleLike} cursor="pointer" fontSize={18}>
          {!liked ? <NotificationsLogo /> : <UnlikeLogo />}
        </Box>
        {iconShow && (
          <Box cursor="pointer" fontSize={18} onClick={handleShowPost}>
            <CommentLogo />
          </Box>
        )}
        <Box cursor="pointer" fontSize={18} onClick={handleSaved}>
          {saved ? <FaBookmark size={22} /> : <FaRegBookmark size={22} />}
        </Box>
      </Flex>
      <Text fontWeight={600} fontSize="sm">
        {numLikes} likes
      </Text>
      <Text fontSize="sm" fontWeight={700}>
        {createdBy}{' '}
        <Text as="span" fontWeight={400}>
          {caption}
        </Text>
      </Text>
      {numOfComments !== 0 && (
        <Text fontSize="sm" color="gray" cursor="pointer" onClick={handleShowPost}>
          View all comments
        </Text>
      )}
      <Flex alignItems="center" gap={2} justifyContent="space-between" w="full">
        <InputGroup>
          <Input
            variant="flushed"
            placeholder="Add a comment..."
            fontSize={14}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            ref={commentRef}
          />
          <InputRightElement>
            <Button
              fontSize={14}
              color="blue.500"
              fontWeight={600}
              cursor="pointer"
              _hover={{ color: 'white' }}
              bg="transparent"
              onClick={handleComment}
              isDisabled={disabled}
            >
              Post
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
      {show && (
        <ViewPost
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
          savedPost={savedPost}
        />
      )}
    </Box>
  );
};

export default PostFooter;
