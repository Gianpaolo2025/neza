
import { Building2, TrendingUp } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FinanceMarket</h1>
              <p className="text-sm text-gray-500">Encuentra tu mejor oferta financiera</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Comparando en tiempo real</span>
          </div>
        </div>
      </div>
    </header>
  );
};
