import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase.js";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import userModel from "../models/UserModel.js";

export const registerUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const fullName = req.body.fullName;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // set data for new user
      const createdAt = Timestamp.fromDate(
        new Date(user.metadata.creationTime)
      );
      const userData = new userModel(
        user.uid,
        username,
        fullName,
        email,
        "",
        "",
        createdAt,
        [],
        [],
        []
      );
      await setDoc(
        doc(db, "users", user.uid),
        Object.assign({}, userData)
      ).catch((error) => {
        next(error);
      });

      await sendEmailVerification(auth.currentUser).catch((error) => {
        next(error);
      });

      res.status(200).json({
        status: "success",
        message:
          "Bạn đã đăng ký tài khoản thành công. Thư xác nhận đã được gửi đến email của bạn, vui lòng xác nhận tiếp tục. Trân trọng!",
      });
    })
    .catch(async (error) => {
      console.log(auth.currentUser);

      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use")
        return res.status(409).json({
          status: "error",
          message: "Email " + email + " đã được sử dụng",
        });
      if (errorCode === "auth/weak-password") {
        return res.status(403).json({
          status: "failed",
          message: "Mật khẩu cần có ít nhất 6 ký tự",
        });
      }
      if (errorCode === "auth/invalid-email")
        return res.status(403).json({
          status: "failed",
          message: "Email Không hợp lệ",
        });

      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    });
};

export const resetPassword = async (req, res, next) => {
  const email = req.body.email;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      res.status(200).json({
        status: "success",
        message:
          "Thư hướng dẫn cách reset lại mật khẩu đã được gửi đến email của bạn!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

export const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // console.log(userCredential.user);
      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new Error("Vui lòng xác thực email trước khi đăng nhập!");
        next();
      }
      res.status(200).json({
        status: "success",
        message: "Bạn đã đăng nhập thành công",
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        return res.status(403).json({
          status: "failed",
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }
      if (errorCode === "auth/invalid-email") {
        return res.status(403).json({
          status: "failed",
          message: "Email không hợp lệ!",
        });
      }
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

export const logout = async (req, res) => {
  signOut(auth)
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "Bạn đã đăng xuất tài khoản!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};
