import React, { useState } from "react";
import { Container, Form, FormGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/Api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    // Call API to login
    login(email, password)
      .then((res) => {
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
        maxHeight: "480px",
      }}
    >
      <Form className="d-flex flex-column mb-2" onSubmit={handleSubmit}>
        <h1 className="align-self-center" style={{ marginTop: "50px" }}>
          Đăng nhập
        </h1>
        <FormGroup className="mb-2 mt-3" style={{ width: "400px" }}>
          <Form.Control
            type="email"
            placeholder="Địa chỉ email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>
        <FormGroup className="mb-3 mt-2">
          <Form.Control
            type="password"
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>
        {errorMessage.length > 0 && (
          <p className="text-danger">{errorMessage}</p>
        )}
        <Button
          className="align-self-center mb-2 mt-2"
          type="submit"
          style={{ width: "150px" }}
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
        <Link
          className="align-self-center"
          to="/password/reset"
          style={{ textDecoration: "none", color: "blue" }}
        >
          Quên mật khẩu?
        </Link>
        <p className="align-self-center mt-2 mb-2">
          Bạn chưa có tài khoản?{" "}
          <Link to="/signup" style={{ textDecoration: "none", color: "blue" }}>
            Đăng ký
          </Link>
        </p>
      </Form>
    </Container>
  );
}
