import React, { useEffect, useState } from "react";
import {
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  Modal,
  useToast,
  Input,
  InputLeftAddon,
  InputGroup,
  Container,
  Flex,
  Avatar,
  AvatarGroup,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  follow,
  unfollow,
  getProfileByUsername,
  checkFollowStatus,
} from "../../api/Api";
import { Error, Success } from "../../models/Toast";
import { FaSearch } from "react-icons/fa";

export const SearchUserModal = ({ isOpen, onClose, modalTitle, followers }) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const isGetShortListData = "true";
  const toast = useToast();
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("currentUser");

  useEffect(() => {
    setInput("");

    let usersData = [];
    followers.forEach((username) => {
      getProfileByUsername(username, isGetShortListData)
        .then((res) => {
          const data = res.data;
          checkFollowStatus(currentUser, username)
            .then((ans) => {
              // console.log(followStatus)
              data.followStatus = ans.data.followStatus;
              usersData.push(data);
              // console.log(data);
            })
            .catch((err) => {
              console.log(err.response.data.message);
              toast(new Error(err));
            });
        })
        .catch((err) => {
          console.log(err.response.data.message);
          toast(new Error(err));
        });

      return;
    });
    // console.log(usersData, followers);
    setFollowersData(usersData);
    setSearchResults(usersData);
  }, [followers, isOpen]);
  const search = (value) => {
    const results = followersData.filter((user) => {
      return value === ""
        ? user
        : user.username.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(results);
    console.log(searchResults);
  };
  const handleChangeInput = (value) => {
    setInput(value);
    search(value);
  };
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
        <ModalContent>
          <ModalHeader className="d-flex align-self-center py-2">
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <hr className="solid" />
          <ModalBody>
            <InputGroup className=" d-flex mb-3" dir="row">
              <InputLeftAddon>
                <FaSearch id="search-icon" />
              </InputLeftAddon>
              <Input
                variant={"filled"}
                placeholder="Type to search user"
                value={input}
                onChange={(e) => handleChangeInput(e.target.value)}
              />
            </InputGroup>
            <Container className="p-0" gap={10}>
              {searchResults.map((result, id) => (
                <Flex>
                  <Flex className="mb-2 mt-2" w={"320px"} dir="row" gap={3}>
                    <AvatarGroup alignSelf={"center"}>
                      <Avatar
                        cursor={"pointer"}
                        src={result.profilePicURL}
                        onClick={() => navigate(`/profile/${result.username}`)}
                      />
                    </AvatarGroup>
                    <VStack className="" justifyContent={"flex-start"} gap={0}>
                      <Text
                        className="m-0"
                        style={{ fontWeight: "500" }}
                        onClick={() => navigate(`/profile/${result.username}`)}
                        cursor={"pointer"}
                        alignSelf={"flex-start"}
                      >
                        {result.username}
                      </Text>
                      {result.fullName !== "" && (
                        <Text className="m-0" style={{}}>
                          {result.fullName}
                        </Text>
                      )}
                    </VStack>
                  </Flex>
                  <Button
                    alignSelf={"center"}
                    colorScheme={
                      result.followStatus === "Follow" ? "blue" : "gray"
                    }
                    variant={"solid"}
                  >
                    {result.followStatus}
                  </Button>
                </Flex>
              ))}
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};




