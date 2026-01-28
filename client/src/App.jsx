import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/Layout';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Me } from './pages/Me';
import { useAuth } from './contexts/AuthContext';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Feed } from './pages/Feed';
import { Write } from './pages/Write';
import { Post } from './pages/Post';
import { ResetPassword } from './pages/ResetPassword';
import { Loader } from './components/Loader';
import { Navigate } from 'react-router-dom';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // still checking auth — don't redirect yet
  if (isLoading) return null;

  // If not logged in, redirect to landing page (or /auth)
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

function RedirectIfAuth({ children }) {
  const { user, isLoading } = useAuth();

  // still checking auth — don't redirect yet
  if (isLoading) return null;

  // If user exists → redirect to home
  if (user) return <Navigate to="/" replace />;

  // Else show the wrapped component (login/register page)
  return children;
}

function App() {
  const { user, isLoading } = useAuth();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <RootLayout />,
          errorElement: <NotFound />,
          children: [
            // Public routes
            { path: '/', element: user ? <Home /> : <Landing /> },
            { path: '/explore-blogs', element: <Feed /> },

            // Protected routes
            {
              path: '/profile/:id',
              element: (
                <ProtectedRoute>
                  <Me data={user} />
                </ProtectedRoute>
              ),
            },
            {
              path: '/write-blog',
              element: (
                <ProtectedRoute>
                  <Write />
                </ProtectedRoute>
              ),
            },
            {
              path: '/explore-blogs/blog/:blogId',
              element: (
                <ProtectedRoute>
                  <Post />
                </ProtectedRoute>
              ),
            },
          ],
        },

        // Redirect logged-in users away from /auth
        {
          path: '/auth',
          element: (
            <RedirectIfAuth>
              <Auth />
            </RedirectIfAuth>
          ),
        },

        // Password reset route
        {
          path: '/auth/reset-password',
          element: <ResetPassword />,
        },

        // Fallback route
        {
          path: '*',
          element: <NotFound />,
        },
      ]),
    [user],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
