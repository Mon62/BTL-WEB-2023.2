import React, { useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Box,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  Input,
  InputRightAddon,
  InputGroup,
  Container,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogCloseButton,
  VStack,
  SkeletonCircle
} from "@chakra-ui/react";
import { useState } from "react";
import { CloseIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { SelectStoryModal } from "./SelectStoryModal";
import { SelectCoverModal } from "./SelectCoverModal";
import { StorySnapshot } from "../../Story/StorySnapshot.js";
import {
  getStoriesByUsername,
  createHighlight,
  getHighlightsByUsername,
  deleteHighlight,
} from "../../../api/Api";
import { Success, Error } from "../../../models/Toast.js";

export const HighlightStory = () => {
  const {
    isOpen: isOpenCreateHighlightStories,
    onOpen: onOpenCreateHighlightStories,
    onClose: onCloseCreateHighlightStories,
  } = useDisclosure();
  const {
    isOpen: isOpenSelectStoryModal,
    onOpen: onOpenSelectStoryModal,
    onClose: onCloseSelectStoryModal,
  } = useDisclosure();
  const {
    isOpen: isOpenSelectCoverModal,
    onOpen: onOpenSelectCoverModal,
    onClose: onCloseSelectCoverModal,
  } = useDisclosure();
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
  const [highlightName, setHighlightName] = useState("");
  const [countSelectedStories, setCountSelectedStories] = useState(0);
  const [isSelectedStories, setIsSelectedStories] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(-1);
  const [storiesData, setStoriesData] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = sessionStorage.getItem("currentUser");
  const { profileUser } = useParams();
  const toast = useToast();

  useEffect(() => {
    setHighlightName("");
    setCountSelectedStories(0);
    setSelectedCoverIndex(0);
    if (! isOpenCreateHighlightStories && ! isOpenOptionModal)
      setIsLoading(true);

    getStoriesByUsername(profileUser)
      .then((res) => {
        const data = res.data.storiesData.reverse();
        setStoriesData(data);
        setIsSelectedStories(Array(data.length).fill(0));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    getHighlightsByUsername(profileUser)
      .then((res) => {
        const data = res.data.data;
        setHighlights(data.reverse());
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  }, [isOpenCreateHighlightStories, profileUser, isOpenOptionModal]);

  const handleSelectStory = (index) => {
    let tempIsSelectedStories = [...isSelectedStories];
    tempIsSelectedStories[index] = 1 - tempIsSelectedStories[index];
    setCountSelectedStories(
      countSelectedStories + (tempIsSelectedStories[index] === 1 ? 1 : -1)
    );
    setIsSelectedStories(tempIsSelectedStories);
  };

  const handleSelectCover = async (index) => {
    setSelectedCoverIndex(index);
  };

  const handleOpenSelectCoverModal = () => {
    let tempSelectStories = [];
    isSelectedStories.forEach((isSelected, index) => {
      if (isSelected === 1) tempSelectStories.push(storiesData[index]);
    });
    setSelectedStories(tempSelectStories);
    onOpenSelectCoverModal();
  };

  const handleDeleteHighlightStories = (index) => {
    deleteHighlight({ hlid: highlights[index].hlid })
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

  const handleSubmit = () => {
    // console.log(selectedCoverIndex);
    const storyIdList = selectedStories.map((story, index) => story.storyId);
    const highlightData = {
      hlname: highlightName,
      hlimgURL: selectedStories[selectedCoverIndex].mediaURL,
      username: currentUser,
      stories: storyIdList,
    };
    // console.log(highlightData);
    createHighlight(highlightData)
      .then((res) => {
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };
  return (
    <Container className="m-0 p-0">
      <Flex gap={10} w={"1100px"} overflowX={"auto"}>
        {currentUser === profileUser && (
          <Box dir="column" gap={2}>
            <IoIosAddCircleOutline
              size="7em"
              color="rgb(199, 199, 199)"
              cursor={"pointer"}
              onClick={onOpenCreateHighlightStories}
            />
            <Box className="d-flex justify-content-center">
              <Text className="m-0">New</Text>
            </Box>
          </Box>
        )}
        {isLoading &&
        [0, 1, 2, 3, 4, 5].map((_, idx) => (
          <VStack mt={2} key={idx} alignItems={"flex-start"} gap={4}>
            <SkeletonCircle size={"95"}/>
          </VStack>
        ))}
        {! isLoading && highlights.map((highlight, index) => (
          <Box
            onClick={() => {
              setSelectedHighlightIndex(index);
              onOpenOptionModal();
            }}
            key={index}
          >
            <StorySnapshot
              img={highlight.hlimgURL}
              caption={highlight.hlname}
            />
          </Box>
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
                <Text cursor={"pointer"} _hover={{ color: "blue" }}>
                  Edit
                </Text>
              </Flex>
              <hr className="solid mt-0" />
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
            bg="blackAlpha.300"
            backdropFilter="blur(10px) "
          />
          <AlertDialogContent>
            <AlertDialogHeader>Delete Highlight Story</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody className="fs-5">
              Are you sure you want to delete this highlight story?
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
                  onClick={() =>
                    handleDeleteHighlightStories(selectedHighlightIndex)
                  }
                  colorScheme="red"
                  ml={3}
                >
                  Yes
                </Button>
              </Flex>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialog>

        <Modal
          onClose={onCloseCreateHighlightStories}
          isOpen={isOpenCreateHighlightStories}
          isCentered
          id="create-highlight-stories"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader className="d-flex align-self-center">
              New Highlight
            </ModalHeader>
            <ModalCloseButton mt={2} />
            <hr className="solid mt-0" />
            <ModalBody className="ps-0 pe-0">
              <InputGroup className="pe-4 ps-4">
                <Input
                  value={highlightName}
                  type="text"
                  placeholder="Highlight Name"
                  onChange={(e) => setHighlightName(e.target.value)}
                  bgColor={"rgb(250, 250, 250)"}
                  borderRight={"none"}
                />
                <InputRightAddon bgColor={"rgb(250, 250, 250)"}>
                  <CloseIcon
                    boxSize={2}
                    cursor={"pointer"}
                    onClick={() => setHighlightName("")}
                  />
                </InputRightAddon>
              </InputGroup>

              <hr className="solid mb-0" />
              <Flex justifyContent={"center"}>
                <Button
                  bgColor={"#FFFFFF"}
                  _hover={{ bgColor: "rgb(250, 250, 250)" }}
                  onClick={onOpenSelectStoryModal}
                  isDisabled={highlightName === "" ? true : false}
                  color={highlightName === "" ? "black" : "blue"}
                >
                  Next
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          onClose={onCloseSelectStoryModal}
          isOpen={isOpenSelectStoryModal}
          isCentered
          id="select-story-modal"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader className="d-flex">
              <ChevronLeftIcon
                alignSelf={"center"}
                justifySelf={"flex-start"}
                onClick={onCloseSelectStoryModal}
                cursor={"pointer"}
              />
              <Text className="mb-0" ms={"125px"}>
                Select Story
              </Text>
            </ModalHeader>
            <ModalCloseButton mt={2} />
            <hr className="solid mt-0" />
            <ModalBody className="p-0">
              <SelectStoryModal
                storiesData={storiesData}
                isSelectedStories={isSelectedStories}
                selectedCoverIndex={selectedCoverIndex}
                handleSelectStory={handleSelectStory}
              />
              <hr className="solid mb-0" />
              <Flex justifyContent={"center"}>
                <Button
                  bgColor={"#FFFFFF"}
                  _hover={{ bgColor: "rgb(250, 250, 250)" }}
                  onClick={handleOpenSelectCoverModal}
                  isDisabled={countSelectedStories > 0 ? false : true}
                  color={countSelectedStories > 0 ? "blue" : "black"}
                >
                  Next
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          onClose={onCloseSelectCoverModal}
          isOpen={isOpenSelectCoverModal}
          isCentered
          id="select-cover-modal"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader className="d-flex">
              <ChevronLeftIcon
                alignSelf={"center"}
                justifySelf={"flex-start"}
                onClick={onCloseSelectCoverModal}
                cursor={"pointer"}
              />
              <Text className="mb-0" ms={"125px"}>
                Select Cover
              </Text>
            </ModalHeader>
            <ModalCloseButton mt={2} />
            <hr className="solid mt-0" />
            <ModalBody className="p-0">
              <SelectCoverModal
                selectedStories={selectedStories}
                selectedCoverIndex={selectedCoverIndex}
                handleSelectCover={handleSelectCover}
              />
              <hr className="solid mb-0" />
              <Flex justifyContent={"center"}>
                <Button
                  bgColor={"#FFFFFF"}
                  _hover={{ bgColor: "rgb(250, 250, 250)" }}
                  onClick={handleSubmit}
                  color={"blue"}
                >
                  Create
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Container>
  );
};
