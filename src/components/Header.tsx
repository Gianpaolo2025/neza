
import { Building2, TrendingUp } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-slate-600 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent">
                FinanceMarket
              </h1>
              <p className="text-sm text-slate-600">Encuentra tu mejor oferta financiera</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Comparando en tiempo real</span>
          </div>
        </div>
      </div>
    </header>
  );
};
