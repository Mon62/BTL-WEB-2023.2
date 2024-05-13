import React from "react";
import { Button, AlertDialogBody, useToast, Flex } from "@chakra-ui/react";
import { follow, unfollow } from "../../../api/Api";
import { Success, Error } from "../../../models/Toast";

export const ChangeFollowStatusDialog = ({
  isOpen,
  onClose,
  followStatus,
  currentUser,
  targetUser,
}) => {
  const toast = useToast();

  const handleSubmit = async () => {
    await (followStatus === "Follow" ? follow : unfollow)(
      currentUser,
      targetUser
    )
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
    <AlertDialogBody className="fs-5">
      Are you sure you want to{" "}
      {followStatus === "Follow" ? "follow" : "unfollow"} {targetUser}?
      <hr className="solid my-2" />
      <Flex justifyContent={"flex-end"}>
        <Button className="mt-2 mb-2" onClick={onClose}>
          No
        </Button>
        <Button
          className="mb-2 mt-2"
          onClick={handleSubmit}
          colorScheme="red"
          ml={3}
        >
          Yes
        </Button>
      </Flex>
    </AlertDialogBody>
  );
};
