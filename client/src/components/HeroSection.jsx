import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function HeroSection() {
  const navigate = useNavigate();
  const { user, testimonialsRef, scrollToSection } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20">
      {/* Elegant gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground/80 tracking-wide">
                  Modern Writing Platform
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-serif font-semibold leading-[1.1] tracking-tight">
                  Your voice,
                  <br />
                  your <span className="text-gradient">chronicle</span>
                </h1>

                <p className="text-lg text-foreground/60 leading-relaxed max-w-xl">
                  Craft beautiful stories with powerful tools that enhance your
                  creativity. Write, collaborate, and publish with confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_0_30px_rgba(251,191,36,0.25)] hover:shadow-[0_0_40px_rgba(251,191,36,0.35)] transition-all group"
                  onClick={() =>
                    user ? navigate('/write') : navigate('/auth')
                  }
                >
                  Start Writing Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-secondary/50 hover:text-white font-medium"
                  onClick={() => scrollToSection(testimonialsRef)}
                >
                  View Examples
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="space-y-1">
                  <div className="text-2xl font-serif font-semibold text-gradient">
                    12K+
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Active Writers
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="space-y-1">
                  <div className="text-2xl font-serif font-semibold text-gradient">
                    45K+
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Stories Published
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="space-y-1">
                  <div className="text-2xl font-serif font-semibold text-gradient">
                    4.9★
                  </div>
                  <div className="text-xs text-muted-foreground">
                    User Rating
                  </div>
                </div>
              </div>
            </div>

            {/* Right visual element */}
            <div
              className="relative hidden lg:block animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative aspect-[3/4] rounded-2xl bg-gradient-to-br from-secondary to-card border border-border/50 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl" />
                <div className="relative space-y-6">
                  <div className="h-3 w-1/3 bg-primary/30 rounded-full" />
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-foreground/10 rounded-full" />
                    <div className="h-2 w-5/6 bg-foreground/10 rounded-full" />
                    <div className="h-2 w-4/6 bg-foreground/10 rounded-full" />
                  </div>
                  <div className="pt-8 space-y-3">
                    <div className="h-2 w-full bg-foreground/10 rounded-full" />
                    <div className="h-2 w-full bg-foreground/10 rounded-full" />
                    <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 p-3 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
