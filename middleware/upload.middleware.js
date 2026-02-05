import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // ✅ USE CONFIGURED INSTANCE

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'googledrive-files',
    resource_type: 'auto',
    allowed_formats: [
      'jpg', 'jpeg', 'png', 'gif',
      'pdf', 'doc', 'docx', 'txt',
      'zip', 'mp4', 'mp3',
      'xls', 'xlsx', 'ppt', 'pptx'
    ],
  },
});

const upload = multer({
  storage,
  
});

export default upload;
