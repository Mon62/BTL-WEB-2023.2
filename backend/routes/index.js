import userRoutes from './UserRoutes.js';
import postRoutes from './PostRoutes.js';

export default function router(app) {
    app.use('/', userRoutes);
    app.use('/', postRoutes);
}