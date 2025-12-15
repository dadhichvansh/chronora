import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import { CreatePostSchema, UpdatePostSchema } from '../validations/post.validations.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';

// Helper to normalize tags from multipart/form-data
const parseTags = (tagsField) => {
  if (!tagsField) return [];
  if (Array.isArray(tagsField)) return tagsField;
  if (typeof tagsField === 'string') {
    // support comma separated or single tag repeated pattern
    if (tagsField.includes(',')) {
      return tagsField
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return [tagsField.trim()];
  }
  return [];
};

export async function createPost(req, res) {
  try {
    // Ensure the user is authenticated
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    // Validate request body
    const result = CreatePostSchema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error?.issues?.[0]?.message || 'Invalid input';
      return res.status(400).json({
        ok: false,
        message: 'Validation failed',
        error: formattedErrors,
      });
    }

    // Destructure validated data
    const { title, content, status, tags } = result.data;

    // Handle cover image if provided
    let coverImageUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImageUrl = result.secure_url;
    }

    // Create new post
    const newPost = await Post.create({
      author: userId,
      title,
      content,
      coverImage: coverImageUrl,
      status,
      tags,
    });

    await newPost.populate('author', 'username');

    // Respond with success
    return res.status(201).json({
      ok: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error in createPost():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, posts });
  } catch (error) {
    console.error('Error in getAllPosts():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function getUserPosts(req, res) {
  try {
    // Validate userId parameter
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ ok: false, message: 'User ID is required' });
    }

    // Fetch posts by the specified user
    const posts = await Post.find({ author: userId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    if (!posts) {
      return res.status(404).json({ ok: false, message: 'No posts found for this user' });
    }

    return res.status(200).json({ ok: true, posts });
  } catch (error) {
    console.error('Error in getUserPosts():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function getPostById(req, res) {
  try {
    // Validate postId parameter
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ ok: false, message: 'Post ID is required' });
    }

    const post = await Post.findById(postId).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      post: {
        ...post.toObject(),
        likesCount: post.likes.length,
      },
      comments: comments || [],
    });
  } catch (error) {
    console.error('Error in getPostById():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function toggleLike(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' });
    }

    const liked = post.likes.includes(userId);
    if (liked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      ok: true,
      message: liked ? 'Post unliked' : 'Post liked',
      likesCount: post.likes.length,
      liked: !liked,
    });
  } catch (error) {
    console.error('Error in toggleLike():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function updatePost(req, res) {
  try {
    // Ensure the user is authenticated
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    // Validate postId parameter
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ ok: false, message: 'Post ID is required' });
    }

    // Find the post to update
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({ ok: false, message: 'Forbidden: You cannot edit this post' });
    }

    // Validate request body
    const { title, content, status, removeCover } = req.body;
    const tags = parseTags(req.body.tags);

    // Update post fields
    if (title !== undefined) post.title = String(title).trim();
    if (content !== undefined) post.content = String(content).trim();
    if (status !== undefined) post.status = status === 'draft' ? 'draft' : 'published';
    if (tags) post.tags = tags;

    // Handle file upload (Multer memory => req.file.buffer)
    if (req.file && req.file.buffer) {
      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'chronora/covers');

      // Delete previous Cloudinary image if exists
      if (post.coverImagePublicId) {
        try {
          await deleteFromCloudinary(post.coverImagePublicId);
        } catch (err) {
          console.warn('Failed to delete old cloudinary image:', err?.message || err);
        }
      }

      // Save new image URL + public id
      post.coverImage = uploadResult.secure_url || '';
      post.coverImagePublicId = uploadResult.public_id || '';
    } else if (removeCover === 'true' || removeCover === true) {
      // Remove existing cover if requested
      if (post.coverImagePublicId) {
        try {
          await deleteFromCloudinary(post.coverImagePublicId);
        } catch (err) {
          console.warn('Failed to delete cloudinary image:', err?.message || err);
        }
      }
      post.coverImage = '';
      post.coverImagePublicId = '';
    }
    // else: no file & no removeCover -> keep existing coverImage

    await post.save();
    await post.populate('author', 'username');

    return res.status(200).json({
      ok: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.error('Error in updatePost():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function deletePost(req, res) {
  try {
    // Ensure the user is authenticated
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    // Validate postId parameter
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ ok: false, message: 'Post ID is required' });
    }

    // Find the post to delete
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({ ok: false, message: 'Forbidden: You cannot delete this post' });
    }

    // Delete Cloudinary image if exists
    if (post.coverImagePublicId) {
      try {
        await deleteFromCloudinary(post.coverImagePublicId);
      } catch (err) {
        console.warn(
          'Failed to delete cloudinary image during post deletion:',
          err?.message || err
        );
      }
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      ok: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error in deletePost():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
