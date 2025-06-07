
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shield, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const institutionalValues = [
  {
    id: 1,
    title: "Transparencia",
    description: "Información clara y honesta en todos nuestros procesos",
    icon: Shield,
    color: "neza-blue"
  },
  {
    id: 2,
    title: "Empoderamiento al Usuario",
    description: "Ponemos el control en tus manos para tomar las mejores decisiones",
    icon: Users,
    color: "neza-cyan"
  }
];

export const ValuesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % institutionalValues.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % institutionalValues.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + institutionalValues.length) % institutionalValues.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Contenedor del carrusel */}
      <div className="overflow-hidden rounded-lg bg-white border border-neza-silver-200 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="p-8 text-center"
          >
            {(() => {
              const value = institutionalValues[currentIndex];
              const Icon = value.icon;
              return (
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-${value.color}-100`}>
                    <Icon className={`w-8 h-8 text-${value.color}-600`} />
                  </div>
                  <h3 className={`text-2xl font-bold text-${value.color}-800`}>
                    {value.title}
                  </h3>
                  <p className="text-neza-silver-600 max-w-md text-lg">
                    {value.description}
                  </p>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPrevious}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-neza-blue-100 hover:bg-neza-blue-200 text-neza-blue-600 transition-colors"
          aria-label="Valor anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicadores */}
        <div className="flex space-x-2">
          {institutionalValues.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-neza-blue-600' 
                  : 'bg-neza-silver-300 hover:bg-neza-silver-400'
              }`}
              aria-label={`Ir al valor ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-neza-blue-100 hover:bg-neza-blue-200 text-neza-blue-600 transition-colors"
          aria-label="Siguiente valor"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicador de auto-play */}
      <div className="text-center mt-2">
        <span className="text-xs text-neza-silver-400">
          {isAutoPlaying ? "Reproducción automática activa" : "Reproducción pausada"}
        </span>
      </div>
    </div>
  );
};
