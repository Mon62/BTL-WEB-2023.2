import React from "react";
import { useState } from "react";
import {  Modal } from "react-bootstrap";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/InputGroup";
import {  useToast } from "@chakra-ui/react";
import { login, logout } from "../../api/Api.js";
import { Success } from "../../models/Toast.js";
import { InputRightElement, Input, InputGroup } from "@chakra-ui/react";


const SwitchAccountForm = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  const pathname = window.location.pathname;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    // Call API to login
    logout()
      .then((res) => {
        toast({
          title: "Changing account",
          description: "It may took a few seconds",
          status: "loading",
          duration: 1000,
          isClosable: true,
          position: "top-right",
        });

        setTimeout(
          () =>
            login(email, password)
              .then((res) => {
                sessionStorage.setItem("currentUser", res.data.username);
                sessionStorage.setItem("accessToken", res.data.accessToken);
                sessionStorage.setItem("email", email);

                setTimeout(function () {
                  toast(new Success(res));
                }, 500);

                setTimeout(function () {
                  if (pathname === "/home") window.location.reload();
                  else {
                    props.handleCloseAtt();
                    navigate("/home");
                  }
                }, 500);
              })
              .catch((err) => {
                console.log(err.response.data);
                setErrorMessage(err.response.data.message);
              }),
          1000
        );
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <Modal show={props.showAtt} onHide={props.handleCloseAtt} centered style={{backdropFilter: "blur(10px)"}}>
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center", width: "100%" }}>
          Switch Accounts
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column mb-2" onSubmit={handleSubmit}>
        <Form.Label className="mt-3" htmlFor="email">
          Email
        </Form.Label>
        <FormGroup className="mb-2">
          <Input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: "50px" }}
            borderColor={"blackAlpha.300"}

          />
        </FormGroup>

        <Form.Label className="mt-2" htmlFor="password">
          Password
        </Form.Label>
        <InputGroup className="mb-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ height: "50px" }}
            borderColor={"blackAlpha.300"}

          />
          <InputRightElement width="4.5rem">
            <Button
              className="m-0 mt-2"
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                backgroundColor: "#EFECEC",
                color: "black",
                border: "none",
                borderRadius: "5px",
                borderColor: "white",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
          {errorMessage.length > 0 && (
            <p className="text-danger">{errorMessage}</p>
          )}
          <Button
            className="align-self-center mb-2 mt-2"
            type="submit"
            style={{ width: "150px", backgroundColor: "#4285F4" }}
          >
            Sign in
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Link
          as={RouterLink}
          to={"/password/reset"}
          fontWeight={"medium"}
          fontSize={14}
          color="blue.400"
          cursor={"pointer"}
          style={{ textDecoration: "none" }}
          _hover={{ color: "black" }}
        >
          Forgot Password?{" "}
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default SwitchAccountForm;
