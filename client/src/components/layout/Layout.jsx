import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
