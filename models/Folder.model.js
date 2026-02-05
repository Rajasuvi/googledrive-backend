import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    path: {
      type: String,
      default: '/',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate folder names in the same parent folder
folderSchema.index({ name: 1, parent: 1, owner: 1 }, { unique: true });

// Index for faster queries
folderSchema.index({ owner: 1, parent: 1 });

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;
