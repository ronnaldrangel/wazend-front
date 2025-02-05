// NoOrders.js
import { DocumentTextIcon, GiftIcon, PlusIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

const NoOrders = () => {

  return (
    <>
      <div className="bg-white rounded-xl px-6 py-10 text-center shadow-lg w-full mx-auto border border-gray-200">
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
        <h3 className="mt-2 text-base font-base text-gray-600">Aún no tienes ninguna instancia. ¡Vamos a cambiar esto!</h3>
      </div>
    </>
  );
};

export default NoOrders;