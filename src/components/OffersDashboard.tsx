import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trophy, TrendingUp, AlertTriangle, ExternalLink, RefreshCw, Clock, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateOffers } from "@/utils/offerGenerator";
import { userTrackingService } from "@/services/userTracking";

interface User {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  requestedAmount: number;
  productType: string;
  employmentType: string;
  hasOtherDebts: string;
  bankingRelationship: string;
  urgencyLevel: string;
  creditHistory: string;
  preferredBank: string;
}

interface OffersDashboardProps {
  user: User;
  onBack: () => void;
}

interface Offer {
  id: string;
  bankName: string;
  bankLogo: string;
  productName: string;
  productType: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  term: number;
  status: 'pre-approved' | 'approved' | 'auction';
  score: number;
  features: string[];
  requirements: string[];
  bankUrl: string;
  originalRate?: number;
  timeLeft?: number;
}

export const OffersDashboard = ({ user, onBack }: OffersDashboardProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductType, setSelectedProductType] = useState(user.productType);
  const [requestedAmount, setRequestedAmount] = useState(user.requestedAmount);
  const [countdownDays, setCountdownDays] = useState(7);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadOffers();
    userTrackingService.trackActivity('page_visit', { page: 'offers_dashboard' });

    // Countdown timer basado en urgencia
    const urgencyMap = {
      'inmediato': 3,
      'una-semana': 7,
      'un-mes': 30,
      'no-urgente': 90
    };
    setCountdownDays(urgencyMap[user.urgencyLevel as keyof typeof urgencyMap] || 7);

    // Auto-refresh auction offers every 30 seconds
    const interval = setInterval(() => {
      updateAuctionOffers();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedProductType, requestedAmount]);

  const loadOffers = async () => {
    setLoading(true);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedOffers = generateOffers({
      ...user,
      productType: selectedProductType,
      requestedAmount: requestedAmount
    });

    // Remove duplicate banks - keep only the best offer per bank
    const uniqueOffers = generatedOffers.reduce((acc: Offer[], current) => {
      const existingBank = acc.find(offer => offer.bankName === current.bankName);
      if (!existingBank || current.score > existingBank.score) {
        return [...acc.filter(offer => offer.bankName !== current.bankName), current];
      }
      return acc;
    }, []);

    setOffers(uniqueOffers);
    setLoading(false);
  };

  const updateAuctionOffers = () => {
    setOffers(prev => prev.map(offer => {
      if (offer.status === 'auction') {
        const reduction = Math.random() * 0.5 + 0.1; // 0.1% to 0.6% reduction
        const newRate = Math.max(offer.interestRate - reduction, 8.0); // Minimum 8%
        return {
          ...offer,
          originalRate: offer.originalRate || offer.interestRate,
          interestRate: Number(newRate.toFixed(2)),
          monthlyPayment: calculateMonthlyPayment(requestedAmount, newRate, offer.term),
          timeLeft: Math.floor(Math.random() * 3600) + 1800 // 30 min to 90 min
        };
      }
      return offer;
    }));
  };

  const calculateMonthlyPayment = (amount: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;
    return (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const handleBankRedirect = (bankUrl: string, bankName: string) => {
    userTrackingService.trackActivity('button_click', { 
      bankName,
      productType: selectedProductType,
      amount: requestedAmount
    });
    
    // Ensure we redirect to the actual bank URL, not NEZA
    if (bankUrl && !bankUrl.includes('neza') && !bankUrl.includes('localhost')) {
      window.open(bankUrl, '_blank');
    } else {
      // Fallback URLs for real banks
      const bankUrls: { [key: string]: string } = {
        'BCP': 'https://www.viabcp.com',
        'BBVA': 'https://www.bbva.pe',
        'Interbank': 'https://www.interbank.com.pe',
        'Scotiabank': 'https://www.scotiabank.com.pe',
        'BanBif': 'https://www.banbif.com.pe',
        'Pichincha': 'https://www.pichincha.pe'
      };
      window.open(bankUrls[bankName] || 'https://www.google.com/search?q=' + bankName + '+peru', '_blank');
    }
  };

  const getOffersByStatus = (status: string) => {
    return offers.filter(offer => offer.status === status);
  };

  const preApprovedOffers = getOffersByStatus('pre-approved');
  const approvedOffers = getOffersByStatus('approved');
  const auctionOffers = getOffersByStatus('auction');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-100">
        {/* MENSAJE PERMANENTE */}
        <div className="bg-neza-blue-600 text-white py-3 px-4 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
            <p className="text-center font-medium">
              Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neza-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-neza-blue-800 mb-2">
              Analizando ofertas personalizadas...
            </h2>
            <p className="text-neza-blue-600">
              Evaluando {selectedProductType} por S/. {requestedAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-100">
      {/* MENSAJE PERMANENTE */}
      <div className="bg-neza-blue-600 text-white py-3 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
          <p className="text-center font-medium">
            Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header with countdown and settings */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-neza-blue-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neza-blue-800">
                Ofertas Personalizadas para {user.firstName}
              </h1>
              <p className="text-neza-blue-600">
                {selectedProductType} • S/. {requestedAmount.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Countdown */}
            <div className="bg-neza-blue-100 border border-neza-blue-300 rounded-lg px-4 py-2 text-center">
              <div className="flex items-center gap-1 text-neza-blue-700">
                <Clock className="w-4 h-4" />
                <span className="font-bold text-lg">{countdownDays}</span>
              </div>
              <div className="text-xs text-neza-blue-600">días restantes</div>
            </div>

            {/* Quick Settings */}
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="border-neza-blue-300 text-neza-blue-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Ajustar
            </Button>
          </div>
        </div>

        {/* Quick adjustment settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-white/80 border-neza-blue-200">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800">Ajustes Rápidos</CardTitle>
                  <CardDescription>
                    Cambia el producto o monto sin volver a llenar el formulario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neza-blue-700 mb-2 block">
                        Tipo de Producto
                      </label>
                      <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                        <SelectTrigger className="border-neza-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credito-personal">Crédito Personal</SelectItem>
                          <SelectItem value="credito-vehicular">Crédito Vehicular</SelectItem>
                          <SelectItem value="credito-hipotecario">Crédito Hipotecario</SelectItem>
                          <SelectItem value="tarjeta-credito">Tarjeta de Crédito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-neza-blue-700 mb-2 block">
                        Monto Solicitado: S/. {requestedAmount.toLocaleString()}
                      </label>
                      <Slider
                        value={[requestedAmount]}
                        onValueChange={(value) => setRequestedAmount(value[0])}
                        max={500000}
                        min={1000}
                        step={1000}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={loadOffers}
                    className="bg-neza-blue-600 hover:bg-neza-blue-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar Ofertas
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/60 border-green-200">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">{approvedOffers.length}</div>
              <p className="text-sm text-green-700">Productos Aprobados</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 border-yellow-200">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">{preApprovedOffers.length}</div>
              <p className="text-sm text-yellow-700">Pre-aprobados</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 border-purple-200">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{auctionOffers.length}</div>
              <p className="text-sm text-purple-700">En Subasta Activa</p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Auction Section */}
        {auctionOffers.length > 0 && (
          <Card className="mb-6 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <Trophy className="w-5 h-5 mr-2" />
                🔥 Subasta Dinámica Activa
              </CardTitle>
              <CardDescription>
                Los bancos están compitiendo por tu solicitud. Las tasas mejoran automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auctionOffers.map((offer, index) => (
                  <motion.div 
                    key={offer.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${index === 0 ? 'border-yellow-400 bg-yellow-100' : 'border-neza-silver-200 bg-white'}
                    `}
                    animate={{ scale: index === 0 ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-600 mr-2" />}
                        <div>
                          <h3 className="font-semibold text-neza-blue-900">{offer.bankName}</h3>
                          <p className="text-sm text-neza-silver-600">{offer.productName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {offer.originalRate && (
                            <span className="text-sm line-through text-neza-silver-500">
                              {offer.originalRate}%
                            </span>
                          )}
                          <div className="text-lg font-bold text-green-600">
                            {offer.interestRate}% TEA
                          </div>
                        </div>
                        <div className="text-sm text-neza-silver-600">
                          S/. {offer.monthlyPayment.toLocaleString()}/mes
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neza-silver-600">
                        ⏱️ Expira en: {Math.floor((offer.timeLeft || 3600) / 60)} minutos
                      </div>
                      <Button 
                        onClick={() => handleBankRedirect(offer.bankUrl, offer.bankName)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ir al Banco
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approved Offers */}
        {approvedOffers.length > 0 && (
          <Card className="mb-6 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">
                ✅ Productos Aprobados ({approvedOffers.length} opciones disponibles)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {approvedOffers.map((offer) => (
                  <div key={offer.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-900">{offer.bankName}</h3>
                        <p className="text-sm text-green-700">{offer.productName}</p>
                        <div className="text-lg font-bold text-green-600 mt-1">
                          {offer.interestRate}% TEA • S/. {offer.monthlyPayment.toLocaleString()}/mes
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBankRedirect(offer.bankUrl, offer.bankName)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Solicitar en {offer.bankName}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pre-approved Offers */}
        {preApprovedOffers.length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">
                ⏳ Pre-aprobados ({preApprovedOffers.length} opciones disponibles)
              </CardTitle>
              <CardDescription>
                Estos productos requieren documentación adicional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {preApprovedOffers.map((offer) => (
                  <div key={offer.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-yellow-900">{offer.bankName}</h3>
                        <p className="text-sm text-yellow-700">{offer.productName}</p>
                        <div className="text-lg font-bold text-yellow-600 mt-1">
                          {offer.interestRate}% TEA • S/. {offer.monthlyPayment.toLocaleString()}/mes
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBankRedirect(offer.bankUrl, offer.bankName)}
                        variant="outline" 
                        className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Aplicar en {offer.bankName}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
