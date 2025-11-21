import { useEffect, useRef, useState } from "react";
import { useSymbolContext } from "../context/SymbolContext";
import alpaca from "../utils/alpacaConfig";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSymbol?: string;
}

export default function AddModal({
  isOpen,
  onClose,
  defaultSymbol,
}: ModalProps) {
  const [symbol, setSymbol] = useState("");
  const [symbolData, setSymbolData] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const { symbolList, addSymbol, editSymbol } = useSymbolContext();
  const [limit, setLimit] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    if (!isOpen || !defaultSymbol) return;

    setSymbol(defaultSymbol);
  }, [isOpen]);

  useEffect(() => {
    if (!symbol) return;
    searchSymbol();
  }, [symbol]);

  const searchSymbol = async () => {
    if (!symbol) return;

    const res = await fetch(`${alpaca.BASE_URL}/${symbol}`, {
      headers: {
        "APCA-API-KEY-ID": alpaca.KEY,
        "APCA-API-SECRET-KEY": alpaca.SECRET,
      },
    });

    if (res.status === 404) {
      setAlertMessage("Not found");
      setSymbolData(null);
      return;
    }

    const asset = await res.json();
    setSymbolData(asset);
    setAlertMessage("");
  };

  const handleChange = (val: string) => {
    setSymbol(val.trim().toUpperCase());
  };

  const handleAdd = () => {
    if (!symbol) return;
    if (!symbolData) return;

    if (symbolData.class !== "us_equity")
      return setAlertMessage("This Symbol is not 'US Stock / ETF'");
    if (symbolList.includes(symbol)) return setAlertMessage("Duplicate symbol");
    if (symbolList.length >= limit)
      return setAlertMessage(`Limit ${limit} symbols`);

    addSymbol(symbol);
    handleClose();
  };

  const handleEdit = () => {
    if (!symbol) return;
    if (!symbolData) return;

    if (symbolData.class !== "us_equity")
      return setAlertMessage("This Symbol is not 'US Stock / ETF'");
    if (symbolList.includes(symbol)) return setAlertMessage("Duplicate symbol");

    editSymbol(defaultSymbol, symbol);
    handleClose();
  };

  const handleClose = () => {
    setSymbol("");
    setSymbolData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        <div className="flex items-center justify-between text-xl mb-4 bg-teal-600 text-white p-2 rounded-t-lg">
          {!defaultSymbol ? <h2>Add Symbol</h2> : <h2>Edit Symbol</h2>}
          <button className="text-right" onClick={handleClose}>
            X
          </button>
        </div>

        <div className="m-2">
          <input
            value={symbol}
            ref={inputRef}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="AAPL,TSLA"
            className="px-2 py-1 border border-gray-300 rounded-md w-full"
          />
          <div className="m-2 h-[100px]">
            {symbol && (
              <>
                {symbolData && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex">
                      <div className="font-bold mr-2">Symbol:</div>
                      <div data-testid="test-data">{symbolData.symbol}</div>
                    </div>
                    <div className="flex">
                      <div className="font-bold mr-2">Name:</div>
                      <div>{symbolData.name}</div>
                    </div>
                  </div>
                )}
                {alertMessage && (
                  <div className="text-md text-center text-red-500 mt-1">
                    {alertMessage}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-5">
            {!defaultSymbol ? (
              <button onClick={handleAdd} className="bg-orange-400">
                Add
              </button>
            ) : (
              <button onClick={handleEdit} className="bg-orange-400">
                Edit
              </button>
            )}
            <button onClick={() => setSymbol("")} className="bg-gray-400">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
