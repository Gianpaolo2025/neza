
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Minimize2, Maximize2, MessageCircle, Sparkles } from "lucide-react";

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
      text: '¡Hola! Soy AsesorIA, tu asistente financiero personal. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre productos financieros, tasas de interés, requisitos y mucho más.\n\n⚠️ Nota: Soy una herramienta informativa y no reemplazo el consejo financiero profesional.',
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

  const getAsesorIAResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Seguridad: No permitir consultas sobre datos sensibles
    if (lowerMessage.includes('contraseña') || lowerMessage.includes('password') || 
        lowerMessage.includes('clave') || lowerMessage.includes('pin') || 
        lowerMessage.includes('cuenta bancaria') || lowerMessage.includes('número de cuenta')) {
      return '🚫 Por seguridad, no puedo ayudarte con información sensible como contraseñas o números de cuenta. Te recomiendo contactar directamente con tu entidad financiera para estos temas.';
    }

    // Consultas sobre NEZA y subasta financiera
    if (lowerMessage.includes('neza') || lowerMessage.includes('subasta financiera') || lowerMessage.includes('cómo funciona')) {
      return '🏛️ **¿Qué es NEZA?**\n\nNEZA es un sistema de subasta financiera donde los bancos y entidades reguladas por la SBS compiten para ofrecerte las mejores condiciones.\n\n**¿Cómo funciona?**\n1. Completas un formulario de 8 preguntas\n2. Las entidades financieras reciben tu perfil\n3. Compiten automáticamente para darte la mejor oferta\n4. Tú eliges la propuesta ganadora\n\n✅ Es 100% transparente y seguro.';
    }

    // Consultas sobre productos financieros específicos
    if (lowerMessage.includes('crédito personal') || lowerMessage.includes('préstamo personal')) {
      return '💰 **Crédito Personal**\n\n• **Monto:** S/. 1,000 - S/. 50,000\n• **Plazo:** 6 meses a 5 años\n• **Tasa:** Desde 18% anual\n• **Uso:** Gastos personales, emergencias, proyectos\n\n**Requisitos básicos:**\n✓ DNI vigente\n✓ Ingresos demostrables\n✓ Historial crediticio\n\n¿Te interesa conocer más detalles?';
    }

    if (lowerMessage.includes('crédito hipotecario') || lowerMessage.includes('casa') || lowerMessage.includes('vivienda')) {
      return '🏠 **Crédito Hipotecario**\n\n• **Monto:** S/. 50,000 - S/. 500,000\n• **Plazo:** 5 a 30 años\n• **Financiamiento:** Hasta 90% del valor\n• **Tasa:** Desde 8.5% anual\n\n**Requisitos:**\n✓ Cuota inicial (mínimo 10%)\n✓ Ingresos estables\n✓ Evaluación de la propiedad\n✓ Seguro de desgravamen\n\n¿Necesitas más información sobre algún aspecto?';
    }

    if (lowerMessage.includes('crédito vehicular') || lowerMessage.includes('auto') || lowerMessage.includes('vehículo')) {
      return '🚗 **Crédito Vehicular**\n\n• **Monto:** S/. 10,000 - S/. 150,000\n• **Plazo:** 2 a 7 años\n• **Tasa:** Desde 12% anual\n• **Tipo:** Vehículos nuevos y usados\n\n**Beneficios:**\n✓ Financiamiento hasta 80% del valor\n✓ Seguro vehicular incluido\n✓ Trámites simplificados\n\n¿Qué tipo de vehículo te interesa?';
    }

    if (lowerMessage.includes('tarjeta de crédito') || lowerMessage.includes('tarjeta')) {
      return '💳 **Tarjeta de Crédito**\n\n• **Línea:** S/. 500 - S/. 50,000\n• **Tasa:** Desde 35% anual\n• **Beneficios:** Cashback, puntos, promociones\n\n**Tipos disponibles:**\n✓ Clásica\n✓ Gold\n✓ Platinum\n✓ Corporativa\n\n**Requisitos:**\n• Ingresos mínimos S/. 1,500\n• Historial crediticio positivo\n\n¿Te interesa algún tipo específico?';
    }

    if (lowerMessage.includes('cuenta de ahorros') || lowerMessage.includes('ahorros')) {
      return '🏦 **Cuenta de Ahorros**\n\n• **Saldo mínimo:** S/. 0\n• **Rentabilidad:** Hasta 4% anual\n• **Mantenimiento:** Generalmente gratuito\n\n**Beneficios:**\n✓ Acceso 24/7 a cajeros\n✓ Banca por internet\n✓ Tarjeta de débito gratuita\n✓ Transferencias sin costo\n\n¿Quieres conocer las mejores opciones del mercado?';
    }

    if (lowerMessage.includes('depósito a plazo') || lowerMessage.includes('plazo fijo')) {
      return '📈 **Depósito a Plazo**\n\n• **Monto mínimo:** S/. 1,000\n• **Plazo:** 30 días a 5 años\n• **Tasa:** Hasta 6% anual\n• **Renovación:** Automática u opcional\n\n**Ventajas:**\n✓ Tasa fija garantizada\n✓ Mayor rentabilidad que ahorros\n✓ Seguridad del capital\n\n¿Qué plazo te interesa más?';
    }

    // Consultas sobre tasas e intereses
    if (lowerMessage.includes('tasa') || lowerMessage.includes('interés') || lowerMessage.includes('cuánto cuesta')) {
      return '📊 **Tasas de Interés Aproximadas:**\n\n• **Crédito Personal:** 18% - 45% anual\n• **Crédito Hipotecario:** 8.5% - 12% anual\n• **Crédito Vehicular:** 12% - 18% anual\n• **Tarjeta de Crédito:** 35% - 80% anual\n• **Depósito a Plazo:** 2% - 6% anual\n\n*Las tasas varían según tu perfil crediticio y la entidad financiera.*\n\n¿Te interesa algún producto específico?';
    }

    // Consultas sobre requisitos
    if (lowerMessage.includes('requisitos') || lowerMessage.includes('documentos') || lowerMessage.includes('qué necesito')) {
      return '📋 **Requisitos Generales:**\n\n**Documentos básicos:**\n✓ DNI vigente\n✓ Recibo de servicios (domicilio)\n✓ Últimas 3 boletas de pago\n✓ Declaración jurada de ingresos\n\n**Para independientes:**\n✓ RUC activo\n✓ Declaraciones de impuestos\n✓ Estados financieros\n\n**Adicionales según producto:**\n• Garantías (hipotecario/vehicular)\n• Referencias comerciales/personales\n\n¿Para qué producto necesitas los requisitos específicos?';
    }

    // Consultas sobre ingresos específicos
    if (lowerMessage.includes('gano') || lowerMessage.includes('ingreso') || lowerMessage.includes('sueldo')) {
      const salaryMatch = userMessage.match(/(\d+)/);
      if (salaryMatch) {
        const salary = parseInt(salaryMatch[1]);
        let response = `💼 **Con ingresos de S/. ${salary.toLocaleString()}:**\n\n`;
        
        if (salary >= 5000) {
          response += '✅ **Puedes acceder a:**\n• Créditos hipotecarios\n• Créditos vehiculares\n• Tarjetas premium\n• Depósitos a plazo altos\n• Seguros completos';
        } else if (salary >= 2000) {
          response += '✅ **Puedes acceder a:**\n• Créditos personales\n• Tarjetas de crédito básicas\n• Créditos vehiculares (usados)\n• Cuentas de ahorros con beneficios';
        } else if (salary >= 1000) {
          response += '✅ **Puedes acceder a:**\n• Créditos personales menores\n• Cuentas de ahorros\n• Tarjetas de débito\n• Micro créditos';
        } else {
          response += '📝 **Recomendaciones:**\n• Enfócate en productos de ahorro\n• Considera micro créditos\n• Trabaja en mejorar tu perfil crediticio';
        }
        
        response += '\n\n💡 En NEZA, las entidades compiten por darte la mejor oferta según tu perfil. ¡Solicita y compara!';
        return response;
      }
    }

    // Consultas sobre seguros
    if (lowerMessage.includes('seguro')) {
      return '🛡️ **Seguros Disponibles:**\n\n**Seguro de Vida:**\n• Cobertura: S/. 50,000 - S/. 1,000,000\n• Prima mensual desde S/. 50\n\n**Seguro Vehicular:**\n• Todo riesgo o contra terceros\n• Prima anual: 2-4% del valor del vehículo\n\n**Seguro SOAT:**\n• Obligatorio para todos los vehículos\n• Cobertura básica por accidentes\n\n**Seguro del Hogar:**\n• Protección contra incendio, robo, sismos\n• Prima anual desde S/. 200\n\n¿Te interesa algún tipo específico?';
    }

    // Consultas sobre comparación
    if (lowerMessage.includes('mejor') || lowerMessage.includes('comparar') || lowerMessage.includes('recomienda')) {
      return '🏆 **Para elegir la mejor opción:**\n\n**Compara siempre:**\n✓ Tasa de interés efectiva anual (TEA)\n✓ Comisiones y gastos\n✓ Plazo de pago\n✓ Requisitos de aprobación\n✓ Beneficios adicionales\n\n**En NEZA te ayudamos:**\n• Las entidades compiten automáticamente\n• Recibes múltiples ofertas\n• Comparas fácilmente las opciones\n• Eliges la mejor para tu perfil\n\n¿Quieres iniciar tu solicitud ahora?';
    }

    // Consultas sobre el proceso
    if (lowerMessage.includes('proceso') || lowerMessage.includes('pasos') || lowerMessage.includes('solicitar')) {
      return '📝 **Proceso en NEZA:**\n\n**Paso 1:** Completa el formulario (8 preguntas)\n**Paso 2:** Tu perfil llega a las entidades\n**Paso 3:** Recibe ofertas en tiempo real\n**Paso 4:** Compara y elige la mejor\n**Paso 5:** Contacto directo con la entidad\n\n⏱️ **Tiempo total:** 5-10 minutos\n🔒 **Seguridad:** 100% confidencial\n💰 **Costo:** Totalmente gratuito\n\n¿Listo para comenzar tu solicitud?';
    }

    // Ayuda general
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('opciones')) {
      return '🤝 **¿En qué puedo ayudarte?**\n\n**Puedo informarte sobre:**\n• Productos financieros y sus características\n• Tasas de interés y costos\n• Requisitos y documentación\n• Proceso de solicitud en NEZA\n• Comparación de opciones\n• Consejos financieros básicos\n\n**Ejemplos de preguntas:**\n• "¿Qué es un crédito hipotecario?"\n• "¿Cuánto cuesta una tarjeta de crédito?"\n• "Gano 3000 soles, ¿qué puedo solicitar?"\n\n¿Qué te gustaría saber?';
    }

    // Agradecimientos
    if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
      return '😊 ¡De nada! Me alegra poder ayudarte. Recuerda que:\n\n• Estoy aquí para resolver tus dudas financieras\n• Puedes preguntarme sobre cualquier producto\n• En NEZA las entidades compiten por darte lo mejor\n\n¿Hay algo más en lo que pueda asistirte?';
    }

    // Consultas sobre tiempo o urgencia
    if (lowerMessage.includes('urgente') || lowerMessage.includes('rápido') || lowerMessage.includes('cuánto demora')) {
      return '⚡ **Tiempos de Respuesta:**\n\n**En NEZA:**\n• Formulario: 5 minutos\n• Ofertas: Inmediatas\n• Comparación: Tiempo real\n\n**Aprobación por entidad:**\n• Tarjetas: 24-48 horas\n• Créditos personales: 2-5 días\n• Créditos vehiculares: 5-10 días\n• Créditos hipotecarios: 15-30 días\n\n💡 **Para mayor velocidad:** Ten tus documentos listos y completa toda la información solicitada.\n\n¿Necesitas algo urgente?';
    }

    // Respuesta por defecto con IA simulada
    return '🤖 Entiendo tu consulta sobre temas financieros. Como tu asesora IA, puedo ayudarte con:\n\n• **Productos:** Créditos, tarjetas, seguros, ahorros\n• **Información:** Tasas, requisitos, procesos\n• **Comparación:** Ventajas y características\n• **NEZA:** Cómo funciona nuestra plataforma\n\n💡 **Consejo:** Sé más específico en tu pregunta. Por ejemplo:\n"¿Qué documentos necesito para un crédito personal?"\n"¿Cuál es la mejor tarjeta de crédito para mis ingresos?"\n\n¿En qué puedo ayudarte específicamente?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular tiempo de respuesta de IA
    setTimeout(() => {
      const response = getAsesorIAResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Tiempo realista de IA
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-blue-200"
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
        <Card className="w-80 bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200 shadow-xl">
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
                  <h3 className="font-bold text-blue-800">AsesorIA</h3>
                  <p className="text-xs text-slate-600">Tu asesora financiera IA</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
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
      <Card className="w-96 h-[600px] bg-white border-blue-200 shadow-2xl flex flex-col">
        {/* Header del chat */}
        <div className="bg-gradient-to-r from-blue-600 to-slate-600 text-white p-4 rounded-t-lg">
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
                <div className="flex items-center gap-2 text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">En línea • Asesoría financiera IA</span>
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
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }
                `}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-slate-500'}`}>
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
              className="flex-1 border-blue-200 focus:border-blue-400"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            🤖 AsesorIA - Herramienta informativa, no sustituye asesoría profesional
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
