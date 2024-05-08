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
import { follow, unfollow } from "../../../api/Api";
import { Success, Error } from "../../../models/Toast";

export const UnFollowDialog = ({
  isOpen,
  onClose,
  followStatus,
  currentUser,
  targetUser,
}) => {
  const toast = useToast();

  const handleSubmit = async () => {
    await (followStatus === "Follow" ? follow : unfollow)(currentUser, targetUser)
      .then((res) => {
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
    onClose();
  };

  return (
    <AlertDialog onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <AlertDialogContent>
        <AlertDialogHeader>
          {followStatus === "Follow" ? "Follow" : "Unfollow"}
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody className="fs-5">
          Are you sure you want to{" "}
          {followStatus === "Follow" ? "follow" : "unfollow"} {targetUser}?
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
