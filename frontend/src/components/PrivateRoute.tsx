import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useSelector((state: RootState) => state.user);

  if (isLoading) {
    return <div>Loading...</div>; // Prevent redirect while checking auth
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
} 