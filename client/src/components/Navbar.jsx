import { Feather, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

export function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { ok } = await logoutUser();
    if (!ok) {
      toast.error('Error logging out');
    }

    toast.success('Logged out successfully');
    navigate('/');
  };

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
              <p className="text-[10px] text-muted-foreground tracking-wide uppercase">
                Your voice, your chronicle
              </p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/feed"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Explore Blogs
                </Link>
                <Link
                  to={`/me/${user.userId}`}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.email || 'User'}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary hover:text-accent-foreground">
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/feed" className="cursor-pointer">
                      Explore Blogs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/me/${user.userId}`} className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="hidden sm:flex text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] transition-all">
                    Start Writing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
