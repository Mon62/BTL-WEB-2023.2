import express from 'express';

const router = express.Router();

// router.get('/signup/:id', (req, res) => {
//      res.send("signup sucessfully" + req.params.id);
// })
router.get('*', (req, res) => {
    res.send('Sorry, this is an invalid URL.');
})

export default router;