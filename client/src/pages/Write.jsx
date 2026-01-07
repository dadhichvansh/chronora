import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, X, ImagePlus, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { postApi } from '../api/postApi';
import RichEditor from '../components/RichEditor';

export function Write() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('blogId')?.split('-')[0] || null;

  // Fetch post when editing
  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ['post', postId],
    enabled: !!postId, // only fetch if editing
    queryFn: async () => {
      const { data } = await postApi.getPostById(postId);
      if (!data.ok) throw new Error(data.message || 'Failed to fetch post');
      return data.post ?? null;
    },
    refetchOnWindowFocus: false,
  });

  // when postData arrives, populate the form
  useEffect(() => {
    if (postData) {
      setTitle(postData.title || '');
      setContent(postData.content || '');
      setTags(Array.isArray(postData.tags) ? postData.tags : []);
      // coverImage (Cloudinary URL) -> preview
      if (postData.coverImage) {
        setCoverImagePreview(postData.coverImage);
        setCoverImageFile(null); // file not set; will remain null unless user changes
      } else {
        setCoverImagePreview(null);
      }
    }
  }, [postData]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setCoverImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setCoverImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const createMutation = useMutation({
    mutationFn: (formData) => postApi.createPost(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-posts'] });
      qc.invalidateQueries({ queryKey: ['feed-posts'] });
      toast.success('Post created!');
      navigate('/explore-blogs');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to create post');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => postApi.updatePost(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-posts'] });
      qc.invalidateQueries({ queryKey: ['feed-posts'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Post updated!');
      navigate('/');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to update post');
    },
  });

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const handleSubmit = async (status) => {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('status', status);
      formData.append('author', user.userId);
      tags.forEach((tag) => formData.append('tags', tag));

      // If user uploaded a new file, append it.
      // If editing and user didn't change the cover, don't append a file:
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      } else if (postId && coverImagePreview && !coverImageFile) {
        // Optionally send existing cover URL so backend doesn't wipe it.
        // Not required if backend preserves existing cover when no file is sent.
        formData.append('existingCover', coverImagePreview);
      }

      if (postId) {
        // update
        await updateMutation.mutateAsync({ id: postId, formData });
      } else {
        // create
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // show skeleton while loading postData when editing
  if (postId && postLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-serif">
                {postId ? 'Edit Your Story' : 'Write Your Story'}
              </CardTitle>
              <CardDescription>Share something meaningful.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title:</label>
                  <Input
                    placeholder="Give your story a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Cover Image (optional, max 5MB):
                  </label>

                  {!coverImagePreview ? (
                    <label
                      htmlFor="coverImage"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or WebP
                        </p>
                      </div>
                      <input
                        id="coverImage"
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium">Tags (max 5):</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onKeyDown={handleTagKeyDown}
                      onChange={(e) => setTagInput(e.target.value)}
                      disabled={tags.length >= 5}
                    />
                    <Button
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || tags.length >= 5}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {tags.map((tag) => (
                      <Badge key={tag} className="gap-1 flex items-center">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <RichEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Tell your story..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleSubmit('published')}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Publishing...' : 'Publish'}
                  </Button>

                  <Button
                    onClick={() => handleSubmit('draft')}
                    disabled={submitting}
                    variant="secondary"
                  >
                    Save Draft
                  </Button>

                  <Button variant="outline" onClick={() => navigate('/')}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
