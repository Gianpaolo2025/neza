
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";

interface SBSEntity {
  id: string;
  name: string;
  type: "banco" | "caja-municipal" | "financiera" | "microcrédito";
  logo: string;
  description: string;
  sbsCode: string;
}

const sbsEntities: SBSEntity[] = [
  // Bancos
  { id: "1", name: "Banco de Crédito del Perú", type: "banco", logo: "🏛️", description: "Líder en el mercado financiero peruano", sbsCode: "B-01001" },
  { id: "2", name: "BBVA Perú", type: "banco", logo: "🏦", description: "Banca digital innovadora", sbsCode: "B-01002" },
  { id: "3", name: "Scotiabank Perú", type: "banco", logo: "🏪", description: "Banco internacional con presencia global", sbsCode: "B-01003" },
  { id: "4", name: "Interbank", type: "banco", logo: "🏢", description: "Innovación y tecnología financiera", sbsCode: "B-01004" },
  { id: "5", name: "Banco Pichincha", type: "banco", logo: "🏛️", description: "Banco con sólida presencia regional", sbsCode: "B-01005" },
  { id: "6", name: "Banco Falabella", type: "banco", logo: "🏬", description: "Retail banking especializado", sbsCode: "B-01006" },
  { id: "7", name: "Banco Ripley", type: "banco", logo: "🏪", description: "Servicios financieros retail", sbsCode: "B-01007" },
  
  // Cajas Municipales
  { id: "8", name: "Caja Municipal Arequipa", type: "caja-municipal", logo: "🏛️", description: "Microfinanzas y desarrollo local", sbsCode: "C-02001" },
  { id: "9", name: "Caja Municipal Cusco", type: "caja-municipal", logo: "🏛️", description: "Inclusión financiera regional", sbsCode: "C-02002" },
  { id: "10", name: "Caja Municipal Trujillo", type: "caja-municipal", logo: "🏛️", description: "Servicios financieros municipales", sbsCode: "C-02003" },
  { id: "11", name: "Caja Municipal Huancayo", type: "caja-municipal", logo: "🏛️", description: "Desarrollo económico local", sbsCode: "C-02004" },
  { id: "12", name: "Caja Municipal Piura", type: "caja-municipal", logo: "🏛️", description: "Banca de proximidad", sbsCode: "C-02005" },
  
  // Financieras
  { id: "13", name: "CrediScotia Financiera", type: "financiera", logo: "💼", description: "Créditos de consumo especializados", sbsCode: "F-03001" },
  { id: "14", name: "Compartamos Financiera", type: "financiera", logo: "💼", description: "Microfinanzas e inclusión", sbsCode: "F-03002" },
  { id: "15", name: "Financiera Oh!", type: "financiera", logo: "💼", description: "Financiamiento vehicular", sbsCode: "F-03003" },
  { id: "16", name: "Mitsui Auto Finance", type: "financiera", logo: "💼", description: "Especialistas en auto financiamiento", sbsCode: "F-03004" },
  
  // Microcréditos
  { id: "17", name: "Mibanco", type: "microcrédito", logo: "🏪", description: "Microfinanzas y pequeña empresa", sbsCode: "M-04001" },
  { id: "18", name: "Financiera Confianza", type: "microcrédito", logo: "🏪", description: "Microcréditos especializados", sbsCode: "M-04002" },
  { id: "19", name: "Pro Finanzas", type: "microcrédito", logo: "🏪", description: "Apoyo a microempresarios", sbsCode: "M-04003" },
  { id: "20", name: "Credinka", type: "microcrédito", logo: "🏪", description: "Microfinanzas sostenibles", sbsCode: "M-04004" }
];

const getTypeLabel = (type: string) => {
  const labels = {
    "banco": "🏛️ Banco",
    "caja-municipal": "🏛️ Caja Municipal", 
    "financiera": "💼 Financiera",
    "microcrédito": "🏪 Microcrédito"
  };
  return labels[type as keyof typeof labels] || type;
};

const getTypeColor = (type: string) => {
  const colors = {
    "banco": "bg-blue-100 text-blue-800 border-blue-300",
    "caja-municipal": "bg-green-100 text-green-800 border-green-300",
    "financiera": "bg-purple-100 text-purple-800 border-purple-300", 
    "microcrédito": "bg-orange-100 text-orange-800 border-orange-300"
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const SBSEntitiesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Ajustar items por vista según el tamaño de pantalla
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-scroll del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, sbsEntities.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [itemsPerView]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, sbsEntities.length - itemsPerView);
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, sbsEntities.length - itemsPerView);
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const visibleEntities = sbsEntities.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Entidades Financieras Autorizadas
            </h2>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            <strong>Estas son las entidades con las que colaboramos.</strong> Todas están supervisadas y reguladas por la 
            Superintendencia de Banca, Seguros y AFP (SBS) del Perú.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {sbsEntities.filter(e => e.type === 'banco').length} Bancos
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {sbsEntities.filter(e => e.type === 'caja-municipal').length} Cajas Municipales
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {sbsEntities.filter(e => e.type === 'financiera').length} Financieras
            </span>
            <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              {sbsEntities.filter(e => e.type === 'microcrédito').length} Microcréditos
            </span>
          </div>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all duration-200"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all duration-200"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Contenedor del carrusel */}
          <div className="mx-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`grid gap-4 ${
                  itemsPerView === 1 ? 'grid-cols-1' : 
                  itemsPerView === 2 ? 'grid-cols-2' : 'grid-cols-3'
                }`}
              >
                {visibleEntities.map((entity) => (
                  <Card 
                    key={entity.id}
                    className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-3">{entity.logo}</div>
                      
                      <h3 className="font-bold text-slate-800 mb-2 text-sm md:text-base line-clamp-2">
                        {entity.name}
                      </h3>
                      
                      <div className="mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(entity.type)}`}>
                          {getTypeLabel(entity.type)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                        {entity.description}
                      </p>
                      
                      <div className="text-xs text-slate-500">
                        <span className="font-mono">SBS: {entity.sbsCode}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(sbsEntities.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / itemsPerView) === index 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a la página ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer con información SBS */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Supervisadas por la SBS - Gobierno del Perú
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
