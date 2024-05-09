import React, { useState } from "react";
import { Container, Form, FormGroup, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/Api.js";
import { GoogleButton } from "react-google-button";
import { auth } from "../../firebase/firebase.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'



export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const googleAuthProvider = new GoogleAuthProvider();
  const [showPassword, setShowPassword] = useState(false)
  const VisiblePassword = () => {
    setShowPassword(!showPassword)
  }


  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider)
        .then(() => {
          // navigate("/home");
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    // Call API to login
    login(email, password)
      .then((res) => {
        sessionStorage.setItem("currentUser", res.data.username);
        sessionStorage.setItem("accessToken", res.data.accessToken);
        sessionStorage.setItem("email", email);

        setTimeout(function () {}, 500);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err.response.data);
        setErrorMessage(err.response.data.message);
      });
  };
  return (
    <Container
      className="shadow border p-4 pb-0 rounded-2"
      style={{
        width: "500px",
        marginTop: "200px",
        marginBottom: "200px",
        maxHeight: "550px",
      }}
    >
      <Form className="d-flex flex-column mb-2" onSubmit={handleSubmit}>
        <h1 className="align-self-center" style={{ marginTop: "50px" }}>
          Đăng nhập
        </h1>
        <Form.Label className="mt-3" htmlFor="email">Email</Form.Label>
        <FormGroup className="mb-2" style={{ border: "1px solid #000", borderRadius: 6 }}>
          <Form.Control
            id="email"
            type="email"
            placeholder="Địa chỉ email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>

        <Form.Label className="mt-2" htmlFor="password">Password</Form.Label>

        <InputGroup className="mb-1" style={{ border: "1px solid #000", borderRadius: 6 }}>

          <Form.Control
            id="password"
            type="password"
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ height: "50px" }}
          />
            <IconButton icon={showPassword ? <ViewOffIcon />: <ViewIcon />} onClick={VisiblePassword}  color="black" colorScheme="gray" height={50}></IconButton>

        </InputGroup>
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
        <div
          className="d-flex flex-row"
          style={{ justifyContent: "space-between", alignContent: "center" }}
        >
          <hr className="solid" style={{ width: 170 }}></hr>
          <p style={{ fontSize: "15px" }}>Hoặc</p>
          <hr className="solid" style={{ width: 170 }}></hr>
        </div>
        <div className="align-self-center mb-3">
          <GoogleButton onClick={signInWithGoogle}></GoogleButton>
        </div>
        <Link
          className="align-self-center"
          to="/password/reset"
          style={{ textDecoration: "none", color: "#4285F4", fontWeight: 700 }}
        >
          Quên mật khẩu?
        </Link>
        <p className="align-self-center mt-2 mb-4">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "#4285F4",
              fontWeight: 700,
            }}
          >
            Đăng ký
          </Link>
        </p>
      </Form>
    </Container>
  );
};
