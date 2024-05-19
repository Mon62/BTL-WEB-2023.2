import {
  Flex,
  GridItem,
  Image,
  Text,
  //useDisclosure,
  AspectRatio,
  useToast,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { TbBoxMultiple } from "react-icons/tb";
import { MdOndemandVideo } from "react-icons/md";
import { useState, useEffect } from "react";
import ViewPost from "../../ViewPost/ViewPost";
import { getCommentsByPostId, getPostById } from "../../../api/Api";
import { Error } from "../../../models/Toast";

export const ProfilePost = ({
  img,
  //numberOfLikes,
  //numberOfComments,
  typeOfFirstMedia,
  numberOfMediaFile,
  postID,
  savedPost,
  //avatar,
}) => {
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [data, setData] = useState({ likes: [], comments: [], createdBy: "", caption: "" });
  const toast = useToast();
  //const userName = sessionStorage.getItem("currentUser")
  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const fetchComments = async () => {
    try {
      const res = await getCommentsByPostId(postID);
      setComments(res.data);
    } catch (err) {
      console.error(err.response.data.message);
      toast(new Error(err));
    }
  };

  const fetchPosts = async () => {
    
    try {
      
      const res = await getPostById(postID);
      setData(res.data.data);
      console.log(data)
    } catch (err) {
      console.error(err);
      toast(new Error(err));
    }
  };

  useEffect(() => {
    fetchComments();
    fetchPosts();
  }, [postID]);

  return (
    <>
      <GridItem
        cursor={"pointer"}
        borderRadius={4}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"whiteAlpha.300"}
        position={"relative"}
        aspectRatio={1 / 1}
        onClick={handleShow}
      >
        <Flex
          opacity={0}
          _hover={{ opacity: 1 }}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={"blackAlpha.400"}
          transition={"all 0.3s ease"}
          zIndex={2}
          justifyContent={"center"}
        >
          <Flex alignItems={"center"} gap={50}>
            <Flex gap={2}>
              <AiFillHeart
                style={{ alignSelf: "center" }}
                size={25}
                color="white"
              />
              <Text className="fw-bold fs-4 ml-2 mt-3" color={"white"}>
                {data.likes.length}
              </Text>
            </Flex>
            <Flex gap={2}>
              <FaComment
                style={{ alignSelf: "center" }}
                size={25}
                color="white"
              />
              <Text className="fw-bold fs-4 ml-2 mt-3" color={"white"}>
                {comments.length}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          position={"absolute"}
          top={1}
          right={1}
          zIndex={1}
          className="shadow"
        >
          {numberOfMediaFile === 1 ? (
            typeOfFirstMedia === "picture" ? (
              <></>
            ) : (
              <MdOndemandVideo color="white" size={25} />
            )
          ) : (
            <TbBoxMultiple color="white" size={25} />
          )}
        </Flex>

        {typeOfFirstMedia === "video" ? (
          <AspectRatio ratio={3 / 4} objectFit={"cover"}>
            <iframe
              title="post"
              src={img}
              allowFullScreen
            />
          </AspectRatio>
        ) : (
          <Image src={img} w={"100%"} h={"100%"} objectFit={"cover"}></Image>
        )}
      </GridItem>
      {show && (
        <ViewPost
          show={show}
          onHide={handleClose}
          imageURL={img}
          createdBy={data.createdBy}
          //avatar={avatar}
          likes={data.likes}
          caption={data.caption ? JSON.parse(data.caption) : ""}
          numOfComments={comments.length}
          postID={postID}
          comments={comments}
          typeFirst={typeOfFirstMedia}
          savedPost={savedPost}
          iconShow={false}
        />
      )}
    </>
  );
};
