import React, { useRef} from 'react'
import { Box, Flex,  Tooltip, useDisclosure, Input } from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

const Search = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = useRef()

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
                _hover={{ bg: "blackAlpha.200" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                onClick={onOpen}
            >
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    initialFocusRef={firstField}
                //finalFocusRef={btnRef}
                >
                    <DrawerContent marginLeft={{ base: 70, md: 60 }} >
                        <DrawerCloseButton />
                        <DrawerHeader>Search</DrawerHeader>

                        <DrawerBody>
                            <Input placeholder='Type here...' ref={firstField}/>
                        </DrawerBody>

                    </DrawerContent>
                </Drawer>
                <SearchLogo />
                <Box display={{ base: "none", md:  "block" }}>Search</Box>
            </Flex>
        </Tooltip>
    )
}

export default Search
