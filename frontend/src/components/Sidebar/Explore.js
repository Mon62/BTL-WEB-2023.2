import React from 'react'
import { Tooltip, Flex,Box } from '@chakra-ui/react'
import { IoCompassOutline } from "react-icons/io5";
const Explore = () => {
  return (
    <Tooltip
            hasArrow
            label="Explore"
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
                
                <IoCompassOutline size={25}/>
                <Box display={{ base: "none", md:  "block" }}>Explore</Box>
            </Flex>
        </Tooltip>
  )
}

export default Explore