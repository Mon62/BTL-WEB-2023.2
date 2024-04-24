import express from "express";
import {
  registerUser,
  resetPassword,
  login,
  logout,
  updateProfile,
} from "../controllers/UserController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.none(), registerUser);
router.post("/login", upload.none(), login);
router.get("/logout", upload.none(), logout);
router.post("/password/reset", upload.none(), resetPassword);
router.post("/account/edit", upload.single("profilePic"), updateProfile);

export default router;
