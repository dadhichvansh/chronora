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

export async function deleteComment(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ ok: false, message: 'Comment not found' });
    }

    // Only author can delete
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();

    res.status(200).json({
      ok: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteComment():', error);
    res.status(500).json({
      ok: false,
      message: 'Server error while deleting comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
