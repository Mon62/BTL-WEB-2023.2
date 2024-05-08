import React from 'react'
import { Tooltip, Flex, Box } from '@chakra-ui/react'
import { MessagesLogo } from '../../assets/constants'
const Messages = () => {
  return (
    <Tooltip
            hasArrow
            label="Messages"
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
                //onClick={""}
            >
                
                <MessagesLogo />
                <Box display={{ base: "none", md:  "block" }}>Messages</Box>
            </Flex>
        </Tooltip>
    )
}
  

export default Messages