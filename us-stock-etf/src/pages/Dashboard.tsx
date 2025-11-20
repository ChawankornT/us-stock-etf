import { useState } from "react";
import AddModal from "../components/AddModal";
import DataTable from "../components/DataTable";
import useAlpacaStream from "../hooks/useAlpacaStream";

export default function Dashboard() {
  const [isOpenModal, SetIsOpenModal] = useState(false);

  const handleOpenModal = () => SetIsOpenModal(true);
  const handleCloseModal = () => SetIsOpenModal(false);

  useAlpacaStream();
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">US Stocks & ETFs</h1>

        <button className="mt-2 bg-green-400" onClick={handleOpenModal}>
          + Add Symbol
        </button>
      </div>

      <DataTable />

      <AddModal isOpen={isOpenModal} onClose={handleCloseModal} />
    </>
  );
}
