import React from 'react';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import { Box, Image, Flex } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel CSS

const FeedPost = ({
  files,
  likes,
  createdBy,
  caption,
  numOfComments,
  avatar,
  postID,
  comments,
  typeFirst,
  savedPost,
  typesOfMedia,
}) => {
  return (
    <Box borderTop="1px solid gray">
      <PostHeader
        likes={likes}
        createdBy={createdBy}
        caption={caption}
        numOfComments={numOfComments}
        postID={postID}
        imageURL={files}
        avatar={avatar}
        comments={comments}
        typeFirst={typeFirst}
        savedPost={savedPost}
      />
      <Flex my={2} borderRadius={4} overflow="hidden" justifyContent={"center"} alignItems={"center"}>
        {files.length === 1 ? (
			<div>
          <Flex style={{ maxWidth: '700px', maxHeight: '500px' }}>
            {typesOfMedia[0] === 'video' ? (
              <video src={files[0]} controls playsInline w="100%"
                            h="100%"
                            objectFit="cover"></video>
            ) : (
              <Image src={files[0]} rounded="md" w="100%"
                            h="100%"
                            objectFit="cover" />
            )}
          </Flex>
		  </div>
        ) : (
          <Carousel showThumbs={false} showStatus={false} infiniteLoop>
            {files.map((file, index) => (
              <div key={index}>
                <Flex style={{ maxWidth: '700px', maxHeight: '500px' }}>
                  {typesOfMedia[index] === 'video' ? (
                    <video src={file} controls playsInline></video>
                  ) : (
                    <Image src={file} rounded="md" />
                  )}
                </Flex>
              </div>
            ))}
          </Carousel>
        )}
      </Flex>
      <PostFooter
        likes={likes}
        createdBy={createdBy}
        caption={caption}
        numOfComments={numOfComments}
        postID={postID}
        imageURL={files}
        avatar={avatar}
        comments={comments}
        typeFirst={typeFirst}
        savedPost={savedPost}
        iconShow={true}
      />
    </Box>
  );
};

export default FeedPost;
