import React from "react";
import {
  useDisclosure,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalContent,
  Modal,
} from "@chakra-ui/react";

export const SearchUserModal = ({ isOpen, onClose, modalTitle, userList }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader className="d-flex align-self-center py-2">
          {modalTitle}
        </ModalHeader>
        <ModalCloseButton />
        <hr className="solid" />
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
};
