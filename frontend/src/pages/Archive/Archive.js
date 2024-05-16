import React, { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  Grid,
  useToast,
  VStack,
  Box,
  Skeleton,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { getStoriesByUsername, deleteStory } from "../../api/Api";
import { ArchiveStory } from "../../components/Story/ArchiveStory";
import { Error, Success } from "../../models/Toast";
import { useParams } from "react-router-dom";

export const Archive = () => {
  const {
    isOpen: isOpenOptionModal,
    onOpen: onOpenOptionModal,
    onClose: onCloseOptionModal,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmDeleteDialog,
    onOpen: onOpenConfirmDeleteDialog,
    onClose: onCloseConfirmDeleteDialog,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [storiesData, setStoriesData] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(-1);
  const { profileUser } = useParams();
  const currentUser = sessionStorage.getItem("currentUser");
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);

    getStoriesByUsername(currentUser)
      .then((res) => {
        const data = res.data.storiesData;
        setStoriesData(data.reverse());
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [isOpenOptionModal]);

  const handleDeleteStory = (index) => {
    deleteStory({ storyId: storiesData[index].storyId })
      .then((res) => {
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
    onCloseConfirmDeleteDialog();
    onCloseOptionModal();
  };
  return currentUser === profileUser ? (
    <Container className="m-0 mw-100" px={10} h={"800px"} overflow={"auto"}>
      <Container className="mw-100">
        <Flex>
          <Button
            className="p-0 mb-3"
            gap={4}
            dir="row"
            bg={"white.alpha300"}
            fontSize={"20px"}
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon />
            Archive
          </Button>
        </Flex>
        <h6 className="fs-6 fw-normal">
          Only you can see your archived stories unless you choose to share
          them.
        </h6>
        <hr className="solid m-0" />
      </Container>

      <Grid
        className="mt-5 mb-5"
        mx={15}
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={5}
        columnGap={5}
      >
        {isLoading &&
          [0, 1, 2, 3].map((_, idx) => (
            <VStack key={idx} alignItems={"flex-start"} gap={4}>
              <Skeleton w={"full"}>
                <Box h="360px"></Box>
              </Skeleton>
            </VStack>
          ))}
        {!isLoading &&
          (storiesData.length > 0 ? (
            storiesData.map((story, index) => (
              <>
                <Box
                  onClick={() => {
                    setSelectedStoryIndex(index);
                    onOpenOptionModal();
                  }}
                  key={index}
                >
                  <ArchiveStory
                    key={index}
                    img={story.mediaURL}
                    typeOfMedia={story.typeOfMedia}
                    isInHighlight={story.isInHighlight}
                  />
                </Box>
              </>
            ))
          ) : (
            <Text>You don't have any stories</Text>
          ))}
        <Modal
          isOpen={isOpenOptionModal}
          onClose={onCloseOptionModal}
          id="option-highlight-stories"
          isCentered
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalBody>
              <Flex flexDirection="column" alignItems={"center"}>
                <Text
                  cursor={"pointer"}
                  _hover={{ color: "red" }}
                  onClick={onOpenConfirmDeleteDialog}
                >
                  Delete
                </Text>
              </Flex>
              <hr className="solid mt-0" />
              <Flex flexDirection="column" alignItems={"center"}>
                <Text
                  className="mb-0"
                  cursor={"pointer"}
                  _hover={{ color: "red" }}
                  onClick={onCloseOptionModal}
                >
                  Cancel
                </Text>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
        <AlertDialog
          onClose={onCloseConfirmDeleteDialog}
          isOpen={isOpenConfirmDeleteDialog}
          isCentered
        >
          <AlertDialogOverlay
            bg="whiteAlpha.300"
            // backdropFilter="blur(10px) "
          />
          <AlertDialogContent>
            <AlertDialogHeader>Delete Story</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody className="fs-5">
              Are you sure you want to delete this story?
              <hr className="solid my-2" />
              <Flex justifyContent={"flex-end"}>
                <Button
                  className="mt-2 mb-2"
                  onClick={onCloseConfirmDeleteDialog}
                >
                  No
                </Button>
                <Button
                  className="mb-2 mt-2"
                  onClick={() => handleDeleteStory(selectedStoryIndex)}
                  colorScheme="red"
                  ml={3}
                >
                  Yes
                </Button>
              </Flex>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialog>
      </Grid>
    </Container>
  ) : (
    <Container
      className="d-flex mw-100 me-0 ms-0"
      mt={20}
      justifyContent={"center"}
    >
      <Text alignSelf={"center"} fontWeight={"bolder"} fontSize={"20px"}>
        Only {profileUser} can view this section
      </Text>
    </Container>
  );
};
