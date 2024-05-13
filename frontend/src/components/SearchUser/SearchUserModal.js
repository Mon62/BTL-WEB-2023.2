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
  getShortenedProfileDataByUsername,
  checkFollowStatus,
} from "../../api/Api";
import { Error, Success } from "../../models/Toast";
import { FaSearch } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";

export const SearchUserModal = ({
  isOpenModal,
  onCloseModal,
  modalTitle,
  users,
}) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [index, setIndex] = useState(-1);
  const toast = useToast();
  const currentUser = sessionStorage.getItem("currentUser");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setInput("");
    setSearchResults([]);
    setIsDisabled(true);

    console.log(users)
    let usersData = [];
    const userPromises = users.map(async (username) => {
      let data = {};
      await getShortenedProfileDataByUsername(username)
        .then((res) => {
          data = res.data;
          checkFollowStatus(currentUser, username)
            .then((RES) => {
              data.followStatus = RES.data.followStatus;
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
      return data;
    });

    Promise.all(userPromises).then((_usersData) => {
      usersData.push(..._usersData);
      setUsersData(usersData);

    });
    setTimeout(function () {
      setIsLoading(false);
      setIsDisabled(false);
    }, 1000);
  }, [users, isOpenModal]);

  const search = (value) => {
    setIsLoading(true);
    const results = usersData.filter((user) => {
      return value === ""
        ? user
        : user.username.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(results);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500)
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
        }, 500);
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
                disabled={isDisabled}
                variant={"filled"}
                placeholder="Type to search user"
                value={input}
                onChange={(e) => handleChangeInput(e.target.value)}
              />
              <InputRightAddon>
                {" "}
                {index !== -1 ? (
                  <Spinner
                    thickness="4px"
                    speed="0.7s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="lg"
                  />
                ) : (
                  <CloseIcon
                    boxSize={2}
                    cursor={"pointer"}
                    onClick={() => handleChangeInput("")}
                  />
                )}
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
                        {result.followStatus}
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
