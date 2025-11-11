import Post from '../models/post.model.js';
import { CreatePostSchema } from '../validations/post.validations.js';

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
    const { title, content, coverImage, status, tags } = result.data;

    // Create new post
    const newPost = await Post.create({
      author: userId,
      title,
      content,
      coverImage,
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

export async function getAllPosts(req, res) {}

export async function getUserPosts(req, res) {}

export async function updatePost(req, res) {}

export async function deletePost(req, res) {}
