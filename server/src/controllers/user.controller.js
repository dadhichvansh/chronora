import User from '../models/user.model.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';

export async function getCurrentUser(req, res) {
  try {
    // Get user from request (set by auth middleware)
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    const user = await User.findById(userId).select('-password -__v -imagePublicId');
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error('Error in getCurrentUser():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(404).json({
        ok: false,
        message: 'Please login to update profile',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    const { displayName } = req.body;
    // Nothing to update
    if (!displayName && !req.file) {
      return res.status(400).json({
        ok: false,
        message: 'Nothing to update',
      });
    }

    if (displayName) user.displayName = displayName;

    // Handle avatar upload
    if (req.file?.buffer) {
      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'chronora/profile-images');

      // Delete previous Cloudinary image if exists
      if (user.imagePublicId) {
        try {
          await deleteFromCloudinary(user.imagePublicId);
        } catch (err) {
          console.warn('Failed to delete old cloudinary image:', err?.message || err);
        }
      }

      // Save new image URL + public id
      user.image = uploadResult.secure_url || '';
      user.imagePublicId = uploadResult.public_id || '';
    }

    await user.save();

    return res.status(200).json({
      ok: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error in updateProfile():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
