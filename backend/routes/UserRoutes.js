import express from "express";
import { registerUser, resetPassword, login, logout } from "../controllers/UserController.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', login);
router.get('/logout', logout);
router.post('/password/reset', resetPassword);

export default router;
