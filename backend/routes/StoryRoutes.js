import express from 'express';
import { createStory } from '../controllers/StoryController.js';
const router = express.Router();

router.post('/create-story', createStory);

export default router;