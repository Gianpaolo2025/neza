
import { useState } from "react";
import { UserRegistration } from "@/components/UserRegistration";
import { OffersDashboard } from "@/components/OffersDashboard";
import { Header } from "@/components/Header";

export interface UserData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  requestedAmount: number;
  employmentType: string;
  creditHistory: string;
}

const Index = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleUserRegistration = (userData: UserData) => {
    setUser(userData);
    setIsRegistered(true);
  };

  const handleBackToForm = () => {
    setIsRegistered(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {!isRegistered ? (
        <UserRegistration onSubmit={handleUserRegistration} />
      ) : (
        <OffersDashboard user={user!} onBack={handleBackToForm} />
      )}
    </div>
  );
};

export default Index;
