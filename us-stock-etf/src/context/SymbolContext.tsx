import { useState, useContext, createContext } from "react";

const SymbolContext = createContext<any>(undefined);

export const useSymbolContext = () => useContext(SymbolContext);

export function SymbolProvider({ children }: any) {
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
      const prevPrice = prev[symbol]?.price ?? price;
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
