import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>; // Prevent redirect while checking auth
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [user]);

  return <>{children}</>;
} 