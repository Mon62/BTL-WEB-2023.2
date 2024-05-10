import express from 'express';
import { createPost, updatePost, deletePost,
    getPostById, getNewPostsByUsername} from '../controllers/PostController.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// router.get('*', (req, res) => {
//     res.send('Sorry, this is an invalid URL.');
// })

router.post('/create-post', upload.array('file', 10) ,createPost);
router.put('/update-post', updatePost);
router.delete('/delete-post', deletePost);

router.get('/posts/:pid', getPostById);
router.get('/new-posts/:username', getNewPostsByUsername);

export default router;