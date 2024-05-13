import express from 'express';
import { createHighlight, updateHighlight, deleteHighlight,
    getAllHighlightsByUsername
 } from '../controllers/HighlightController.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/highlight/create-highlight', createHighlight);
router.put('/highlight/update-highlight', updateHighlight);
router.get('/highlight/:username', getAllHighlightsByUsername);
router.delete('/highlight/delete-highlight', deleteHighlight);

export default router;