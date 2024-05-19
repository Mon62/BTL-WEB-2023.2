import React, {useEffect, useState} from 'react'
import { Container } from '@chakra-ui/react'
import { getExplorePosts, getSavedPosts } from '../../api/Api';
import { Grid, Skeleton, VStack, Box, useToast } from "@chakra-ui/react";
import ExplorePost from './ExplorePost';
import { Error } from '../../models/Toast';

const Explore = () => {
    const toast = useToast()
    const userName = sessionStorage.getItem("currentUser")
    const [isLoading, setIsLoading] = useState(true);
    const [postsData, setPostsData] = useState([]);
    const [savedPost, setSavedPost] = useState([])

    const fetchExplore = () => {
		getExplorePosts(userName)
			.then((res) => {
				const dataArray = res.data.postsData;
				console.log(dataArray);
                setPostsData(dataArray)
				
			})
			.catch((err) => {
				console.log(err.response.data.message);
                toast(new Error(err));

			});
	};

    useEffect(() => {
        setIsLoading(true)
        fetchExplore()
        setTimeout(() => {
            setIsLoading(false);
          }, 2000);
    }, [userName])

    useEffect(()=>{
        getSavedPosts(userName)
        .then((res) => {
              //toast(new Success(res));
          //console.log(res.data.data)
          const savedArray = res.data.data.map((file) => {
            return{pid: file.pid,}
          })
          setSavedPost(savedArray)
          //console.log(savedArray)
            })
            .catch((err) => {
              // console.log(err);
              console.log(err.response.data.message);
              toast(new Error(err));
            });
        }, [userName])

        console.log(postsData.createdBy)

  return (
    <Container maxW={"container.lg"} top={0} maxH={"80vh"}>
    <Grid
      templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={2}
      columnGap={2}
    >
      {isLoading &&
        [0, 1, 2, 3, 4, 5].map((_, idx) => (
          <VStack key={idx} alignItems={"flex-start"} gap={4}>
            <Skeleton w={"full"}>
              <Box h="300px"></Box>
            </Skeleton>
          </VStack>
        ))}
      {!isLoading &&
        postsData.map((post, index) => (
          <ExplorePost
            key={index}
            firstMediaURL={post.firstMediaURL}
            postID={post.pid}
            numberOfLikes={post.numberOfLikes}
            numberOfComments={post.numberOfComments}
            typeOfFirstMedia={post.typeOfFirstMedia}
            savedPost={savedPost}

          />
        ))
      }
    </Grid>
    </Container>
  )
}

export default Explore