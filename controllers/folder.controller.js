import Folder from '../models/Folder.model.js';
import File from '../models/File.model.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required',
      });
    }

    if (parentId) {
      const parentFolder = await Folder.findOne({
        _id: parentId,
        owner: req.user.id,
      });

      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: 'Parent folder not found',
        });
      }
    }

    const existingFolder = await Folder.findOne({
      name,
      parent: parentId || null,
      owner: req.user.id,
    });

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: 'A folder with this name already exists in this location',
      });
    }

    const folder = await Folder.create({
      name,
      parent: parentId || null,
      owner: req.user.id,
      path: req.body.path || '/',
    });

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      folder: {
        id: folder._id,
        name: folder.name,
        createdAt: folder.createdAt,
      },
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating folder',
      error: error.message,
    });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }).populate('parent', 'name');

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    res.json({
      success: true,
      folder,
    });
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching folder',
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    await deleteFolderRecursive(folder._id, req.user.id);

    res.json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting folder',
    });
  }
};

async function deleteFolderRecursive(folderId, userId) {
  const subfolders = await Folder.find({ parent: folderId, owner: userId });

  for (const subfolder of subfolders) {
    await deleteFolderRecursive(subfolder._id, userId);
  }

  const files = await File.find({ folder: folderId, owner: userId });
  
  for (const file of files) {
    try {
      await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'raw' });
      await file.deleteOne();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  await Folder.deleteOne({ _id: folderId });
}

export const renameFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required',
      });
    }

    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    const existingFolder = await Folder.findOne({
      name,
      parent: folder.parent,
      owner: req.user.id,
      _id: { $ne: folder._id },
    });

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: 'A folder with this name already exists in this location',
      });
    }

    folder.name = name;
    await folder.save();

    res.json({
      success: true,
      message: 'Folder renamed successfully',
      folder,
    });
  } catch (error) {
    console.error('Rename folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error renaming folder',
    });
  }
};
