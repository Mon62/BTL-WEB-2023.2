import express from "express";
import {
    likePost, likeStory,
    unlikePost, unlikeStory,
    commentOnPost, deleteComment,
    getNotificationsByUsername, getCommentsByPostId, getCommentById
}
from "../controllers/NotificationController.js";
const router = express.Router();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

router.post("/like-post", likePost);
router.post("/unlike-post", unlikePost);

router.post("/like-story", likeStory);
router.post("/unlike-story", unlikeStory);

router.post("/comment-on-post", commentOnPost);
router.delete("/delete-comment", deleteComment);

router.get("/get-notifications/:username", getNotificationsByUsername);
router.get("/get-comments/:postId", getCommentsByPostId);
router.get("/get-comment/:commentId", getCommentById);
export default router;