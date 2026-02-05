import express from 'express';
import {
  createFolder,
  getFolderById,
  deleteFolder,
  renameFolder,
} from '../controllers/folder.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.post('/', createFolder);
router.get('/:id', getFolderById);
router.put('/:id', renameFolder);
router.delete('/:id', deleteFolder);

export default router;
