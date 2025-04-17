import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function Index() {
    const { data: session } = useSession(); // Obtener la sesión del usuario
    const email = session?.user?.email; // Obtener el email de la sesión del usuario

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
                <p className="mt-2 text-sm text-gray-600 mb-6">
                    Comienza creando una instancia para WhatsApp.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                    <Link
                        href="/upgrade"
                        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-white text-base font-medium shadow-md hover:bg-emerald-500 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                        <PlusIcon className="h-6 w-6" aria-hidden="true" />
                        <span className="ml-3">Crea una instancia</span>
                    </Link>
                    <Link
                        // href={email ? `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=9390&aero-qty=1&billing_email=${encodeURIComponent(email)}` : '/'}
                        href="/trial"
                        className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-white text-base font-medium shadow-md hover:bg-purple-500 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    >
                        <SparklesIcon className="h-6 w-6" aria-hidden="true" />
                        <span className="ml-3">Prueba gratis</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
