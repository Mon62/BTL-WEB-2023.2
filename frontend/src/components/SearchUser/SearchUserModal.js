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
  InputRightAddon,
  InputGroup,
  Container,
  Flex,
  Avatar,
  AvatarGroup,
  VStack,
  Text,
  Button,
  SkeletonCircle,
  SkeletonText,
  Box,
  Spinner,
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
import { CloseIcon } from "@chakra-ui/icons";

export const SearchUserModal = ({
  isOpenModal,
  onCloseModal,
  modalTitle,
  followers,
}) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(-1);
  const isGetShortListData = "true";
  const toast = useToast();
  const currentUser = sessionStorage.getItem("currentUser");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setInput("");

    let usersData = [];
    followers.forEach((username) => {
      getProfileByUsername(username, isGetShortListData)
        .then((res) => {
          const data = res.data;
          checkFollowStatus(currentUser, username)
            .then((RES) => {
              data.followStatus = RES.data.followStatus;
              usersData.push(data);
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

    setFollowersData(usersData);
    setSearchResults(usersData);
    setTimeout(function () {
      setIsLoading(false);
    }, 8000);
  }, [followers, isOpenModal]);

  const search = (value) => {
    const results = followersData.filter((user) => {
      return value === ""
        ? user
        : user.username.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(results);
  };

  const handleChangeInput = (value) => {
    setInput(value);
    search(value);
  };

  const handleChangeFollowStatus = (
    currentUser,
    targetUser,
    followStatus,
    id
  ) => {
    let newSearchResults = searchResults;
    setIndex(id);
    (followStatus === "Follow" ? follow : unfollow)(currentUser, targetUser)
      .then((res) => {
        newSearchResults[id].followStatus =
          followStatus === "Follow" ? "Following" : "Follow";
        setSearchResults(newSearchResults);
        setTimeout(function () {
          setIndex(-1);
        }, 300);
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };
  return (
    <>
      <Modal onClose={onCloseModal} isOpen={isOpenModal} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
        <ModalContent>
          <ModalHeader className="d-flex align-self-center py-2">
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <hr className="solid" />
          <ModalBody paddingRight={0}>
            <InputGroup className=" d-flex mb-3 pe-4" dir="row">
              {input === "" && (
                <InputLeftAddon>
                  <FaSearch id="search-icon" />
                </InputLeftAddon>
              )}
              <Input
                variant={"filled"}
                placeholder="Type to search user"
                value={input}
                onChange={(e) => handleChangeInput(e.target.value)}
              />
              <InputRightAddon>
                {" "}
                <CloseIcon
                  boxSize={2}
                  cursor={"pointer"}
                  onClick={() => handleChangeInput("")}
                />
              </InputRightAddon>
            </InputGroup>
            <Container className="p-0" gap={10} h={"300px"} overflow={"auto"}>
              {isLoading &&
                [0, 1, 2, 3, 4].map((_, index) => (
                  <Box className="d-flex" dir="row" gap={3} mb={3} key={index}>
                    <Box>
                      <SkeletonCircle size={"12"} />
                    </Box>
                    <Box
                      bg="white"
                      w={"50%"}
                      alignSelf={"center"}
                      borderRadius={"100px"}
                    >
                      <SkeletonText
                        noOfLines={2}
                        spacing="2"
                        skeletonHeight="4"
                      />
                    </Box>
                  </Box>
                ))}
              {!isLoading &&
                searchResults.map((result, id) => (
                  <Flex key={id}>
                    <Flex className="mb-2 mt-2" w={"290px"} dir="row" gap={3}>
                      <AvatarGroup alignSelf={"center"}>
                        <Avatar
                          cursor={"pointer"}
                          src={result.profilePicURL}
                          onClick={() =>
                            navigate(`/profile/${result.username}`)
                          }
                        />
                      </AvatarGroup>
                      <VStack
                        className=""
                        justifyContent={"flex-start"}
                        gap={0}
                      >
                        <Text
                          className="m-0"
                          style={{ fontWeight: "500" }}
                          onClick={() =>
                            navigate(`/profile/${result.username}`)
                          }
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
                    {result.username !== currentUser && (
                      <Button
                        alignSelf={"center"}
                        colorScheme={
                          result.followStatus === "Follow" ? "blue" : "gray"
                        }
                        variant={"solid"}
                        key={id}
                        onClick={() =>
                          handleChangeFollowStatus(
                            currentUser,
                            result.username,
                            result.followStatus,
                            id
                          )
                        }
                      >
                        {index === id ? (
                          <Spinner
                            thickness="4px"
                            speed="0.7s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="lg"
                          />
                        ) : (
                          result.followStatus
                        )}
                      </Button>
                    )}
                  </Flex>
                ))}
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
