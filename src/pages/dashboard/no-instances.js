import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    PlusIcon,
    SparklesIcon,
    ArrowRightIcon
} from '@heroicons/react/24/solid';
import { ServerIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function Index() {
    const { data: session } = useSession();
    const email = session?.user?.email;

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">

                <div className="flex flex-col space-y-4">
                    <p className="text-gray-500">
                        Parece que no tienes ningún Producto/Servicio contratado todavía.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 pt-2">

                        <Button asChild variant="default" className='px-4'>
                            <Link href="/upgrade/">
                                <PlusIcon />
                                <span className="text-sm lg:text-base">Comprar para empezar</span>
                            </Link>
                        </Button>

                        {/* <Button asChild variant="default" className='px-4 bg-purple-600 hover:bg-purple-500'>
                            <Link
                                href="/trial"
                            >
                                <SparklesIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="text-sm lg:text-base">Prueba gratis</span>
                            </Link>
                        </Button> */}

                    </div>
                </div>

            </div>
        </div>
    );
}