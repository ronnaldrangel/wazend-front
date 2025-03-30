import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

export default function Index() {

    return (
        <>
            <div className="bg-white rounded-xl px-6 py-10 text-center shadow-lg w-full mx-auto border border-gray-200 min-h-[400px] flex flex-col justify-center items-center">
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
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                    ¡Empieza ahora a usar Wazend!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    Comience creando una instancia para WhatsApp.
                </p>
                <Link
                    href="/upgrade/"
                    className="mt-6 inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-white text-base font-medium shadow-md hover:bg-emerald-500 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="ml-3">Crea una instancia</span>
                </Link>
            </div>
        </>
    );
}
