import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { useAuth } from './contexts/AuthContext';
import { RedirectIfAuth } from './components/RedirectIfAuth';

function App() {
  const { user } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [{ path: '/', element: user ? <Home /> : <Landing /> }],
    },
    {
      path: '/auth',
      element: (
        <RedirectIfAuth>
          <Auth />
        </RedirectIfAuth>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
