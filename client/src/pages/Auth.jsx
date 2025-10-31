import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/Tabs';
import { Feather } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { authApi } from '../api/authApi';

export function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('signup-username');
    const email = formData.get('signup-email');
    const password = formData.get('signup-password');

    try {
      const { data } = await authApi.register({ username, email, password });
      console.log(data);

      if (!data.ok) {
        toast({
          title: 'Sign up failed',
          description: data.message,
          variant: 'destructive',
        });
      }

      navigate('/');

      toast({
        title: 'Success!',
        description: "Account created successfully. You're now signed in.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('signin-email');
    const password = formData.get('signin-password');

    try {
      const { data } = await authApi.login({ email, password });
      console.log(data);

      if (!data.ok) {
        toast({
          title: 'Sign in failed',
          description: data.message,
          variant: 'destructive',
        });
      }

      navigate('/');

      toast({
        title: 'Welcome back!',
        description: "You've successfully signed in.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-subtle opacity-60" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Feather className="w-8 h-8 text-primary relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-semibold tracking-tight">
                Chronora
              </h1>
            </div>
          </a>
          <p className="text-muted-foreground text-sm">
            Your voice, your chronicle
          </p>
        </div>

        <Card className="border-border/50 shadow-[0_0_40px_rgba(38,92,50,0.1)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger className="cursor-pointer" value="signin">
                  Sign In
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="signup">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form
                  method="post"
                  action={'/api/auth/login'}
                  onSubmit={handleSignIn}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form
                  method="post"
                  action={'/api/auth/register'}
                  onSubmit={handleSignUp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      name="signup-username"
                      type="text"
                      placeholder="your_username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="signup-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
