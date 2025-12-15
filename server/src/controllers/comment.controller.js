import Comment from '../models/comment.model.js';

export async function createComment(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const { postId, content } = req.body;

    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
    });

    await comment.populate('author', 'username displayName image');

    res.status(201).json({
      ok: true,
      message: 'Comment created successfully',
      comment,
    });
  } catch (error) {
    console.error('Error in createComment():', error);
    res.status(500).json({
      ok: false,
      message: 'Server error while creating comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
