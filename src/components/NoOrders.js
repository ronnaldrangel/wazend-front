// NoOrders.js
import { PlusIcon } from '@heroicons/react/20/solid';

const NoOrders = () => {
  // Función para manejar el clic del botón
  const handleButtonClick = () => {
    window.location.href = 'https://wazend.net/pricing/';
  };

  return (
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
      <h3 className="mt-2 text-xl font-semibold text-gray-900">Aún no tienes ninguna instancia</h3>
      <p className="mt-1 text-md text-gray-500">¡Vamos a cambiar esto!</p>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleButtonClick}
          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Contratar servicio
        </button>
      </div>
    </div>
  );
};

export default NoOrders;
