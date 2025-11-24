// routes/assistant.js
import express from 'express';
import { getAllAssistants } from '../controllers/assistantController.js';
const router = express.Router();

router.get('/', getAllAssistants); // handles /api/assistants

export default router;
