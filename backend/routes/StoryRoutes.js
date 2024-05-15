import express from "express";
import {
  createStory,
  deleteStory,
  getStoryById,
  getNewStoriesByUsername,
  getMyNewStories,
  getMusicFiles,
  getStoriesByUsername,
} from "../controllers/StoryController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-story", upload.single("media"), createStory);
router.delete("/delete-story", deleteStory);
router.get("/story/:storyId", getStoryById);
router.get("/stories/:username", getStoriesByUsername);
// //highlight
// router.post('/highlights/add-to-highlights', addToHighlight);
// router.get('/highlights/:username', getHighlightByUsername);
// router.post('/highlights/delete', deleteStoriesFromHighlight);

//new stories
router.get("/new-stories/:username", getNewStoriesByUsername);
router.get("/my-new-stories/:username", getMyNewStories);

//MUSIC
router.get("/music", getMusicFiles);
export default router;
