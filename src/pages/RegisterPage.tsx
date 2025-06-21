
import { PublicRoute } from "@/components/auth/PublicRoute";
import { Register } from "@/components/auth/Register";

const RegisterPage = () => {
  return (
    <PublicRoute>
      <Register />
    </PublicRoute>
  );
};

export default RegisterPage;
