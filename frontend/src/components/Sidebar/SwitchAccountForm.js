import React from 'react'
import { useState } from 'react';
import { FormLabel, Modal } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/InputGroup';
import { IconButton, useToast} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { login, logout } from "../../api/Api.js";



const SwitchAccountForm = (props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        // Call API to login
        logout()
			.then((res) => {
				toast({
					title: 'Changing account',
					description: "It may took a few seconds",
					status: 'loading',
					duration: 3000,
					isClosable: true,
				})

                setTimeout(() => login(email, password)
                .then((res) => {
                    //navigate("/home");
                })
                .catch((err) => {
                    console.log(err.response.data);
                    setErrorMessage(err.response.data.message);
                })
                , 3000
				)
			})
        
    };

    const VisiblePassword = () => setShowPassword(!showPassword)
    return (
        <Modal show={props.showAtt} onHide={props.handleCloseAtt} centered>
            <Modal.Header closeButton >
                <Modal.Title style={{ textAlign: "center", width: "100%" }}>Switch Accounts</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="d-flex flex-column mb-2" onSubmit={handleSubmit}>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormGroup className="mb-3" style={{ border: "1px solid #000", borderRadius: 6 }}>
                        <Form.Control
                            id='email'
                            type="email"
                            placeholder="Địa chỉ email"
                            required
                            style={{ height: "50px" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>

                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormGroup className="mb-3" style={{ border: "1px solid #000", borderRadius: 6 }}>
                        <Form.Control
                            id='password'
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            required
                            style={{ height: "50px" }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <IconButton icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} onClick={VisiblePassword} color="black" colorScheme="gray" height={50}></IconButton>
                    </FormGroup>
                    {errorMessage.length > 0 && (
                        <p className="text-danger">{errorMessage}</p>
                    )}
                    <Button
                        className="align-self-center mb-2 mt-2"
                        type="submit"
                        style={{ width: "150px", backgroundColor: "#4285F4" }}
                    >
                        Đăng nhập
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Link
                    as={RouterLink}
                    to={"/password/reset"}
                    fontWeight={'medium'}
                    fontSize={14}
                    color='blue.400'
                    cursor={'pointer'}
                    style={{ textDecoration: "none" }}
                    _hover={{ color: "black" }}

                >Forgot Password? </Link>
            </Modal.Footer>
        </Modal>
    )
}

export default SwitchAccountForm