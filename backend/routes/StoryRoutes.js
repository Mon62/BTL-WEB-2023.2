import express from 'express';
import { createStory, getStoryByUsername, 
    addToHighlight,getHighlightByUsername, deleteStoriesFromHighlight,
    getNewStoriesByUsername
 } from '../controllers/StoryController.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/create-story', upload.single('media'),createStory);
router.get('/stories/:username', getStoryByUsername);

//highlight
router.post('/highlights/add-to-highlights', addToHighlight);
router.get('/highlights/:username', getHighlightByUsername);
router.post('/highlights/delete', deleteStoriesFromHighlight);

//new stories
router.get('/new-stories/:username', getNewStoriesByUsername);
export default router;