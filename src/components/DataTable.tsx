import { useRef, useState } from "react";
import { useSymbolContext } from "../context/SymbolContext";
import { formatDateTime } from "../utils/dateTimeFormatter";
import AddModal from "./AddModal";

export default function DataTable() {
  const { symbolList, prices, removeSymbol } = useSymbolContext();
  const [isOpenModal, SetIsOpenModal] = useState(false);
  const editingSymbol = useRef<string>(undefined);

  const handleOpenModalForEdit = (symbol: string) => {
    if (!symbol) return;

    editingSymbol.current = symbol;
    SetIsOpenModal(true);
  };

  const handleCloseModal = () => {
    editingSymbol.current = undefined;
    SetIsOpenModal(false);
  };

  return (
    <div className="flex justify-center mt-5">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Updated At</th>
            <th className="w-60">Action</th>
          </tr>
        </thead>
        <tbody>
          {symbolList.map((symbol: string) => {
            const data = prices[symbol];
            const displayPrice = data?.price ?? "N/A";
            const price = Number(data?.price) ?? 0;
            const prevPrice = Number(data?.prevPrice) ?? null;
            const updatedTime = data?.timestamp ? data.timestamp : "-";

            return (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td
                  className={
                    !prevPrice
                      ? "text-red-500"
                      : price > prevPrice
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {displayPrice}
                </td>
                <td>{formatDateTime(updatedTime)}</td>
                <td>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleOpenModalForEdit(symbol)}
                      className="bg-amber-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeSymbol(symbol)}
                      className="bg-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <AddModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        defaultSymbol={editingSymbol.current}
      />
    </div>
  );
}
