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
  changePassword,
  getShortenedProfileDataOfAllUser
} from "../controllers/UserController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.none(), registerUser);
router.post("/login", upload.none(), login);
router.get("/logout", upload.none(), logout);
router.get("/password/reset/:email", upload.none(), resetPassword);
router.get("/password/change/:email", upload.none(), changePassword);
router.post("/account/edit", upload.fields([{name: 'profilePic', maxCount: 1}]), editProfile);
router.get("/profile/:username/:isGetShortenedData", upload.none(), getProfileByUsername);
router.get("/profile/all", upload.none(), getShortenedProfileDataOfAllUser);
router.post("/follow", upload.none(), followUser);
router.post("/unfollow", upload.none(), unfollowUser);
router.post("/check/followStatus", upload.none(), checkFollowStatus);

export default router;
