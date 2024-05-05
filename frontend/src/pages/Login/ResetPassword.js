import React, { useState } from "react";
import { Container, Form, FormGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/Api.js";
import { useToast } from "@chakra-ui/react";
import { Success, Error } from "../../models/Toast.js";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    // Call API to reset password
    resetPassword(email)
      .then((res) => {
        toast(new Success(res));
      })
      .catch((err) => {
        console.log(err);
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
        <p
          className="align-self-center"
          style={{ marginTop: "50px", fontWeight: "600", fontSize: "24px" }}
        >
          Bạn gặp sự cố khi đăng nhập?
        </p>
        <p
          className="align-self-center mt-2"
          style={{
            marginTop: "50px",
            fontWeight: "300",
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          Nhập email của bạn và chúng tôi sẽ gửi cho bạn một <br /> email chứa
          liên kết để cập nhật lại mật khẩu.
        </p>
        <FormGroup className="mb-2 mt-3 align-self-center" style={{ width: "400px" }}>
          <Form.Control
            type="email"
            placeholder="Địa chỉ email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ height: "50px" }}
          />
        </FormGroup>

        {errorMessage.length > 0 && (
          <p className="text-danger">{errorMessage}</p>
        )}
        <Button
          className="align-self-center mb-2 mt-2"
          type="submit"
          style={{ width: "400px", backgroundColor: "#4285F4" }}
        >
          Gửi liên kết đăng nhập
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
          to="/signup"
          style={{ textDecoration: "none", color: "#4285F4", fontWeight: 700 }}
        >
          Tạo tài khoản mới
        </Link>
        <Link
          to="/login"
          className="mt-2 align-self-center"
          style={{ textDecoration: "none", color: "#4285F4", fontWeight: 700 }}
        >
          Quay lại trang đăng nhập
        </Link>
      </Form>
    </Container>
  );
}
