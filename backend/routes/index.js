import userRoutes from './UserRoutes.js';
import postRoutes from './PostRoutes.js';
import storyRoutes from './StoryRoutes.js';

export default function router(app) {
    app.use('/', userRoutes);
    app.use('/', postRoutes);
    app.use('/', storyRoutes);
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(400).json({message: err.message});
    })
}