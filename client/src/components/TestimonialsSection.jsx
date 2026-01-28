import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/Card';
import { Quote } from 'lucide-react';

const showcases = [
  {
    quote:
      'Chronora transformed how I write. The clean interface lets me focus on what matters most.',
    author: 'Sarah Mitchell',
    role: 'Content Creator',
    metric: '2.5x',
    metricLabel: 'faster writing',
  },
  {
    quote:
      "The rich editor caught nuances I would have missed. It's like having a professional tool on demand.",
    author: 'James Chen',
    role: 'Blogger',
    metric: '98%',
    metricLabel: 'error reduction',
  },
  {
    quote:
      'Publishing has never been easier. The platform handles everything so I can focus on writing.',
    author: 'Maya Patel',
    role: 'Marketing Lead',
    metric: '5hrs',
    metricLabel: 'saved weekly',
  },
];

export function TestimonialsSection() {
  const { testimonialsRef } = useAuth();

  return (
    <section
      ref={testimonialsRef}
      id="showcase"
      className="py-32 relative overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="text-xs font-medium text-primary tracking-wide uppercase">
              Testimonials
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-serif font-semibold mb-6">
            Loved by <span className="text-gradient">creators worldwide</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {showcases.map((item, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="space-y-6">
                <Quote className="w-8 h-8 text-primary/40" />
                <p className="text-foreground/80 leading-relaxed">
                  "{item.quote}"
                </p>
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-semibold text-sm">{item.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-semibold text-gradient">
                      {item.metric}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.metricLabel}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
