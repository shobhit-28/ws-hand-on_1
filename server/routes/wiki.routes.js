import express from 'express'
import { allowedMethods } from '../utils/allowedMethods.util.js';
import { getWikiArticle } from '../controllers/wiki.controller.js';

const router = express.Router();

router.use('/getArticle', allowedMethods({ GET: getWikiArticle }));

export default router;