import express from 'express';
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  getFileById,
} from '../controllers/file.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/download/:id', downloadFile);
router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

export default router;
