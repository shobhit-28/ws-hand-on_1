import express from 'express';
import { backendCheck, login, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/test', backendCheck);

export default router;