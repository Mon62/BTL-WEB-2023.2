import React, { useEffect, useState, useRef } from 'react';
import { Container, useToast, Box, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import FeedPost from './FeedPost';
import { getRecommendPosts, getSavedPosts, getNewPostsByUsername } from '../../api/Api';
import { Error } from "../../models/Toast.js";

const FeedPosts = () => {
  const profileUser = sessionStorage.getItem("currentUser");
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const page = useRef(0); // Keep track of the current page
  const observer = useRef(); // Reference to the Intersection Observer
  const lastPostElementRef = useRef(); // Reference to the last post element
  const [savedPost, setSavedPost] = useState([]);

  // Function to fetch new posts by username
  const fetchNewPosts = async () => {
    try {
      const response = await getNewPostsByUsername(profileUser, page.current);
      const postData = response?.data?.posts ?? [];
      setPosts(postData.map((file) => ({
        caption: JSON.parse(file.caption),
        comments: file.comments,
        createdBy: file.createdBy,
        imgURL: file.imgURLs,
        type: file.typeOfFirstMedia,
        likes: file.likes,
        avatar: file.profilePicURL,
        postID: file.pid,
        typesOfMedia: file.typesOfMedia,
      })));
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      toast(new Error(err));
    }
  };

  // Function to fetch recommended posts
  const fetchRecommendedPosts = async () => {
    try {
      const response = await getRecommendPosts(profileUser, page.current);
      const postData = response?.data?.posts ?? [];
      setPosts(prevPosts => [
        ...prevPosts,
        ...postData.map((file) => ({
          caption: JSON.parse(file.caption),
          comments: file.comments,
          createdBy: file.createdBy,
          imgURL: file.imgURLs,
          type: file.typeOfFirstMedia,
          likes: file.likes,
          avatar: file.profilePicURL,
          postID: file.pid,
          typesOfMedia: file.typesOfMedia,
        }))
      ]);
      setLoading(false);
      page.current++;
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      toast(new Error(err));
    }
  };

  // Function to fetch data
  const fetchData = async () => {
    await fetchNewPosts();
    await fetchRecommendedPosts();
  };

  // Function to handle intersection
  const handleIntersection = (entries) => {
    const first = entries[0];
    if (first.isIntersecting) {
      fetchData();
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection);
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (lastPostElementRef.current) {
        observer.current.unobserve(lastPostElementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchData(); // Call the async function within useEffect
  }, [profileUser]);

  useEffect(() => {
    getSavedPosts(profileUser)
      .then((res) => {
        const savedArray = res.data.data.map((file) => ({
          pid: file.pid,
        }));
        setSavedPost(savedArray);
      })
      .catch((err) => {
        console.log(err.response?.data?.message || err.message);
        toast(new Error(err));
      });
  }, [profileUser]);

  return (
    <Container maxW={"container.sm"} py={10} px={2}>
      {!loading && posts.length > 0 && posts.map((file, index) => {
        if (posts.length === index + 1) {
          // If this is the last post, attach the ref to this post
          return (
            <div ref={lastPostElementRef} key={file.postID}>
              <FeedPost 
                files={file.imgURL} 
                likes={file.likes} 
                createdBy={file.createdBy} 
                caption={file.caption} 
                numOfComments={file.comments.length} 
                avatar={file.avatar} 
                postID={file.postID} 
                comments={file.comments} 
                typeFirst={file.type} 
                savedPost={savedPost} 
                typesOfMedia={file.typesOfMedia}
              />
            </div>
          );
        } else {
          return (
            <FeedPost 
              key={file.postID}
              files={file.imgURL} 
              likes={file.likes} 
              createdBy={file.createdBy} 
              caption={file.caption} 
              numOfComments={file.comments.length} 
              avatar={file.avatar} 
              postID={file.postID} 
              comments={file.comments} 
              typeFirst={file.type} 
              savedPost={savedPost} 
              typesOfMedia={file.typesOfMedia}
            />
          );
        }
      })}
      {loading && (
        <Box padding='6' boxShadow='lg' bg='white'>
          <SkeletonCircle size='10' />
          <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </Box>
      )}
    </Container>
  );
}

export default FeedPosts;
