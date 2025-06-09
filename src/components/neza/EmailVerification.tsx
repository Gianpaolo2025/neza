
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export const EmailVerification = ({ email, onVerified, onBack }: EmailVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendVerificationCode = async () => {
    setIsSending(true);
    setError("");
    setSuccess("");

    try {
      // Enviar código de verificación usando Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        setError("Error al enviar el código. Verifica tu email e intenta de nuevo.");
        console.error("Error sending OTP:", error);
      } else {
        setIsCodeSent(true);
        setSuccess("Código enviado exitosamente. Revisa tu correo electrónico.");
      }
    } catch (error) {
      setError("Error al enviar el código de verificación, intenta de nuevo");
      console.error("Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Por favor ingresa un código de 6 dígitos");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Verificar el código OTP
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: verificationCode,
        type: 'email'
      });

      if (error) {
        setError("Código incorrecto o expirado. Intenta de nuevo.");
        console.error("Error verifying OTP:", error);
      } else {
        setSuccess("Email verificado exitosamente!");
        setTimeout(() => {
          onVerified();
        }, 1000);
      }
    } catch (error) {
      setError("Error al verificar el código");
      console.error("Error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-blue-200 bg-white/80">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-blue-800">
            Verificación de Email
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Verificaremos tu email: <strong>{email}</strong>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isCodeSent ? (
            <>
              <p className="text-center text-gray-700 text-sm">
                Te enviaremos un código de verificación de 6 dígitos
              </p>
              <Button
                onClick={sendVerificationCode}
                disabled={isSending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar código"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-center text-gray-700 text-sm">
                  Ingresa el código de 6 dígitos que enviamos a tu email
                </p>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-wider"
                  autoFocus
                />
                <Button
                  onClick={verifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Verificar
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={sendVerificationCode}
                  disabled={isSending}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {isSending ? "Enviando..." : "Reenviar código"}
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <Button
            variant="outline"
            onClick={onBack}
            className="w-full border-gray-300 text-gray-700"
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
