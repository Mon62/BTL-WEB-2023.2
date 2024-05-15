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
  getShortenedProfileDataOfAllUser,
  getShortenedProfileDataByUsername,
} from "../controllers/UserController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.none(), registerUser);
router.post("/login", upload.none(), login);
router.get("/logout", logout);
router.get("/password/reset/:email", resetPassword);
router.get("/password/change/:email", changePassword);
router.post(
  "/account/edit",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  editProfile
);
router.get("/profile/:username", getProfileByUsername);
router.get("/profile/shortened/:username", getShortenedProfileDataByUsername);
router.get("/profile/all/shortened", getShortenedProfileDataOfAllUser);
router.post("/follow", upload.none(), followUser);
router.post("/unfollow", upload.none(), unfollowUser);
router.post("/check/followStatus", upload.none(), checkFollowStatus);

export default router;
