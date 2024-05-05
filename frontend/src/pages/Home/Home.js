import { Box,  Flex } from "@chakra-ui/react";
import {Col, Row, Container} from 'react-bootstrap'
import React from "react";
import SuggestedUserHeader from "../../components/SuggestedUsers/SuggestedUserHeader";

export default function Home() {
  return (
    <Container maxW={"container.lg"}>
			<Flex gap={20}>
				<Box flex={2} py={10}>
					ok
				</Box>
				<Box flex={3} mr={20} display={{ base: "none", lg: "block" }} maxW={"300px"}>
					<SuggestedUserHeader />
				</Box>
			</Flex>
		</Container>

    //<Container maxW={"container.lg"}>
     // <Flex gap={40}>
      //<Box flex={2} py={10} border={"1px solid blue"}>post</Box>
        //<Box flex={3} mr={20} display={{base:"none", md:"block"}} maxW={"300px"} border={"1px solid red"}>
          //Suggested user
        //</Box>
      //</Flex>
    //</Container>  
  );
}
