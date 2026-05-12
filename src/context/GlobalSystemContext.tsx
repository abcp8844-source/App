import React, { createContext, useContext, useState } from "react";
import { OPERATIONAL_MARKETS, Market } from "../constants/RegionalData";

interface GlobalState {
  activeMarket: Market;
  setMarket: (iso: string) => void;
  isGlobalSyncing: boolean;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Thailand based on your initial UI
  const [activeMarket, setActiveMarket] = useState<Market>(OPERATIONAL_MARKETS[0]);
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);

  const setMarket = (iso: string) => {
    const market = OPERATIONAL_MARKETS.find(m => m.iso === iso);
    if (market) {
      setIsGlobalSyncing(true);
      setActiveMarket(market);
      // Artificial delay to sync 3D assets & location nodes
      setTimeout(() => setIsGlobalSyncing(false), 1500);
    }
  };

  return (
    <GlobalContext.Provider value={{ activeMarket, setMarket, isGlobalSyncing }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalSystem = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalSystem must be used within GlobalProvider");
  return context;
};
