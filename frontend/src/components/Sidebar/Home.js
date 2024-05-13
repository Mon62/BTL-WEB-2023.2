import React from 'react'
import { Box,  Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from 'react-icons/ai';


const Home = (props) => {
    const handleClick = () =>{
        
        if(typeof props.handleBg === 'function'){
            (props.handleBg)();
          }
    }
    return (
        <Tooltip
            hasArrow
            label="Home"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}
        >
            <Link
                display={"flex"}
                to="/home"
                as={RouterLink}
                alignItems={"center"}
                gap={4}
                _hover={{ bg: "blackAlpha.300" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                bg={props.bg}
                onClick={handleClick}
            >
                <AiFillHome size={25}/>
                <Box display={{ base: "none", md: "block" }}>Home</Box>
            </Link>
        </Tooltip>
    )
}

export default Home