import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getNewPostsByUsername,
  getPostsByUsername,
  getRecommendPosts,
  getExplorePosts,
  savePost,
  unSavePost,
  getSavedPosts
} from "../controllers/PostController.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-post", upload.array("file", 10), createPost);
router.put("/update-post", updatePost);
router.delete("/delete-post", deletePost);

router.get("/post/:pid", getPostById);
router.get("/posts/:username", getPostsByUsername);
router.get("/new-posts/:username", getNewPostsByUsername);
router.get("/recommend-posts/:username", getRecommendPosts);
router.get("/explore-posts/:username", getExplorePosts);

//save post
router.post("/save-post", savePost);
router.delete("/unsave-post", unSavePost);
router.get("/saved-posts/:username", getSavedPosts);


export default router;
