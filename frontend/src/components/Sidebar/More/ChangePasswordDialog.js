import React from "react";
import {
  AlertDialog,
  Button,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { Success, Error } from "../../../models/Toast";
import { changePassword } from "../../../api/Api";

export const ChangePasswordDialog = ({ isOpen, onClose, email }) => {
  const toast = useToast();

  const handleSubmit = async () => {
    console.log(email)
    changePassword(email)
      .then((res) => {
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };

  return (
    <AlertDialog onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <AlertDialogContent>
        <AlertDialogHeader>Change Password</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody className="fs-5">
          Are you sure you want to change your password?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onClose}>No</Button>
          <Button onClick={handleSubmit} colorScheme="red" ml={3}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
