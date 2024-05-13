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
} from "@chakra-ui/react";
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";

export const HighlightStory = () => {
  const {
    isOpen: isOpenCreateHighlightStories,
    onOpen: onOpenCreateHighlightStories,
    onClose: onCloseCreateHighlightStories,
  } = useDisclosure();
  const [highlightName, setHighlightName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setHighlightName("");
    setErrorMessage("");
  }, []);

  const handleSubmit = () => {
    console.log("first");
    if (highlightName === "") {
      setErrorMessage("Please fill in the highlight name");
      return;
    }
  };
  return (
    <Flex>
      <Box padding={"0px 80px 0px 80px"} dir="column" gap={2}>
        <IoIosAddCircleOutline
          size={"120"}
          color="rgb(199, 199, 199)"
          cursor={"pointer"}
          onClick={onOpenCreateHighlightStories}
        />
        <Box className="d-flex justify-content-center">
          <Text className="m-0">New</Text>
        </Box>
        <Modal
          onClose={onCloseCreateHighlightStories}
          isOpen={isOpenCreateHighlightStories}
          isCentered
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
          <ModalContent>
            <ModalHeader className="d-flex align-self-center">
              New Highlight
            </ModalHeader>
            <ModalCloseButton mt={2} />
            <hr className="solid mt-0" />
            <ModalBody>
              <InputGroup>
                <Input
                  value={highlightName}
                  type="text"
                  placeholder="Highlight Name"
                  onChange={(e) => {
                    setHighlightName(e.target.value);
                    setErrorMessage("");
                  }}
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
              {errorMessage.length > 0 && (
                <p className="text-danger">{errorMessage}</p>
              )}
              <hr className="solid mb-0" />
              <Flex justifyContent={"center"}>
                <Button
                  bgColor={"#FFFFFF"}
                  _hover={{ bgColor: "rgb(250, 250, 250)" }}
                  onClick={handleSubmit}
                >
                  Next
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};
