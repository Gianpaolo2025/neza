
import { useState } from 'react';

export const useAsesorIA = () => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Cambiado a true para que aparezca automáticamente

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return {
    isChatOpen,
    toggleChat,
    openChat,
    closeChat
  };
};
