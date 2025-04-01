import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useUser } from '../hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Layout() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <Outlet />
      </main>
    </div>
  );
}
