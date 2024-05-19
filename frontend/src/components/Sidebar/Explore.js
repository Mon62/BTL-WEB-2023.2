import React from 'react'
import { Tooltip, Flex,Box } from '@chakra-ui/react'
import { IoCompassOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Explore = (props) => {
    const navigate = useNavigate()
    const handleClick = () =>{
        if(typeof props.handleBg === 'function'){
            (props.handleBg)();
          }
          navigate("/explore")
    }
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
                _hover={{ bg: "blackAlpha.300" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                onClick={handleClick}
                bg={props.bg}
            >
                
                <IoCompassOutline size={25}/>
                <Box display={{ base: "none", md:  "block" }} fontWeight={props.fontWeight}>Explore</Box>
            </Flex>
        </Tooltip>
  )
}

export default Explore