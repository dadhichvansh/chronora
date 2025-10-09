import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/layout/Layout';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';

const isLoggedIn = false;
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: '/', element: isLoggedIn ? <Home /> : <Landing /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
