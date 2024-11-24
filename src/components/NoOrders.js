// NoOrders.js
import { DocumentTextIcon, GiftIcon, PlusIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import ModalVideo from './ModalVideo';
import { useState } from 'react';

const NoOrders = () => {
  const [showQr, setShowQr] = useState(false);

  const handleShowQr = () => {
    setShowQr(true);
  };

  const handleCloseQr = () => {
    setShowQr(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl px-6 py-20 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">No se encontró nada por aquí</h3>
        <p className="mt-1 text-md text-gray-500">¡Vamos a cambiar esto!</p>

        <div className="mt-6 flex flex-col md:flex-row md:justify-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Botón para abrir el modal */}
          <button
            className="inline-flex items-center justify-center w-full md:w-auto rounded-md bg-gray-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            onClick={handleShowQr}
          >
            <DocumentTextIcon
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Primeros pasos
          </button>

          {/* ModalVideo */}
          {showQr && <ModalVideo onClose={handleCloseQr} />}

          {/* Enlace a prueba gratis */}
          <Link
            href="/trial"
            className="inline-flex items-center justify-center w-full md:w-auto rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <GiftIcon
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Prueba gratis
          </Link>

          {/* Enlace a WhatsApp */}
          <a
            href="https://api.whatsapp.com/send?phone=51924079147&text=Hola%2C%20quiero%20contratar%20un%20servicio%20de%20Wazend"
            className="inline-flex items-center justify-center w-full md:w-auto rounded-md bg-emerald-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <PlusIcon
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Contratar servicio
          </a>
        </div>
      </div>
    </>
  );
};

export default NoOrders;