import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  User as UserIcon,
  Send,
  Trash2,
} from 'lucide-react';
// import { toast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import { commentApi } from '../api/commentApi';

export function Post() {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postId = searchParams.get('postId');

  const { data, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data } = await postApi.getPostById(postId);
      return data;
    },
    enabled: !!postId,
  });

  console.log(data);
  const post = data?.post;
  const comments = data?.comments ?? [];

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await postApi.toggleLike(postId);
      return data;
    },
  });

  const isLiked = likeMutation.isPending;

  const handleLike = async () => {
    if (!user) return navigate('/auth');

    likeMutation.mutate();
  };

  const commentMutation = useMutation({
    mutationFn: async () => {
      const { data } = await commentApi.addComment(postId, newComment);
      return data;
    },
    onSuccess: () => {
      setNewComment('');
    },
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    commentMutation.mutate();
  };

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const { data } = await commentApi.deleteComment(commentId);
      return data;
    },
  });

  const handleDeleteComment = async (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">
              Post not found
            </h1>
            <Link to="/feed">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button */}
          <Link to="/feed">
            <Button variant="ghost" className="gap-2 -ml-2 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </Button>
          </Link>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="w-full aspect-video overflow-hidden rounded-xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {post.author.username?.[0]?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {post.author.username || 'Anonymous'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Like and Comment Actions */}
          <div className="flex items-center gap-6 py-4 border-y border-border">
            <Button
              variant="ghost"
              className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likesCount}</span>
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold">Comments</h2>

            {/* New Comment Form */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback>
                      <UserIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      name="content"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || submittingComment}
                        className="gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment._id}>
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback>
                            {comment.author?.username?.[0]?.toUpperCase() ||
                              'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {comment.author?.username || 'Anonymous'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(comment.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                            {comment.author?._id === user._id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="mt-2 text-foreground/90">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
