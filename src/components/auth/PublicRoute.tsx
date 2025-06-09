
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neza-blue-600">Cargando...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/neza" replace />;
  }

  return <>{children}</>;
};
