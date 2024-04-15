import express from 'express';
import { createPost } from '../controllers/PostController.js';
const router = express.Router();

// router.get('*', (req, res) => {
//     res.send('Sorry, this is an invalid URL.');
// })

router.post('/create-post', createPost);


export default router;