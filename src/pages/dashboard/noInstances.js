import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  PlusIcon, 
  SparklesIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/solid';
import { ServerIcon } from '@heroicons/react/24/outline';

export default function Index() {
    const { data: session } = useSession();
    const email = session?.user?.email;

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <ServerIcon className="h-16 w-16 text-gray-400" aria-hidden="true" />
                    <h3 className="text-lg font-medium text-gray-900">
                        ¡Empieza ahora a usar Wazend!
                    </h3>
                    <p className="text-gray-500 max-w-md">
                        Comienza creando una instancia para WhatsApp.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 pt-2">
                        <Link
                            href="/upgrade"
                            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-3 text-white text-sm font-medium shadow-sm hover:bg-emerald-500 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                        >
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="ml-2">Crea una instancia</span>
                        </Link>
                        
                        <Link
                            href="/trial"
                            className="inline-flex items-center justify-center rounded-md bg-purple-600 px-5 py-3 text-white text-sm font-medium shadow-sm hover:bg-purple-500 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        >
                            <SparklesIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="ml-2">Prueba gratis</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}