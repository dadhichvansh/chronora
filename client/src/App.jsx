import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Me } from './pages/Me';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RedirectIfAuth } from './components/RedirectIfAuth';
import { useMemo } from 'react';

function App() {
  const { user } = useAuth();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <RootLayout />,
          errorElement: <ErrorPage />,
          children: [
            // Public routes
            { path: '/', element: user ? <Home /> : <Landing /> },

            // Protected routes
            {
              path: '/me',
              element: (
                <ProtectedRoute>
                  <Me data={user} />
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
          element: <ErrorPage />,
        },
      ]),
    [user]
  );

  return <RouterProvider router={router} />;
}

export default App;
