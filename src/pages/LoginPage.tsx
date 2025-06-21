
import { PublicRoute } from "@/components/auth/PublicRoute";
import { Login } from "@/components/auth/Login";

const LoginPage = () => {
  return (
    <PublicRoute>
      <Login />
    </PublicRoute>
  );
};

export default LoginPage;
