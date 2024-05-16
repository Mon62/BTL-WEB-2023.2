import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Tooltip,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Container,
  Avatar,
  AvatarGroup,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  getShortenedProfileDataOfAllUser,
  checkFollowStatus,
} from "../../api/Api";
import { Error, Success } from "../../models/Toast";
import { FaSearch } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";

const Search = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [input, setInput] = useState("");
  const currentUser = sessionStorage.getItem("currentUser");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setInput("");
    setSearchResults([]);
    setIsLoading(true);
    setIsDisabled(true);

    let data = [];
    getShortenedProfileDataOfAllUser()
      .then((res) => {
        data = res.data.usersData;
        data.forEach((userData, id) => {
          checkFollowStatus(currentUser, userData.username)
            .then((RES) => {
              data[id].followStatus = RES.data.followStatus;
            })
            .catch((err) => {
              console.log(err.response.data.message);
              toast(new Error(err));
            });
        });

        setUsersData(data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast(new Error(err));
      });

    setTimeout(() => {
      setIsLoading(false);
      setIsDisabled(false);
    }, 1000);
  }, [isOpen]);

  const handleClick = () => {
    onOpen();
    if (typeof props.handleBg === "function") {
      props.handleBg();
    }
  };

  const handleClose = () => {
    onClose();
    if (typeof props.handlePrevBg === "function") {
      props.handlePrevBg();
    }
  };

  const search = (value) => {
    const results = usersData.filter((user) => {
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

  return (
    <Tooltip
      hasArrow
      label="Search"
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Flex
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "blackAlpha.300" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        onClick={handleClick}
        bg={props.bg}
      >
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={handleClose}
          size={"sm"}
        >
          <DrawerContent marginLeft={{ base: 70, md: 60 }}>
            <DrawerCloseButton className="mt-2" />
            <DrawerHeader>Search</DrawerHeader>
            <DrawerBody className="pe-0">
              <hr className="solid mt-0" />
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
                  disabled={isDisabled}
                />
                <InputRightAddon>
                  <CloseIcon
                    boxSize={2}
                    cursor={"pointer"}
                    onClick={() => handleChangeInput("")}
                  />
                </InputRightAddon>
              </InputGroup>
              <Container className="p-0" gap={10} h={"620px"} overflow={"auto"}>
                {isLoading && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                )}
                {!isLoading &&
                  searchResults.map((result, id) => (
                    <Flex key={id}>
                      <Flex className="mb-2 mt-2" w={"400px"} dir="row" gap={3}>
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
                    </Flex>
                  ))}
              </Container>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <SearchLogo />
        <Box display={{ base: "none", md: "block" }} fontWeight={props.fontWeight}>Search</Box>
      </Flex>
    </Tooltip>
  );
};

export default Search;
