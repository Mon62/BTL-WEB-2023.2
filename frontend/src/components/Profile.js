import React from 'react'
import { Tooltip, Flex,Box, Avatar } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
    const navigate = useNavigate()
    const handleClick = (e) =>{
        navigate("/profile")
    }
  return (
    <Tooltip
            hasArrow
            label="Profile"
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
                onClick={handleClick}
            >
                
                <Avatar size={"xs"} src={""}/>
                <Box display={{ base: "none", md:  "block" }}>Profile</Box>
            </Flex>
        </Tooltip>
  )
}

export default Profile