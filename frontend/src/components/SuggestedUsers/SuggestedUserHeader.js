import React from 'react'
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Avatar, Flex, Link, Text, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { logout } from "../../api/Api.js";

const SuggestedUserHeader = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Logout
    const navigate = useNavigate()
	const toast = useToast()
    
	const handleLogout = (e) => {
		e.preventDefault();
		// Call API to logout
		logout()
			.then((res) => {
				toast({
					title: 'Logging Out',
					description: "You need to log back in",
					status: 'loading',
					duration: 2000,
					isClosable: true,
				})
				setTimeout(() => navigate("/login"), 2000
				)
			})
			.catch((err) => {
				console.log(err.response.data);
			});

	}

    return (
        <VStack py={8} px={6} gap={4}>
            <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} gap={10}>
                <Flex alignItems={"center"} gap={2}>
                    <Avatar name='test name' size={'lg'} />
                    <Text fontSize={14} fontWeight={'bold'} alignItems={"center"} marginBottom={0} > test name</Text>

                </Flex>
                <Link
                    fontWeight={'medium'}
                    fontSize={14}
                    color='blue.400'
                    cursor={'pointer'}
                    style={{ textDecoration: "none" }}
                    _hover={{ color: "black" }}
                    onClick={handleShow}
                >Switch</Link>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton >
                        <Modal.Title style={{ textAlign: "center", width: "100%" }}>Switch accounts</Modal.Title>
                    </Modal.Header>
                    <Modal.Body></Modal.Body>
                    <Modal.Footer style={{justifyContent: "center",alignItems:"center", width: "100%"}}>
                        <Link
                            fontWeight={'medium'}
                            fontSize={14}
                            color='blue.400'
                            cursor={'pointer'}
                            style={{ textDecoration: "none" }}
                            _hover={{ color: "black" }}
                            onClick={handleLogout}
                        >Log into an Existing Account</Link>
                    </Modal.Footer>
                </Modal>

            </Flex>
        </VStack>
    )
}

export default SuggestedUserHeader