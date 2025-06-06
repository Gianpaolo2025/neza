
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
      text: '¡Hola! Soy AsesorIA, tu asistente financiero personal. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre productos financieros, tasas de interés, requisitos y mucho más.',
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
    
    // Respuestas sobre productos financieros
    if (lowerMessage.includes('crédito') || lowerMessage.includes('préstamo')) {
      return '💰 Te puedo ayudar con información sobre créditos! Tenemos créditos personales, hipotecarios, vehiculares y para empresas. ¿Qué tipo de crédito te interesa? También puedo explicarte las tasas y requisitos.';
    }
    
    if (lowerMessage.includes('tasa') || lowerMessage.includes('interés')) {
      return '📊 Las tasas de interés varían según el producto financiero:\n• Créditos personales: desde 18% anual\n• Créditos hipotecarios: desde 8.5% anual\n• Tarjetas de crédito: desde 35% anual\n¿Te interesa algún producto en particular?';
    }
    
    if (lowerMessage.includes('requisitos') || lowerMessage.includes('documentos')) {
      return '📋 Los requisitos básicos suelen ser:\n• DNI vigente\n• Boletas de pago (3 últimas)\n• Declaración jurada de ingresos\n• Referencias personales\n¿Para qué producto necesitas los requisitos específicos?';
    }
    
    if (lowerMessage.includes('depósito') || lowerMessage.includes('ahorro')) {
      return '🏦 Tenemos varios productos de ahorro:\n• Cuentas de ahorros (desde 0% comisión)\n• Depósitos a plazo (hasta 7% anual)\n• Depósitos CTS\n¿Te gustaría conocer más detalles de alguno?';
    }
    
    if (lowerMessage.includes('tarjeta')) {
      return '💳 Ofrecemos tarjetas de crédito con beneficios especiales:\n• Sin cuota de manejo el primer año\n• Cashback en compras\n• Programa de puntos\n¿Qué tipo de tarjeta buscas?';
    }
    
    if (lowerMessage.includes('banco') || lowerMessage.includes('entidad')) {
      return '🏛️ Trabajamos con las principales entidades financieras del Perú supervisadas por la SBS. Comparamos ofertas de bancos, cajas y financieras para encontrar la mejor opción para tu perfil.';
    }
    
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
      return '🤝 Estoy aquí para ayudarte con:\n• Información sobre productos financieros\n• Comparación de tasas y beneficios\n• Requisitos y documentación\n• Proceso de solicitud\n• Resolución de dudas\n¿Qué necesitas saber?';
    }
    
    if (lowerMessage.includes('gracias')) {
      return '😊 ¡De nada! Es un placer ayudarte. Si tienes más preguntas sobre productos financieros, no dudes en consultarme. ¡Estoy aquí para ayudarte a encontrar la mejor opción!';
    }
    
    // Respuesta por defecto
    return '🤖 Entiendo tu consulta. Como tu asesora financiera, puedo ayudarte con información sobre créditos, depósitos, tarjetas, tasas de interés y requisitos. ¿Podrías ser más específico sobre qué producto financiero te interesa?';
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

    // Simular tiempo de respuesta
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
    }, 1000 + Math.random() * 1000);
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

  // Botón flotante cuando está cerrado
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="relative"
          >
            <img 
              src="/lovable-uploads/2864c04b-4f0a-4e08-abf7-4cd14e81deeb.png" 
              alt="AsesorIA" 
              className="w-8 h-8 object-contain"
            />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            />
          </motion.div>
          <div className="absolute -top-12 right-0 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ¡Pregúntame lo que necesites!
          </div>
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
        <Card className="w-80 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 shadow-xl">
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
                  <h3 className="font-bold text-cyan-800">AsesorIA</h3>
                  <p className="text-xs text-cyan-600">Tu asesora financiera</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100"
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
      <Card className="w-96 h-[600px] bg-white border-cyan-200 shadow-2xl flex flex-col">
        {/* Header del chat */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-t-lg">
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
                <div className="flex items-center gap-2 text-cyan-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">En línea • Lista para ayudarte</span>
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
                  max-w-[80%] p-3 rounded-lg text-sm
                  ${message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }
                `}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
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
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <motion.div 
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-gray-400 rounded-full"
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta financiera..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AsesorIA está aquí para ayudarte con productos financieros
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
