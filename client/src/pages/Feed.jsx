import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  PenLine,
  User as UserIcon,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { postApi } from '../api/postApi';

const FeedSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="overflow-hidden border-border/50 bg-card/50">
        <Skeleton className="h-48 w-full" />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-6">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
      <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-full border border-primary/20">
        <BookOpen className="w-16 h-16 text-primary" />
      </div>
    </div>
    <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">
      No Stories Yet
    </h3>
    <p className="text-muted-foreground text-center max-w-md mb-8">
      Be the first to share your thoughts and inspire others. Start writing your
      story today.
    </p>
    <Link to="/write">
      <Button size="lg" className="gap-2 group">
        <PenLine className="w-5 h-5" />
        Write Your First Story
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  </div>
);

const PostCard = ({ post, onClick }) => (
  <Card
    className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 hover:shadow-[0_8px_40px_hsl(38_92%_50%/0.1)] transition-all duration-500 cursor-pointer flex flex-col min-h-[460px]"
    onClick={onClick}
  >
    {/* Cover Image */}
    <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
      {post.coverImage ? (
        <>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        </>
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30" />
        </div>
      )}

      {/* Floating read time badge */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-foreground/80">
        <Clock className="w-3 h-3" />
        {Math.max(1, Math.ceil(post.content?.length / 1000))} min read
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-6">
      {/* Author info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {post.author?.displayName || 'Anonymous'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-semibold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
        {post.content}
      </p>

      {/* Tags & Read more */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        {post.tags && post.tags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-secondary/50 hover:bg-secondary border-none"
              >
                {tag}
              </Badge>
            ))}
            {post.tags?.length > 2 && (
              <Badge variant="outline" className="text-xs border-border/50">
                +{post.tags?.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <div />
        )}

        <span className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Read more
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </Card>
);

export function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: async () => {
      const { data } = await postApi.getFeed();
      return data.posts;
    },
    enabled: true, // feed is public
  });

  const posts = data ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <main className="relative container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-3 animate-fade-up">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Discover
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground">
                Global Feed
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Explore stories, insights, and ideas from writers around the
                world
              </p>
            </div>

            <Link
              to="/write"
              className="animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              <Button
                size="lg"
                className="gap-2 group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              >
                <PenLine className="w-5 h-5" />
                {user ? 'Write a Story' : 'Log in to Write'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          {!isLoading && posts.length > 0 && (
            <div className="flex items-center gap-6 mb-10 pb-6 border-b border-border/50 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {posts.length}
                </span>
                <span className="text-muted-foreground text-sm">Stories</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {new Set(posts.map((p) => p.author?._id)).size}
                </span>
                <span className="text-muted-foreground text-sm">Authors</span>
              </div>
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <FeedSkeleton />
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PostCard
                    post={post}
                    onClick={() => navigate(`/explore-blogs/blog/${post._id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
