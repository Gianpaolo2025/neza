
import { useState } from 'react';

export const useAsesorIA = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // Cambiado a false para que NO aparezca automáticamente

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
