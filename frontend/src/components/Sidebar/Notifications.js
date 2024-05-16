import React from 'react'
import { Box,  Flex, Tooltip, useDisclosure } from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import {
    Drawer,
    DrawerHeader,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'


const Notifications = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleClick = () =>{
        onOpen()
        if(typeof props.handleBg === 'function'){
            (props.handleBg)();
          }
    }
    const handleClose = () =>{
        onClose();
        if(typeof props.handlePrevBg === 'function'){
            (props.handlePrevBg)();
          }
    }
    return (
        <Tooltip
            hasArrow
            label="Notifications"
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
                    placement='left'
                    onClose={handleClose}
                //finalFocusRef={btnRef}
                >
                    <DrawerContent marginLeft={{ base: 70, md: 60 }} >
                        <DrawerCloseButton />
                        <DrawerHeader>Notifications</DrawerHeader>

                        
                    </DrawerContent>
                </Drawer>
                <NotificationsLogo />
                <Box display={{ base: "none", md: "block" }} fontWeight={props.fontWeight}>Notifications</Box>
            </Flex>
        </Tooltip>
    )
}

export default Notifications
