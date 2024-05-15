"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Avatar,
  Center,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { editProfile } from "../../../api/Api.js";
import { Success, Error } from "../../../models/Toast.js";

export const EditProfileModal = ({
  profilePicURL,
  fullName,
  biography,
  username,
}) => {
  const [newFullName, setNewFullName] = useState(fullName);
  const [newBiography, setNewBiography] = useState(biography);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [selectedPicURL, setSelectedPicURL] = useState(profilePicURL);
  const toast = useToast();

  const handlePicChanged = async (event) => {
    const selectedPic = event.target.files[0];
    setNewProfilePic(selectedPic);

    if (selectedPic && selectedPic.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setSelectedPicURL(e.target.result);
      };

      reader.readAsDataURL(selectedPic);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", newFullName);
    formData.append("biography", newBiography);
    formData.append("profilePic", newProfilePic);

    editProfile(username, newProfilePic, newFullName, newBiography)
      .then((res) => {
        toast(new Success(res));
        // onclose();
      })
      .catch((err) => {
        // console.log(err);
        console.log(err.response.data.message);
        toast(new Error(err));
      });
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Stack spacing={4} w={"full"} maxW={"md"} my={6}>
          <Center>
            <Avatar size="2xl" src={selectedPicURL}></Avatar>
          </Center>
          <Center w="full">
            <Button w="full">
              <label for="profilePic">Change Your Avatar</label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                hidden
                onChange={(event) => {
                  handlePicChanged(event);
                }}
              />
            </Button>
          </Center>
          <FormControl id="fullName" isRequired>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="Your full name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              maxLength={"150"}
              value={newFullName}
              onChange={(event) => setNewFullName(event.target.value)}
            />
          </FormControl>
          <FormControl id="biography">
            <FormLabel>Biography</FormLabel>
            <Textarea
              placeholder="Your biography"
              _placeholder={{ color: "gray.500" }}
              maxLength={"150"}
              value={newBiography}
              onChange={(e) => setNewBiography(e.target.value)}
              resize={"horizontal"}
            ></Textarea>
          </FormControl>

          <Button
            bg={"#3182CE"}
            color={"white"}
            w="400px"
            _hover={{
              bg: "blue.600",
            }}
            type="submit"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};
