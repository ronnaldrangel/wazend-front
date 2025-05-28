import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Alerts = ({ message }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="rounded-lg bg-red-50 p-6 border border-red-200">
        <div className="flex items-center text-red-700 mb-2">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <h3 className="font-bold">Error al cargar</h3>
        </div>
        <p className="text-sm text-red-600">{message}</p>
        <button
          onClick={handleReload}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
        >
          Intentar nuevamente
        </button>
      </div>
    </>
  );
};

export default Alerts;
