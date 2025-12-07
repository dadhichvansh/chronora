import Post from '../models/post.model.js';
import { CreatePostSchema, UpdatePostSchema } from '../validations/post.validations.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

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

    // Validate request body
    const result = UpdatePostSchema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error?.issues?.[0]?.message || 'Invalid input';
      return res.status(400).json({
        ok: false,
        message: 'Validation failed',
        error: formattedErrors,
      });
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

    // Update post fields
    const { title, content, coverImage, status, tags } = result.data;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (status !== undefined) post.status = status;
    if (tags !== undefined) post.tags = tags;

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
