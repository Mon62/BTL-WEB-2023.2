import {
  Flex,
  GridItem,
  Image,
  Text,
  useDisclosure,
  AspectRatio,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { TbBoxMultiple } from "react-icons/tb";
import { MdOndemandVideo } from "react-icons/md";

export const ProfilePost = ({
  img,
  likes,
  comments,
  typeOfFirstMedia,
  numberOfMediaFile,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        onClick={onOpen}
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
                {likes}
              </Text>
            </Flex>
            <Flex gap={2}>
              <FaComment
                style={{ alignSelf: "center" }}
                size={25}
                color="white"
              />
              <Text className="fw-bold fs-4 ml-2 mt-3" color={"white"}>
                {comments}
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
              // allowFullScreen
            />
          </AspectRatio>
        ) : (
          <Image src={img} w={"100%"} h={"100%"} objectFit={"cover"}></Image>
        )}
      </GridItem>
    </>
  );
};
