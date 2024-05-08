import React from "react";
import {
  Avatar,
  AvatarGroup,
  Flex,
  VStack,
  Text,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { EditProfileModal } from "./EditProfileModal.js";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileByUsername } from "../../../api/Api.js";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Success, Error } from "../../../models/Toast.js";
import { checkFollowStatus } from "../../../api/Api.js";
import { UnFollowDialog } from "./UnFollowDialog.js";
import { SearchUserModal } from "../../SearchUser/SearchUserModal.js";

export const ProfileHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSearchModal,
    onOpen: onOpenSearchModal,
    onClose: onCloseSearchModal,
  } = useDisclosure();
  const { profileUser } = useParams();
  const [fullName, setFullName] = useState("");
  const [biography, setBiography] = useState("");
  const [profilePicURL, setProfilePicURL] = useState("");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followStatus, setFollowStatus] = useState("");
  const currentUser = sessionStorage.getItem("currentUser");
  const accessToken = sessionStorage.getItem("accessToken");

  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(function () {
      getProfileByUsername(profileUser, accessToken)
        .then((res) => {
          const profileData = res.data;
          setProfilePicURL(profileData.profilePicURL);
          setFullName(profileData.fullName);
          setBiography(profileData.biography);
          setFollowers(profileData.followers);
          setFollowing(profileData.followingUsers);
          setPosts(profileData.posts);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          toast(new Error(err));
        });

      if (currentUser !== profileUser) {
        checkFollowStatus(currentUser, profileUser)
          .then((res) => {
            setFollowStatus(res.data.followStatus);
          })
          .catch((err) => {
            console.log(err.response.data.message);
            toast(new Error(err));
          });
      } else {
        setFollowStatus("");
      }
    }, 0);
  }, [isOpen, profileUser]);

  return (
    <Flex
      gap={{ base: 4, sm: 10 }}
      py={10}
      direction={{ base: "column", md: "row" }}
    >
      <AvatarGroup
        size={{ base: "xl", md: "2xl" }}
        justifyContent={"center"}
        alignSelf={"flex-start"}
        mx={"auto"}
      >
        <Avatar src={profilePicURL} alt="Profile Picture"></Avatar>
      </AvatarGroup>
      <VStack gap={2} alignItems={"start"} flex={1}>
        <Flex
          gap={4}
          direction={{ base: "column", md: "revert" }}
          justify={{ base: "center", md: "flex-start" }}
          w={"full"}
        >
          <Flex
            fontSize={{ base: "sm", md: "2xl" }}
            alignItems={"center"}
            m={0}
          >
            {profileUser}
          </Flex>

          <Flex gap={4} justifyItems={"center"}>
            <Button
              bg={"rgb(239, 239, 239)"}
              _hover={{ bg: "blackAlpha.300" }}
              color={"black"}
              size={{ base: "xs", md: "sm" }}
              onClick={onOpen}
            >
              {followStatus === "" ? "Edit profile" : followStatus}
            </Button>
            {profileUser === currentUser ? (
              <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay
                  bg="blackAlpha.300"
                  backdropFilter="blur(10px) "
                />
                <ModalContent>
                  <ModalHeader>Edit Your Profile</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <EditProfileModal
                      username={profileUser}
                      profilePicURL={profilePicURL}
                      fullName={fullName}
                      biography={biography}
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            ) : (
              <UnFollowDialog
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                followStatus={followStatus}
                targetUser={profileUser}
                currentUser={currentUser}
              />
            )}
          </Flex>

          <Flex gap={4} justifyItems={"center"}>
            <Button
              bg={"rgb(239, 239, 239)"}
              _hover={{ bg: "blackAlpha.300" }}
              color={"black"}
              size={{ base: "xs", md: "sm" }}
              onClick={() =>
                profileUser === currentUser
                  ? navigate("archive/stories")
                  : navigate("message")
              }
            >
              {profileUser === currentUser ? "View archive" : "Message"}
            </Button>
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={{ base: 4, sm: 10 }} mt={0}>
          <Text fontSize={{ base: "xs", md: "lg" }} className="mb-0">
            <Text as="span" fontWeight={"500"} mr={1}>
              {posts.length}
            </Text>
            posts
          </Text>
          <Button
            fontSize={{ base: "xs", md: "lg" }}
            className="px-0"
            bg={"white.alpha"}
            _hover={{ bg: "blackAlpha.100" }}
            onClick={onOpenSearchModal}
          >
            <Text as="span" fontWeight={"500"} mr={1}>
              {followers.length}
            </Text>
            followers
          </Button>
          <SearchUserModal
            isOpen={isOpenSearchModal}
            onClose={onCloseSearchModal}
            modalTitle={"Search"}
          />
          <Button
            fontSize={{ base: "xs", md: "lg" }}
            className="px-0"
            bg={"white.alpha"}
            _hover={{ bg: "blackAlpha.100" }}
          >
            <Text as="span" fontWeight={"500"} mr={1}>
              {following.length}
            </Text>
            following
          </Button>
        </Flex>
        <Flex alignItems={"flex-start"} gap={0} direction={"column"}>
          <Text fontSize={"sm"} fontWeight={"500"} mb={0}>
            {fullName}
          </Text>
          <Text fontSize={"sm"} mb={0}>
            {biography}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
