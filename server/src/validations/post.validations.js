import z from 'zod';

/**
 * Post schema validation using Zod
 */

const titleSchema = z
  .string()
  .min(3, 'Title is required')
  .max(150, 'Title must be less than 150 characters');

const contentSchema = z.string().min(3, 'Content is required');

const coverImageSchema = z.url().optional();

const statusSchema = z.enum(['draft', 'published']).default('draft').optional();

const tagsSchema = z.array(z.string()).optional();

/**
 * Create Post Validation Schema
 */

export const CreatePostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  coverImage: coverImageSchema,
  status: statusSchema,
  tags: tagsSchema,
});
