
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  DollarSign, 
  Target, 
  Star, 
  TrendingUp, 
  Shield,
  Award,
  Sparkles
} from "lucide-react";

interface OnboardingData {
  personalData: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
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
    riskProfile: string;
    wantsAdvice: boolean;
    financialGoals: string[];
    preferredContact: string;
  };
}

interface ProfileSummaryProps {
  data: OnboardingData;
  onBack: () => void;
  onFinish: () => void;
}

export const ProfileSummary = ({ data, onBack, onFinish }: ProfileSummaryProps) => {
  const calculateScore = () => {
    let score = 60; // Base score
    
    if (data.financialInfo.monthlyIncome >= 3000) score += 15;
    else if (data.financialInfo.monthlyIncome >= 1500) score += 10;
    
    if (data.financialInfo.workTime >= 24) score += 10;
    else if (data.financialInfo.workTime >= 12) score += 5;
    
    if (data.clientProfile.hasPreviousCredit) score += 10;
    if (data.clientProfile.riskProfile === 'conservative') score += 5;
    else if (data.clientProfile.riskProfile === 'moderate') score += 8;
    
    score += data.clientProfile.financialGoals.length * 2;
    
    return Math.min(score, 100);
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Excelente', color: 'from-green-500 to-emerald-600', icon: Award };
    if (score >= 80) return { level: 'Muy Bueno', color: 'from-blue-500 to-cyan-600', icon: Star };
    if (score >= 70) return { level: 'Bueno', color: 'from-purple-500 to-pink-600', icon: TrendingUp };
    if (score >= 60) return { level: 'Regular', color: 'from-yellow-500 to-orange-600', icon: Shield };
    return { level: 'Básico', color: 'from-gray-500 to-gray-600', icon: User };
  };

  const score = calculateScore();
  const scoreData = getScoreLevel(score);
  const ScoreIcon = scoreData.icon;

  const creditTypeNames: { [key: string]: string } = {
    'personal': 'Préstamo Personal',
    'vehicular': 'Crédito Vehicular',
    'hipotecario': 'Crédito Hipotecario',
    'educativo': 'Crédito Educativo'
  };

  const riskProfileNames: { [key: string]: string } = {
    'conservative': 'Conservador',
    'moderate': 'Moderado',
    'aggressive': 'Arriesgado'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ¡Perfil completado!
          </h1>
          <p className="text-xl text-gray-600">
            Hola {data.personalData.firstName}, tu perfil financiero está listo
          </p>
        </motion.div>

        {/* Score principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div className={`w-24 h-24 bg-gradient-to-r ${scoreData.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <ScoreIcon className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Perfil {scoreData.level}
              </h2>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-4xl font-bold text-emerald-600">
                  {score}
                </div>
                <div className="text-gray-500">
                  <div className="text-sm">Puntuación</div>
                  <div className="text-xs">de 100</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-4 bg-gradient-to-r ${scoreData.color} rounded-full flex items-center justify-end pr-2`}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              </div>
              
              <p className="text-gray-600">
                Tienes un perfil {scoreData.level.toLowerCase()} para acceder a productos financieros
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumen detallado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Información personal */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Información Personal
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">{data.personalData.firstName} {data.personalData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DNI:</span>
                  <span className="font-medium">{data.personalData.dni}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{data.personalData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Celular:</span>
                  <span className="font-medium">{data.personalData.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información financiera */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Información Financiera
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de crédito:</span>
                  <span className="font-medium">{creditTypeNames[data.financialInfo.creditType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto solicitado:</span>
                  <span className="font-medium">S/ {data.financialInfo.requestedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos mensuales:</span>
                  <span className="font-medium">S/ {data.financialInfo.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ocupación:</span>
                  <span className="font-medium">{data.financialInfo.occupation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experiencia laboral:</span>
                  <span className="font-medium">{data.financialInfo.workTime} meses</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Perfil del cliente */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Perfil del Cliente
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experiencia crediticia:</span>
                  <span className="font-medium">
                    {data.clientProfile.hasPreviousCredit ? 'Con experiencia' : 'Primera vez'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perfil de riesgo:</span>
                  <span className="font-medium capitalize">
                    {riskProfileNames[data.clientProfile.riskProfile]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objetivos financieros:</span>
                  <span className="font-medium">{data.clientProfile.financialGoals.length} seleccionados</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Asesoría financiera:</span>
                  <span className="font-medium">
                    {data.clientProfile.wantsAdvice ? 'Sí, me interesa' : 'No necesito'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contacto preferido:</span>
                  <span className="font-medium capitalize">{data.clientProfile.preferredContact}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos pasos */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Próximos Pasos
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <span>Analizaremos tu perfil con entidades supervisadas por la SBS</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <span>Te mostraremos las mejores opciones disponibles para ti</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <span>Podrás comparar ofertas y elegir la que más te convenga</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <Button variant="outline" onClick={onBack} className="flex-1">
            Modificar datos
          </Button>
          <Button onClick={onFinish} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            ¡Buscar mis opciones! 🚀
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
