import React, { useState } from "react";
//import { Form, FormGroup, Label, Input, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./SignUp.css";
import instagramLogo from "../../assets/instagram_font.png";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu đăng ký đến API hoặc backend
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <div className="right-column text-center">
            <img src={instagramLogo} className="instagram-logo"></img>
            <p className="info">Đăng ký để xem ảnh và video từ bạn bè.</p>
            <form>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số di động hoặc email"
                ></input>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên đầy đủ"
                ></input>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên người dùng"
                ></input>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mật khẩu"
                ></input>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Đăng ký
              </button>
            </form>
            <p className="terms">
              Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền
              riêng tư và Chính sách cookie của chúng tôi.
            </p>
          </div>
          <div className="right-column-login text-center">
            <p>
              Bạn đã có tài khoản
              <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
                {" "}
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
