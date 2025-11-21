import React from "react";
import { useState, useContext, createContext } from "react";

interface ContextType {
  symbolList: string[];
  prices: {};
  addSymbol: (symbol: string) => void;
  editSymbol: (oldSymbol: string, newSymbol: string) => void;
  removeSymbol: (symbol: string) => void;
  updatePrice: (symbol: string, price: string, timestamp: string) => void;
}

const SymbolContext = createContext<ContextType | undefined>(undefined);

export const useSymbolContext = () => {
  const context = useContext(SymbolContext);
  if (!context) throw new Error("useSymbolContext is not in SymbolProvider");
  return context;
};

export function SymbolProvider({ children }: { children: React.ReactNode }) {
  const [symbolList, setSymbolList] = useState<string[]>([]);
  const [prices, setPrices] = useState({});

  const addSymbol = (symbol: string) => {
    setSymbolList((prev) => [...prev, symbol]);
  };

  const editSymbol = (oldSymbol: string, newSymbol: string) => {
    setSymbolList((prev) => prev.map((s) => (s === oldSymbol ? newSymbol : s)));

    setPrices((p) => {
      const copy = { ...p };
      delete copy[oldSymbol];
      return copy;
    });
  };

  const removeSymbol = (symbol: string) => {
    setSymbolList((prev) => prev.filter((s) => s !== symbol));
    setPrices((p) => {
      const copy = { ...p };
      delete copy[symbol];
      return copy;
    });
  };

  const updatePrice = (symbol: string, price: string, timestamp: string) => {
    setPrices((prev) => {
      const prevPrice = prev[symbol]?.price ?? null;
      return { ...prev, [symbol]: { price, prevPrice, timestamp } };
    });
  };

  return (
    <SymbolContext
      value={{
        symbolList,
        prices,
        addSymbol,
        editSymbol,
        removeSymbol,
        updatePrice,
      }}
    >
      {children}
    </SymbolContext>
  );
}
