import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { PenLine, FileText, Eye, Clock, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { postApi } from '../api/postApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/AlertDialog';
import { toast } from '../hooks/use-toast';

export function Home() {
  const [deletePostId, setDeletePostId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['user-posts', user?.userId],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await postApi.getUserPosts(user._id);

      if (!data.ok) return [];
      return data.posts;
    },
    enabled: !!user,
  });

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    try {
      const { data } = await postApi.deletePost(deletePostId);
      if (!data.ok) {
        toast({
          title: 'Error',
          description: 'Failed to delete post',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['user-posts'] });
        queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } finally {
      setDeletePostId(null);
    }
  };

  if (!user) return null;

  const totalPosts = posts?.length || 0;
  const publishedPosts =
    posts?.filter((p) => p.status === 'published').length || 0;
  const draftPosts = posts?.filter((p) => p.status === 'draft').length || 0;
  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Welcome back,{' '}
              <span className="text-primary">{user.username}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your personal chronicle awaits. Start writing your thoughts.
            </p>
            <Button onClick={() => navigate('/write-a-blog')} className="mt-4">
              <PenLine className="mr-2 h-4 w-4" />
              Start Writing
            </Button>
          </div>

          {/* Activity Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{totalPosts}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Published
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{publishedPosts}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Drafts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{draftPosts}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Recent Posts</CardTitle>
              <CardDescription>Your latest blog entries</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No posts yet</p>
                  <Button onClick={() => navigate('/write-a-blog')}>
                    <PenLine className="mr-2 h-4 w-4" />
                    Write Your First Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <h3 className="font-serif font-semibold text-lg">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <span className="capitalize px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/write-a-blog?postId=${post._id}`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletePostId(post._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {totalPosts > 5 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => navigate('/feed')}
                    >
                      View All Posts
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog
        open={!!deletePostId}
        onOpenChange={() => setDeletePostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
