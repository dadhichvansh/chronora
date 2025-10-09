import { Feather, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Feather className="w-6 h-6 text-primary relative z-10" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold">Chronora</h3>
              </div>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-sm">
              Empowering writers with AI-powered tools to create, collaborate,
              and share beautiful stories.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border/50"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border/50"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border/50"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border/50"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-foreground/80">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  AI Tools
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-foreground/80">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-foreground/80">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-foreground/80">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/50">
            <p>© {new Date().getFullYear()} Chronora. All rights reserved.</p>
            <p className="text-xs">Crafted with care for writers everywhere</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
