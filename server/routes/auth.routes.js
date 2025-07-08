import express from 'express';
import { backendCheck, login, signup } from '../controllers/auth.controller.js';
import { allowedMethods } from '../utils/allowedMethods.util.js';

const router = express.Router();

// router.post('/signup', signup);
router.use('/signup', allowedMethods({ POST: signup }))
router.use('/login', allowedMethods({ POST: login }))
router.use('/test', allowedMethods({ POST: backendCheck }))
// router.post('/login', login);
// router.get('/test', backendCheck);

export default router;