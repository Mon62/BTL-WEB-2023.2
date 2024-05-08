import React from 'react'
import { Box, Flex, Tooltip, useDisclosure, Input } from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'


const Create = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Tooltip
            hasArrow
            label="Create"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}
        >
            <Flex
                alignItems={"center"}
                gap={4}
                _hover={{ bg: "blackAlpha.200" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                onClick={onOpen}
            >
                <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader style={{textAlign: "center", width: "100%"}}>Create new post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <Input type={"file"}></Input>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <CreatePostLogo />
                <Box display={{ base: "none", md: "block" }}>Create</Box>
            </Flex>
        </Tooltip>
    )
}

export default Create
