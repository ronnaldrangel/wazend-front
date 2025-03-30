import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiServiceId';
import Image from 'next/image';
import Link from 'next/link';
import Banner from '../banner';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const Services = ({ documentId }) => {
    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData(`marketplaces/${documentId}`);

    console.log('Data:', stores);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="text-red-600 dark:text-red-400">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    // Lógica para mostrar "Obtener gratis" o el precio
    const buttonText = stores.data.price === 0 ? "Obtener gratis" : `Comprar por $${stores.data.price}`;

    // URL dinámica del botón (Verificamos si existe)
    const buttonUrl = stores.data.buttonUrl || '#';  // Si no existe la URL, se pone un valor por defecto

    return (
        <>

            <Link href="/marketplace" className="mb-4 flex items-center text-gray-600 hover:text-gray-800 font-medium">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                <span>Volver al Marketplace</span>
            </Link>

            <div className="bg-white text-black rounded-lg p-8">
                <header className="flex items-center justify-between py-4 border-b-2 border-gray-200">
                    <div className="text-3xl font-extrabold text-gray-800">{stores.data.title}</div>
                    {buttonUrl !== '#' ? (
                        <Link href={buttonUrl}>
                            <button className="bg-emerald-600 font-semibold text-white px-6 py-3 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300">
                                {buttonText}
                            </button>
                        </Link>
                    ) : (
                        <button className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed" disabled>
                            {buttonText}
                        </button>
                    )}
                </header>

                <section className="mt-10 mb-16">
                    <p className="text-lg text-gray-600">{stores.data.shortDescription}</p>
                </section>

                <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${stores.data.youtubeId}`}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <Banner />
        </>
    );
};

export default Services;
