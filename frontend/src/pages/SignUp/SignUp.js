import React, { useState } from "react";
import { Container, Form, FormGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./SignUp.css";
//import instagramLogo from "../../assets/instagram_font.png";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/Api.js";
import {User} from "../../models/User.js"
import { useToast } from "@chakra-ui/react";
import { InputRightElement, Input, InputGroup } from "@chakra-ui/react";



const SignUp = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullname] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate();
  const toast = useToast();

    const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Xử lý trường hợp mật khẩu không khớp
      setErrorMessage("Mật khẩu không khớp")
      return;
    }
    // Gửi dữ liệu đăng ký đến API hoặc backend
    setErrorMessage("");
    // Call API to signup
    const userData = new User(email, username, fullName, password)
    console.log(userData);

    registerUser(userData)
      .then((res) => {
        toast({
          title: res.data.message,
          status: "success",
          duration: 8000,
          isClosable: true,
          position: "top-right"
        });
        navigate("/login");
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
        height: "800px",
      }}
    >
      <Form className="d-flex flex-column mb-2" onSubmit={handleSubmit}>
        <h1 className="align-self-center" style={{ marginTop: "20px" }}>
          Đăng ký
        </h1>
        <Form.Label className="mt-4" htmlFor="email">Email</Form.Label>
        <FormGroup className="mb-1">
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>
        <Form.Label className="mt-2" htmlFor="fullname">Tên hiển thị</Form.Label>
        <FormGroup className="mb-1">
          <Input
            id="fullname"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullname(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>

        <Form.Label className="mt-2" htmlFor="username">Tên người dùng</Form.Label>
        <FormGroup className="mb-1">
          <Input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>
        <Form.Label className="mt-2" htmlFor="password">Mật khẩu</Form.Label>

        <InputGroup className="mb-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ height: "50px" }}
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
        
        <Form.Label className="mt-2" htmlFor="confirmPassword">Xác nhận mật khẩu</Form.Label>
        <InputGroup className="mb-1">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ height: "50px" }}
          />
          <InputRightElement width="4.5rem">
            <Button
              className="m-0 mt-2"
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                backgroundColor: "#EFECEC",
                color: "black",
                border: "none",
                borderRadius: "5px",
                borderColor: "white",
              }}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {errorMessage.length > 0 && (
          <p className="text-danger">{errorMessage}</p>
        )}
        <Button
          className="align-self-center mb-2 mt-2"
          type="submit"
          style={{ width: "150px" }}
        >
          Đăng ký
        </Button>
        <div
          className="d-flex flex-row"
          style={{ justifyContent: "space-between", alignContent: "center" }}
        >
          <hr className="solid" style={{ width: 170 }}></hr>
          <p style={{ fontSize: "15px" }}>Hoặc</p>
          <hr className="solid" style={{ width: 170 }}></hr>
        </div>
        
        <p className="align-self-center mb-2">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#3897f0", fontWeight: "bold" }}>
            Đăng nhập
          </Link>
        </p>
      </Form>
    </Container>
  );
};

export default SignUp;
