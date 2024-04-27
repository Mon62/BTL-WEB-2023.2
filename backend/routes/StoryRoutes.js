import express from 'express';
import { createStory } from '../controllers/StoryController.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/create-story', upload.single('media'),createStory);

export default router;