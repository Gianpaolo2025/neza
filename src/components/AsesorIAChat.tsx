
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Minimize2, Maximize2, MessageCircle, Sparkles, Clock, FileText, CreditCard, Home, Car, PiggyBank, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AsesorIAChatProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export const AsesorIAChat = ({ isVisible = false, onToggle }: AsesorIAChatProps) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy AsesorIA, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?\n\n📋 Puedo ayudarte con preguntas frecuentes sobre:\n• Requisitos\n• Procesos\n• Tiempo de aprobación\n• Subastas\n• Tipos de productos\n\n¿Sobre qué te gustaría conocer más?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Escuchar eventos de preguntas enviadas desde otras partes de la app
    const handleSendChatMessage = (event: CustomEvent) => {
      if (event.detail?.message) {
        setInputValue(event.detail.message);
        // Auto-enviar después de un pequeño delay
        setTimeout(() => {
          handleSendMessage(event.detail.message);
        }, 500);
      }
    };

    window.addEventListener('sendChatMessage', handleSendChatMessage as EventListener);
    return () => {
      window.removeEventListener('sendChatMessage', handleSendChatMessage as EventListener);
    };
  }, []);

  const frequentQuestions = [
    {
      category: "📋 Requisitos",
      icon: <FileText className="w-4 h-4" />,
      questions: [
        "¿Qué documentos necesito para solicitar un crédito personal?",
        "¿Cuáles son los requisitos mínimos de ingresos?",
        "¿Necesito garantías para un préstamo personal?"
      ]
    },
    {
      category: "⏱️ Procesos",
      icon: <Clock className="w-4 h-4" />,
      questions: [
        "¿Cómo funciona el proceso de subasta en NEZA?",
        "¿Cuántos pasos tiene el formulario de solicitud?",
        "¿Qué pasa después de completar mi solicitud?"
      ]
    },
    {
      category: "🕐 Tiempo de aprobación",
      icon: <TrendingUp className="w-4 h-4" />,
      questions: [
        "¿Cuánto tiempo demora la aprobación de un crédito?",
        "¿Cuándo recibiré las ofertas de los bancos?",
        "¿En cuánto tiempo puedo tener el dinero disponible?"
      ]
    },
    {
      category: "🏛️ Subastas",
      icon: <Sparkles className="w-4 h-4" />,
      questions: [
        "¿Cómo compiten los bancos por mi solicitud?",
        "¿Puedo ver las ofertas en tiempo real?",
        "¿Qué ventajas tiene el sistema de subasta?"
      ]
    },
    {
      category: "💰 Tipos de productos",
      icon: <CreditCard className="w-4 h-4" />,
      questions: [
        "¿Qué tipos de créditos están disponibles?",
        "¿Cuál es la diferencia entre crédito personal e hipotecario?",
        "¿Ofrecen tarjetas de crédito y cuentas de ahorro?"
      ]
    }
  ];

  const getAsesorIAResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respuestas para preguntas frecuentes por categoría
    
    // REQUISITOS
    if (lowerMessage.includes('documentos') || lowerMessage.includes('requisitos')) {
      return '📋 **Requisitos y Documentos:**\n\n**Documentos básicos:**\n✓ DNI vigente\n✓ Recibo de servicios (domicilio)\n✓ Últimas 3 boletas de pago\n✓ Declaración jurada de ingresos\n\n**Para independientes:**\n✓ RUC activo\n✓ Declaraciones de impuestos\n✓ Estados financieros\n\n**Requisitos generales:**\n• Ser mayor de 18 años\n• Tener ingresos demostrables\n• Residir en Perú\n• No estar en centrales de riesgo negativas\n\n¿Necesitas información específica sobre algún tipo de producto?';
    }

    if (lowerMessage.includes('ingresos mínimos') || lowerMessage.includes('cuánto ganar')) {
      return '💰 **Ingresos Mínimos por Producto:**\n\n• **Crédito Personal:** S/. 1,000 mensuales\n• **Tarjeta de Crédito:** S/. 1,500 mensuales\n• **Crédito Vehicular:** S/. 2,000 mensuales\n• **Crédito Hipotecario:** S/. 3,000 mensuales\n\n📈 **Importante:** Mayores ingresos = mejores condiciones\n\nEn NEZA, los bancos compiten por ofrecerte las mejores tasas según tu perfil. ¡Incluso con ingresos básicos puedes obtener buenas propuestas!\n\n¿Te gustaría simular qué productos puedes acceder con tus ingresos?';
    }

    if (lowerMessage.includes('garantías') || lowerMessage.includes('aval')) {
      return '🛡️ **Garantías y Avales:**\n\n**Créditos SIN garantía:**\n• Crédito personal hasta S/. 30,000\n• Tarjetas de crédito\n• Líneas de crédito personal\n\n**Créditos CON garantía:**\n• Crédito hipotecario (la casa es garantía)\n• Crédito vehicular (el auto es garantía)\n• Créditos empresariales grandes\n\n**¿Necesitas aval?**\n• Generalmente NO para créditos personales menores\n• SÍ para montos altos sin historial crediticio\n• Depende de tu perfil de riesgo\n\n¡En NEZA te mostramos todas las opciones disponibles para tu perfil!';
    }

    // PROCESOS
    if (lowerMessage.includes('cómo funciona') || lowerMessage.includes('proceso de subasta')) {
      return '🏛️ **¿Cómo funciona la Subasta en NEZA?**\n\n**Paso a paso:**\n1️⃣ Completas 8 preguntas sobre tu perfil\n2️⃣ Tu solicitud llega a múltiples bancos\n3️⃣ Los bancos analizan tu perfil automáticamente\n4️⃣ Compiten ofreciéndote sus mejores condiciones\n5️⃣ Recibes ofertas en tiempo real\n6️⃣ Comparas y eliges la mejor\n7️⃣ Contacto directo con el banco ganador\n\n**Ventajas:**\n✅ Transparencia total\n✅ Múltiples ofertas simultáneas\n✅ Tú tienes el control\n✅ Mejores condiciones por competencia\n\n¿Te gustaría conocer más detalles sobre algún paso?';
    }

    if (lowerMessage.includes('cuántos pasos') || lowerMessage.includes('formulario')) {
      return '📝 **Formulario de NEZA - 8 Preguntas:**\n\n**Las preguntas son sobre:**\n1. Datos personales básicos\n2. Tipo de producto que buscas\n3. Monto deseado\n4. Ingresos mensuales\n5. Gastos mensuales\n6. Experiencia crediticia\n7. Destino del crédito\n8. Preferencias de plazo\n\n**Tiempo estimado:** 5-8 minutos\n**Tip:** Sé honesto en tus respuestas para obtener mejores ofertas\n\n⚠️ **Importante:** La información falsa reduce tus posibilidades de aprobación.\n\n¿Listo para comenzar tu solicitud?';
    }

    if (lowerMessage.includes('después de completar') || lowerMessage.includes('qué sigue')) {
      return '🔄 **¿Qué pasa después de tu solicitud?**\n\n**Inmediatamente:**\n• Tu perfil se envía a bancos participantes\n• Inicia el proceso de evaluación automática\n• Recibes confirmación de solicitud recibida\n\n**Primeras 2 horas:**\n• Los bancos analizan tu perfil\n• Comienzan a llegar las primeras ofertas\n• Puedes ver el progreso en tiempo real\n\n**Siguientes 24-48 horas:**\n• Ofertas completas de todos los bancos\n• Comparación detallada disponible\n• Recomendaciones personalizadas\n\n**Tu decides:**\n• Eliges la mejor oferta\n• Contacto directo con el banco\n• Continúas el proceso de formalización\n\n¿Te gustaría comenzar ahora?';
    }

    // TIEMPO DE APROBACIÓN
    if (lowerMessage.includes('cuánto tiempo') || lowerMessage.includes('demora') || lowerMessage.includes('aprobación')) {
      return '⏱️ **Tiempos de Aprobación:**\n\n**En NEZA (Pre-aprobación):**\n• Ofertas iniciales: 2-6 horas\n• Ofertas completas: 24-48 horas\n• Comparación: Inmediata\n\n**Aprobación final por banco:**\n• Tarjetas de crédito: 1-3 días\n• Crédito personal: 3-7 días\n• Crédito vehicular: 5-10 días\n• Crédito hipotecario: 15-30 días\n\n**Desembolso del dinero:**\n• Transferencia: 24-48 horas\n• Efectivo: 24-72 horas\n\n💡 **Para acelerar:** Ten listos todos los documentos desde el inicio.\n\n¿Necesitas el dinero con urgencia? Te ayudo a identificar las opciones más rápidas.';
    }

    if (lowerMessage.includes('ofertas') && (lowerMessage.includes('cuándo') || lowerMessage.includes('recibir'))) {
      return '📬 **¿Cuándo llegan las ofertas?**\n\n**Timeline detallado:**\n\n🕐 **0-2 horas:**\n• Primeras pre-ofertas básicas\n• Indicadores de interés de bancos\n\n🕕 **2-6 horas:**\n• Ofertas preliminares con tasas aproximadas\n• Montos pre-aprobados\n\n📅 **24 horas:**\n• Ofertas formales completas\n• Tasas definitivas\n• Condiciones específicas\n\n📈 **48 horas:**\n• Últimas ofertas de bancos más rigurosos\n• Ofertas especiales o promocionales\n\n**¡Importante!** Recibes notificaciones en tiempo real de cada nueva oferta.\n\n¿Te gustaría activar las notificaciones para no perderte ninguna oportunidad?';
    }

    if (lowerMessage.includes('dinero disponible') || lowerMessage.includes('cuándo tengo')) {
      return '💳 **¿Cuándo tendrás el dinero?**\n\n**Después de elegir tu oferta:**\n\n📋 **Documentación:** 1-2 días\n• Firmar contratos\n• Verificación final de documentos\n• Confirmación de datos\n\n✅ **Aprobación final:** 1-5 días\n• Validación interna del banco\n• Verificación de referencias\n• Aprobación de comité (si aplica)\n\n💰 **Desembolso:**\n• Cuenta bancaria: 24 horas\n• Efectivo en agencia: 48 horas\n• Cheque: 72 horas\n\n**Total estimado:** 3-10 días desde que eliges tu oferta\n\n⚡ **Tip:** Los bancos digitales suelen ser más rápidos.\n\n¿Prefieres rapidez o mejores condiciones?';
    }

    // SUBASTAS
    if (lowerMessage.includes('cómo compiten') || lowerMessage.includes('bancos compiten')) {
      return '🏛️ **¿Cómo compiten los bancos por ti?**\n\n**El proceso de competencia:**\n\n🎯 **Análisis automático:**\n• Cada banco evalúa tu perfil independientemente\n• Algoritmos determinan tu nivel de riesgo\n• Se calcula la mejor oferta posible\n\n💡 **Estrategias de competencia:**\n• Tasas más bajas para atraerte\n• Beneficios adicionales exclusivos\n• Plazos más flexibles\n• Menores comisiones\n\n📊 **En tiempo real:**\n• Los bancos ven si hay competencia\n• Pueden mejorar sus ofertas automáticamente\n• Tú ves todas las propuestas actualizándose\n\n🏆 **Resultado:** ¡Las mejores condiciones del mercado para tu perfil!\n\n¿Te parece interesante este sistema? ¿Quieres ver cómo funciona con tu perfil?';
    }

    if (lowerMessage.includes('tiempo real') || lowerMessage.includes('ver ofertas')) {
      return '👀 **Ofertas en Tiempo Real:**\n\n**Qué puedes ver:**\n📈 Dashboard actualizado cada minuto\n📊 Comparación automática de ofertas\n🎯 Ranking de mejores propuestas\n⚡ Notificaciones de nuevas ofertas\n\n**Información detallada:**\n• Tasa de interés (TEA)\n• Monto aprobado\n• Plazo disponible\n• Cuota mensual\n• Costos adicionales\n• Beneficios incluidos\n\n**Funciones interactivas:**\n✅ Filtrar por preferencias\n✅ Ordenar por conveniencia\n✅ Simular diferentes escenarios\n✅ Guardar ofertas favoritas\n\n**Transparencia total:** Sabes exactamente quién te ofrece qué y por qué.\n\n¿Te gustaría ver una demo del dashboard?';
    }

    if (lowerMessage.includes('ventajas') && lowerMessage.includes('subasta')) {
      return '🎯 **Ventajas del Sistema de Subasta:**\n\n**Para ti como cliente:**\n✅ **Mejores condiciones:** Los bancos compiten = mejores tasas\n✅ **Ahorro de tiempo:** Una solicitud = múltiples ofertas\n✅ **Transparencia:** Ves todas las opciones claramente\n✅ **Poder de decisión:** Tú eliges, no te venden\n✅ **Sin compromiso:** Puedes rechazar todas las ofertas\n\n**Vs. método tradicional:**\n❌ Tradicional: Visitas banco por banco\n✅ NEZA: Todos los bancos vienen a ti\n\n❌ Tradicional: Ofertas sesgadas\n✅ NEZA: Ofertas competitivas reales\n\n❌ Tradicional: Proceso lento y tedioso\n✅ NEZA: Rápido y eficiente\n\n¿Quieres experimentar estas ventajas? ¡Inicia tu solicitud!';
    }

    // TIPOS DE PRODUCTOS
    if (lowerMessage.includes('tipos de créditos') || lowerMessage.includes('productos disponibles')) {
      return '💰 **Productos Financieros Disponibles:**\n\n**💳 CRÉDITOS:**\n• Personal: S/. 1,000 - S/. 50,000\n• Hipotecario: S/. 50,000 - S/. 500,000\n• Vehicular: S/. 10,000 - S/. 150,000\n• Empresarial: S/. 5,000 - S/. 200,000\n\n**💳 TARJETAS:**\n• Clásica, Gold, Platinum\n• Líneas desde S/. 500 hasta S/. 50,000\n\n**🏦 AHORROS E INVERSIONES:**\n• Cuentas de ahorro\n• Depósitos a plazo\n• Fondos mutuos\n\n**🛡️ SEGUROS:**\n• Vida, vehicular, hogar\n• SOAT, salud\n\n¿Qué tipo de producto te interesa más? Te doy información detallada.';
    }

    if (lowerMessage.includes('diferencia') && (lowerMessage.includes('personal') || lowerMessage.includes('hipotecario'))) {
      return '🏠 **Crédito Personal vs Hipotecario:**\n\n**💰 CRÉDITO PERSONAL:**\n• Monto: S/. 1,000 - S/. 50,000\n• Plazo: 6 meses - 5 años\n• Tasa: 18% - 45% anual\n• Sin garantía inmobiliaria\n• Uso libre del dinero\n• Aprobación: 3-7 días\n\n**🏠 CRÉDITO HIPOTECARIO:**\n• Monto: S/. 50,000 - S/. 500,000+\n• Plazo: 5 - 30 años\n• Tasa: 8% - 12% anual\n• Garantía: La propiedad\n• Solo para compra/construcción de vivienda\n• Aprobación: 15-30 días\n\n**¿Cuál elegir?**\n• Personal: Para gastos diversos, montos menores\n• Hipotecario: Para vivienda, montos grandes, mejores tasas\n\n¿Qué tipo de necesidad tienes?';
    }

    if (lowerMessage.includes('tarjetas') && lowerMessage.includes('cuentas')) {
      return '💳 **Tarjetas y Cuentas Disponibles:**\n\n**🔥 TARJETAS DE CRÉDITO:**\n• **Clásica:** Línea S/. 500 - S/. 5,000\n• **Gold:** Línea S/. 2,000 - S/. 20,000\n• **Platinum:** Línea S/. 10,000 - S/. 50,000\n\n**Beneficios incluidos:**\n✅ Cashback hasta 5%\n✅ Millas acumulables\n✅ Seguros incluidos\n✅ Promociones exclusivas\n\n**🏦 CUENTAS DE AHORRO:**\n• Saldo mínimo: S/. 0\n• Rentabilidad: Hasta 4% anual\n• Tarjeta débito gratuita\n• Transferencias sin costo\n• Banca por internet 24/7\n\n**¡En NEZA!** Los bancos compiten por darte las mejores condiciones en todos estos productos.\n\n¿Qué producto te interesa solicitar primero?';
    }

    // Respuestas generales y ayuda
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('opciones') || lowerMessage.includes('qué puedes hacer')) {
      return '🤝 **¿En qué puedo ayudarte?**\n\nPuedo resolver tus dudas sobre:\n\n📋 **Requisitos:** Documentos, ingresos, garantías\n⏱️ **Procesos:** Cómo funciona NEZA, pasos a seguir\n🕐 **Tiempos:** Cuándo recibes ofertas, aprobaciones\n🏛️ **Subastas:** Cómo compiten los bancos\n💰 **Productos:** Tipos, características, diferencias\n\n**Ejemplos de preguntas:**\n• "¿Qué documentos necesito?"\n• "¿Cuánto tiempo demora la aprobación?"\n• "¿Cómo funciona la subasta?"\n• "¿Qué productos ofrecen?"\n\n¡También puedo ayudarte a decidir qué producto es mejor para tu situación!\n\n¿Sobre qué tema te gustaría conocer más?';
    }

    // Respuesta por defecto con categorías
    return '🤖 **Entiendo que tienes una consulta financiera.**\n\nPara darte la mejor respuesta, ¿podrías ser más específico sobre qué necesitas saber?\n\n**Categorías disponibles:**\n📋 Requisitos y documentos\n⏱️ Procesos y pasos\n🕐 Tiempos de aprobación\n🏛️ Sistema de subastas\n💰 Tipos de productos\n\n**O prueba preguntas como:**\n• "¿Qué necesito para un crédito personal?"\n• "¿Cómo funciona el proceso?"\n• "¿Cuánto tiempo demora?"\n• "¿Qué productos tienen?"\n\n¡Estoy aquí para ayudarte! 😊';
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputValue('');
    setIsTyping(true);

    // Simular tiempo de respuesta de IA
    setTimeout(() => {
      const response = getAsesorIAResponse(textToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    onToggle?.();
  };

  // Ícono flotante cuando está cerrado
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-neza-blue-600 to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-neza-blue-200"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="relative"
          >
            <img 
              src="/lovable-uploads/2864c04b-4f0a-4e08-abf7-4cd14e81deeb.png" 
              alt="AsesorIA" 
              className="w-7 h-7 object-contain rounded-full"
            />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"
            />
          </motion.div>
        </Button>
      </motion.div>
    );
  }

  // Ventana de chat minimizada
  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Card className="w-80 bg-gradient-to-r from-neza-blue-50 to-slate-50 border-neza-blue-200 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/2864c04b-4f0a-4e08-abf7-4cd14e81deeb.png" 
                    alt="AsesorIA" 
                    className="w-10 h-10 object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-neza-blue-800">AsesorIA</h3>
                  <p className="text-xs text-slate-600">Tu asesora financiera IA</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="text-neza-blue-600 hover:text-neza-blue-700 hover:bg-neza-blue-100"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-neza-blue-600 hover:text-neza-blue-700 hover:bg-neza-blue-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Ventana de chat completa
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="w-96 h-[600px] bg-white border-neza-blue-200 shadow-2xl flex flex-col">
        {/* Header del chat */}
        <div className="bg-gradient-to-r from-neza-blue-600 to-slate-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/lovable-uploads/2864c04b-4f0a-4e08-abf7-4cd14e81deeb.png" 
                  alt="AsesorIA" 
                  className="w-12 h-12 object-contain"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AsesorIA</h3>
                <div className="flex items-center gap-2 text-neza-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">En línea • Preguntas frecuentes</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preguntas frecuentes por categorías */}
        {messages.length === 1 && (
          <div className="p-4 border-b border-slate-200 bg-neza-blue-50">
            <h4 className="font-semibold text-neza-blue-800 mb-3">Preguntas Frecuentes:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {frequentQuestions.map((category, index) => (
                <details key={index} className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neza-blue-700 hover:text-neza-blue-800">
                    {category.icon}
                    {category.category}
                  </summary>
                  <div className="mt-2 ml-6 space-y-1">
                    {category.questions.map((question, qIndex) => (
                      <button
                        key={qIndex}
                        onClick={() => handleQuestionClick(question)}
                        className="block text-xs text-slate-600 hover:text-neza-blue-600 text-left hover:underline"
                      >
                        • {question}
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Área de mensajes */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[85%] p-3 rounded-lg text-sm
                  ${message.isUser 
                    ? 'bg-neza-blue-500 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }
                `}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-neza-blue-100' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString('es-PE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* Indicador de escritura */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 p-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <motion.div 
                        className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-slate-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input de mensaje */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregúntame sobre productos financieros..."
              className="flex-1 border-neza-blue-200 focus:border-neza-blue-400"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            🤖 AsesorIA - Respuestas instantáneas a tus preguntas financieras
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
