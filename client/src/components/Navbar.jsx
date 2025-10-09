import { Button } from './ui/Button';
import { Feather } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
      <div className="container mx-auto px-6 lg:px-12 py-5">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Feather className="w-6 h-6 text-primary relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold tracking-tight">
                Chronora
              </h1>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-10">
            <a
              href="#features"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#showcase"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Showcase
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex text-sm">
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] transition-all">
              Start Writing
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
