
import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "client" | "admin" | "bank";

interface UserContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState<UserRole>("client");

  return (
    <UserContext.Provider value={{ currentStep, setCurrentStep, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext debe usarse dentro de UserProvider");
  return context;
};
