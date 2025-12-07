import { formatDistanceToNow } from 'date-fns';
import { PenLine } from 'lucide-react';
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

export function Feed() {
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

  const handlePostClick = (postId) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    navigate(`/posts/${postId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
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
            <div className="space-y-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:border-primary/50 transition-colors"
                  onClick={() => handlePostClick(post.id)}
                >
                  <CardHeader>
                    <CardTitle className="font-serif">{post.title}</CardTitle>
                    <CardDescription>
                      Posted{' '}
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 line-clamp-3">
                      {post.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
