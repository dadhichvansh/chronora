import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String, trim: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
