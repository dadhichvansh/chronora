import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-6">
        <div className="relative inline-block">
          <h1 className="text-9xl font-serif font-bold text-primary/20">404</h1>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-transparent blur-3xl" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-serif font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] transition-all"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
