import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PenLine, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postApi } from '../api/postApi';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog';
import { Badge } from '../components/ui/Badge';

export function Feed() {
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: async () => {
      const { data } = await postApi.getAllPosts();
      if (!data.ok) return [];
      return data.posts;
    },
  });

  const filteredPosts = posts.filter((post) => post.status === 'published');

  const handlePostClick = (postId) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    navigate(`/posts?postId=${postId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                Global Feed
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover stories from writers around the world
              </p>
            </div>
            <Link to={user ? '/write' : '/auth'}>
              <Button className="gap-2">
                <PenLine className="w-4 h-4" />
                {user ? 'Write Story' : 'Login to Write'}
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading stories...</p>
            </div>
          ) : isError ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Failed to load stories. Please try again.
                </p>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No stories yet. Be the first to write one!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 flex gap-7">
              {filteredPosts.map((post) => (
                <Card
                  key={post._id}
                  className="hover:border-primary/50 w-max transition-colors overflow-hidden cursor-pointer flex flex-col h-[350px]"
                  onClick={() => {
                    setSelectedPost(post);
                    handlePostClick(post._id);
                  }}
                >
                  {post.coverImage ? (
                    <div className="h-40 w-full overflow-hidden flex-shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-muted-foreground text-sm">
                        No cover image
                      </span>
                    </div>
                  )}
                  <CardHeader className="pb-2 flex-shrink-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <UserIcon className="w-4 h-4" />
                      <span>
                        {!user
                          ? 'Anonymous'
                          : post.author.username || 'Anonymous'}
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <CardTitle className="font-serif text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-foreground/80 text-sm line-clamp-3">
                      {post.content}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Full Post Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <UserIcon className="w-4 h-4" />
                  <span>
                    {selectedPost.profiles?.display_name || 'Anonymous'}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(selectedPost.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <DialogTitle className="font-serif text-2xl">
                  {selectedPost.title}
                </DialogTitle>
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </DialogHeader>
              {selectedPost.cover_image && (
                <div className="w-full aspect-video overflow-hidden rounded-lg my-4">
                  <img
                    src={selectedPost.cover_image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
