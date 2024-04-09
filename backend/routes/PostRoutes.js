import express from 'express';

const router = express.Router();

router.get('*', (req, res) => {
    res.send('Sorry, this is an invalid URL.');
})

export default router;