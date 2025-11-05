import { PenLine, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export function Home() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Welcome back,{' '}
              <span className="text-primary">{user.username}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your personal chronicle awaits. Start writing your thoughts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PenLine className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                New Entry
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Capture your thoughts and memories
              </p>
              <Button className="w-full">Start Writing</Button>
            </div>

            <div className="p-6 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                My Entries
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse your past chronicles
              </p>
              <Button variant="outline" className="w-full">
                View All
              </Button>
            </div>

            <div className="p-6 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">
                Timeline
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                View your entries chronologically
              </p>
              <Button variant="outline" className="w-full">
                Open Timeline
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
