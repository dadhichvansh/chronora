import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/Layout';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Me } from './pages/Me';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RedirectIfAuth } from './components/RedirectIfAuth';
import { Loader } from './components/Loader';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Feed } from './pages/Feed';
import { Write } from './pages/Write';

const queryClient = new QueryClient();

function App() {
  const { user } = useAuth();

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
            {
              path: '/feed',
              element: <Feed />,
            },

            // Protected routes
            {
              path: '/u/:id',
              element: (
                <ProtectedRoute>
                  <Me data={user} />
                </ProtectedRoute>
              ),
            },
            {
              path: '/write',
              element: (
                <ProtectedRoute>
                  <Write />
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

        // Fallback route
        {
          path: '*',
          element: <NotFound />,
        },
      ]),
    [user]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
