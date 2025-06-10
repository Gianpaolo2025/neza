
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff } from "lucide-react";

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'token'>('credentials');

  // Credenciales de administrador (en producción esto debería estar en backend)
  const ADMIN_CREDENTIALS = {
    email: "admin@neza.com",
    password: "neza2024admin"
  };
  
  const ADMIN_TOKEN = "NEZA_ADMIN_2024_SECURE_TOKEN";

  const handleCredentialLogin = () => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      onLogin(ADMIN_TOKEN);
      localStorage.setItem('nezaAdminToken', ADMIN_TOKEN);
    } else {
      setError("Credenciales incorrectas. Intenta con admin@neza.com");
    }
  };

  const handleTokenLogin = () => {
    if (adminToken === ADMIN_TOKEN) {
      onLogin(ADMIN_TOKEN);
      localStorage.setItem('nezaAdminToken', ADMIN_TOKEN);
    } else {
      setError("Token de administrador inválido");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-neza-blue-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-neza-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-neza-blue-800">NEZA</CardTitle>
          <CardDescription className="text-neza-blue-600">
            Panel de Administración - Acceso Restringido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex rounded-lg bg-neza-blue-50 p-1">
            <Button
              variant={loginMethod === 'credentials' ? 'default' : 'ghost'}
              className={`flex-1 ${loginMethod === 'credentials' ? 'bg-neza-blue-600 hover:bg-neza-blue-700' : 'hover:bg-neza-blue-100'}`}
              onClick={() => setLoginMethod('credentials')}
            >
              Email/Contraseña
            </Button>
            <Button
              variant={loginMethod === 'token' ? 'default' : 'ghost'}
              className={`flex-1 ${loginMethod === 'token' ? 'bg-neza-blue-600 hover:bg-neza-blue-700' : 'hover:bg-neza-blue-100'}`}
              onClick={() => setLoginMethod('token')}
            >
              Token Admin
            </Button>
          </div>

          {loginMethod === 'credentials' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-neza-blue-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neza.com"
                  className="border-neza-blue-200 focus:border-neza-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-neza-blue-700">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-neza-blue-200 focus:border-neza-blue-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-neza-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleCredentialLogin} 
                className="w-full bg-neza-blue-600 hover:bg-neza-blue-700"
              >
                Acceder al Panel
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="token" className="text-neza-blue-700">Token de Administrador</Label>
                <Input
                  id="token"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Ingresa el token de acceso"
                  className="border-neza-blue-200 focus:border-neza-blue-400"
                />
              </div>
              <Button 
                onClick={handleTokenLogin} 
                className="w-full bg-neza-blue-600 hover:bg-neza-blue-700"
              >
                Acceder con Token
              </Button>
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center text-xs text-neza-blue-500 space-y-1">
            <p>Demo credentials: admin@neza.com / neza2024admin</p>
            <p>Demo token: NEZA_ADMIN_2024_SECURE_TOKEN</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
