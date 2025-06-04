
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, CreditCard, Target, CheckCircle, Sparkles, Brain } from "lucide-react";

interface OnboardingData {
  personalData: {
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    email: string;
    phone: string;
    isValidated: boolean;
    otpVerified: boolean;
  };
  financialInfo: {
    creditType: string;
    requestedAmount: number;
    monthlyIncome: number;
    occupation: string;
    workTime: number;
  };
  clientProfile: {
    hasPreviousCredit: boolean;
    hasFixedIncome: boolean;
    workType: string;
    incomeRange: string;
    creditPurpose: string;
    financialGoals: string[];
    financialKnowledge: string;
    preferredContact: string;
  };
}

interface ProfileSummaryProps {
  data: OnboardingData;
  onBack: () => void;
  onFinish: () => void;
}

export const ProfileSummary = ({ data, onBack, onFinish }: ProfileSummaryProps) => {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getProfileType = () => {
    let score = 0;
    
    // Factores de puntuación
    if (data.clientProfile.hasPreviousCredit) score += 15;
    if (data.clientProfile.hasFixedIncome) score += 20;
    if (data.clientProfile.workType === 'formal') score += 20;
    if (data.clientProfile.incomeRange === 'high') score += 25;
    if (data.financialInfo.monthlyIncome >= 3000) score += 15;
    if (data.financialInfo.workTime >= 24) score += 15;
    
    if (score >= 80) return { 
      type: 'Perfil Premium', 
      emoji: '👑', 
      color: 'from-yellow-500 to-amber-600',
      description: 'Excelente perfil crediticio'
    };
    if (score >= 60) return { 
      type: 'Perfil Sólido', 
      emoji: '⭐', 
      color: 'from-emerald-500 to-green-600',
      description: 'Buen perfil financiero'
    };
    if (score >= 40) return { 
      type: 'Perfil en Desarrollo', 
      emoji: '🌱', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Perfil con potencial'
    };
    return { 
      type: 'Perfil Inicial', 
      emoji: '🚀', 
      color: 'from-purple-500 to-pink-600',
      description: 'Ideal para comenzar'
    };
  };

  const getCreditTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      'personal': 'Préstamo Personal',
      'vehicular': 'Crédito Vehicular',
      'hipotecario': 'Crédito Hipotecario',
      'educativo': 'Crédito Educativo'
    };
    return types[type] || type;
  };

  const profile = getProfileType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-emerald-800">NEZA</h1>
            <p className="text-emerald-600">Tu perfil está completo</p>
          </div>
          
          <div></div>
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r ${profile.color} text-white shadow-lg mb-6`}>
            <span className="text-3xl">{profile.emoji}</span>
            <span className="font-bold text-2xl">{profile.type}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            ¡Perfecto, {data.personalData.firstName}!
          </h2>
          <p className="text-xl text-gray-600">
            Tu información está completa. Ahora activaremos nuestro sistema inteligente "Asesoría" 
            para encontrar las mejores opciones financieras para ti.
          </p>
        </motion.div>

        {/* Resumen en tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Datos Personales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">Datos Personales</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <div className="text-gray-600">{data.personalData.firstName} {data.personalData.lastName}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">DNI:</span>
                    <div className="text-gray-600 flex items-center gap-2">
                      {data.personalData.dni}
                      {data.personalData.isValidated && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Edad:</span>
                    <div className="text-gray-600">{calculateAge(data.personalData.birthDate)} años</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Celular:</span>
                    <div className="text-gray-600 flex items-center gap-2">
                      {data.personalData.phone}
                      {data.personalData.otpVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información Financiera */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-lg">Información Financiera</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Producto deseado:</span>
                    <div className="text-gray-600">{getCreditTypeName(data.financialInfo.creditType)}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Monto solicitado:</span>
                    <div className="text-gray-600">S/ {data.financialInfo.requestedAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ingresos mensuales:</span>
                    <div className="text-gray-600">S/ {data.financialInfo.monthlyIncome.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ocupación:</span>
                    <div className="text-gray-600">{data.financialInfo.occupation}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Experiencia laboral:</span>
                    <div className="text-gray-600">{data.financialInfo.workTime} meses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Perfil del Cliente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg">Perfil del Cliente</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Experiencia crediticia:</span>
                    <div className="text-gray-600">
                      {data.clientProfile.hasPreviousCredit ? 'Sí, he tenido créditos' : 'Primera experiencia'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo de trabajo:</span>
                    <div className="text-gray-600 capitalize">{data.clientProfile.workType}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Propósito:</span>
                    <div className="text-gray-600 capitalize">{data.clientProfile.creditPurpose}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Objetivos financieros:</span>
                    <div className="text-gray-600">{data.clientProfile.financialGoals.length} seleccionados</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Conocimiento financiero:</span>
                    <div className="text-gray-600 capitalize">{data.clientProfile.financialKnowledge}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Siguiente paso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-800">¿Qué sigue ahora?</h3>
                <Sparkles className="w-8 h-8 text-emerald-600" />
              </div>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nuestro sistema inteligente <strong>"Asesoría"</strong> analizará tu perfil y lo comparará 
                con las ofertas de más de 50 entidades financieras reguladas por la SBS. En segundos 
                tendrás las mejores opciones personalizadas para ti.
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Análisis automático</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Entidades reguladas</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Mejores condiciones</span>
                </div>
              </div>
              
              <Button 
                onClick={onFinish}
                className="bg-emerald-600 hover:bg-emerald-700 text-xl py-6 px-12 shadow-lg"
              >
                <Brain className="w-6 h-6 mr-3" />
                ¡Activar Asesoría IA! 🚀
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
