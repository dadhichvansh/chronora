import {
  Sparkles,
  Wand2,
  Users,
  Shield,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { Card } from './ui/Card';

const features = [
  {
    icon: Sparkles,
    title: 'AI Title Generation',
    description:
      "Let AI craft compelling titles that capture your story's essence and engage readers.",
  },
  {
    icon: Wand2,
    title: 'Smart Grammar Check',
    description:
      'Real-time corrections and suggestions to polish your writing as you create.',
  },
  {
    icon: Users,
    title: 'Collaborative Writing',
    description:
      'Work seamlessly with co-authors and editors in real-time collaboration.',
  },
  {
    icon: BookOpen,
    title: 'Rich Text Editor',
    description:
      'Beautiful, distraction-free writing environment with markdown support.',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description:
      'Full control over who can view, edit, or comment on your stories.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Analytics',
    description:
      'Understand your audience with detailed insights and engagement metrics.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="text-xs font-medium text-primary tracking-wide uppercase">
              Features
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-serif font-semibold mb-6 leading-tight">
            Everything you need to craft{' '}
            <span className="text-gradient">exceptional stories</span>
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            Powerful tools designed to enhance every aspect of your writing
            journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
