import {
  Flex,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Box,
  Avatar,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { SlHeart } from "react-icons/sl";

import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Comment } from "../../Comment/Comment.js";

export const ProfilePost = ({ img, likes, comments }) => {
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
          zIndex={1}
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

        <Image src={img} w={"100%"} h={"100%"} objectFit={"cover"}></Image>
      </GridItem>

      {/* <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        size={{ base: "3xl", md: "5xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg={"black"} pb={5}>
            <Flex
              gap={4}
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
            >
              <Box
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                flex={1.5}
              >
                <Image src={img} alt="profile post"></Image>
              </Box>
              <Flex
                flex={1}
                flexDir={"column"}
                px={10}
                display={{ base: "none", md: "flex" }}
              >
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Flex alignItems={"center"} gap={4}>
                    <Avatar src="" size={"sm"} name="Nguyen Van Nam" />
                    <Text fontWeight={"bold"} fontSize={12}>
                      mon62
                    </Text>
                  </Flex>

                  <Box
                    _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                    borderRadius={4}
                    p={1}
                  >
                    <MdDelete size={20} cursor="pointer"></MdDelete>
                  </Box>
                </Flex>
                <Divider my={4} bg={"gray.500"} />
                <VStack
                  w="full"
                  alignItems={"start"}
                  maxH={"350px"}
                  overflowY={"auto"}
                >
                  <Comment
                    createdAt="1d ago"
                    username="monn"
                    profilePic=""
                    text={""}
                  ></Comment>
                </VStack>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </>
  );
};
