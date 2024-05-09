import express from "express";
import {
  registerUser,
  resetPassword,
  login,
  logout,
  editProfile,
  getProfileByUsername,
  followUser,
  unfollowUser,
  checkFollowStatus,
  changePassword
} from "../controllers/UserController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.none(), registerUser);
router.post("/login", upload.none(), login);
router.get("/logout", upload.none(), logout);
router.post("/password/reset", upload.none(), resetPassword);
router.post("/password/change", upload.none(), changePassword);
router.post("/account/edit", upload.fields([{name: 'profilePic', maxCount: 1}]), editProfile);
router.get("/profile/:username", upload.none(), getProfileByUsername);
router.post("/follow", upload.none(), followUser);
router.post("/unfollow", upload.none(), unfollowUser);
router.post("/check/followStatus", upload.none(), checkFollowStatus);

export default router;
