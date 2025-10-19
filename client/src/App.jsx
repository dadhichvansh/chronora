import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';

const isLoggedIn = false;
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: '/', element: isLoggedIn ? <Home /> : <Landing /> }],
  },
  { path: '/auth', element: <Auth /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
