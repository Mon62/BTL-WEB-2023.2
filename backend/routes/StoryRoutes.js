import express from 'express';
import { createStory, getStoryByUsername } from '../controllers/StoryController.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/create-story', upload.single('media'),createStory);
router.get('/stories/:username', getStoryByUsername);
export default router;