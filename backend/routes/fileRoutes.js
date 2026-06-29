import express from 'express';
import multer from 'multer';
import {
  uploadFile,
  getAllFiles,
  getFileByIdRoute,
  deleteFile,
  restoreFile,
  getVersions,
  downloadFile,
  deletePermanent
} from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/upload', authMiddleware, upload.array('files'), uploadFile);
router.get('/', authMiddleware, getAllFiles);
router.get('/:id', authMiddleware, getFileByIdRoute);
router.get('/download/:id', authMiddleware, downloadFile);
router.post('/delete/:id', authMiddleware, deleteFile);
router.post('/restore/:id', authMiddleware, restoreFile);
router.post('/deletePermanent/:id', authMiddleware, deletePermanent);
router.get('/versions/:filename', authMiddleware, getVersions);

export default router;
