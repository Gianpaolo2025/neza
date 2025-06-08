
import { Navigate } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";

export const PrivateRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { role } = useUserContext();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/neza" />;
  }

  return children;
};
