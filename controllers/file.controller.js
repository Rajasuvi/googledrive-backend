import File from '../models/File.model.js';
import Folder from '../models/Folder.model.js';
import User from '../models/User.model.js';
import cloudinary from '../config/cloudinary.js';


// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const { folderId } = req.body;

    if (folderId && folderId !== 'null') {
      const folder = await Folder.findOne({ 
        _id: folderId, 
        owner: req.user.id 
      });
      
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: 'Folder not found',
        });
      }
    }

    const file = await File.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      cloudinaryId: req.file.filename,
      cloudinaryUrl: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder: folderId && folderId !== 'null' ? folderId : null,
      owner: req.user.id,
      path: req.body.path || '/',
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { storageUsed: req.file.size },
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
};

export const getFiles = async (req, res) => {
  try {
    const { folderId } = req.query;

    const files = await File.find({
      owner: req.user.id,
      folder: folderId || null,
    }).sort({ createdAt: -1 });

    const folders = await Folder.find({
      owner: req.user.id,
      parent: folderId || null,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        files,
        folders,
      },
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files',
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.json({
      success: true,
      downloadUrl: file.cloudinaryUrl,
      fileName: file.name,
    });
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    try {
      await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'raw' });
    } catch (cloudinaryError) {
      console.error('Cloudinary delete error:', cloudinaryError);
    }

    await file.deleteOne();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { storageUsed: -file.size },
    });

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
    });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }).populate('folder', 'name');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file',
    });
  }
};
