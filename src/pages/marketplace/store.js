import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { useStrapiData } from '../../services/strapiService';
import Image from 'next/image';
import Link from 'next/link';
import Banner from './banner';

const Services = () => {
    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData('marketplaces?populate=*');

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

    // Filtrar los datos por tipo de producto
    const plugins = stores.filter(store => store.type === "plugin");
    const templates = stores.filter(store => store.type === "template");

    return (
        <div>
            {/* Sección de complementos */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Complementos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plugins.map((store) => (
                        <Link key={store.id} href={`/marketplace/${store.documentId}`}>
                            <div className="bg-white shadow-md rounded-lg cursor-pointer">
                                <div className="flex items-center">
                                    {store.img && store.img.url ? (
                                        <img
                                            src={store.img.url} // Asegurando que store.img no sea null
                                            alt={store.title}
                                            width={300}  // Ajustamos el tamaño de la imagen
                                            height={150}  // Ajustamos el tamaño de la imagen
                                            className="h-auto w-full object-cover rounded-t-lg"
                                        />
                                    ) : (
                                        <div className="h-40 w-full bg-gray-200 rounded-t-lg" />
                                    )}
                                </div>

                                <div className="p-4">
                                    <p className="text-sm text-gray-600">{store.title}</p>
                                    <p className="mt-1 text-sm">
                                        {store.price === 0 ? 'Gratis' : `$${store.price}`}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sección de plantillas */}
            <div>
                <h2 className="text-xl font-bold mb-4">Plantillas</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((store) => (
                        <Link key={store.id} href={`/marketplace/${store.documentId}`}>
                            <div className="bg-white shadow-md rounded-lg cursor-pointer">
                                <div className="flex items-center">
                                    {store.img.url ? (
                                        <img
                                            src={store.img.url} // asumiendo que la imagen se encuentra en store.image.url
                                            alt={store.title}
                                            width={300}  // Ajustamos el tamaño de la imagen
                                            height={150}  // Ajustamos el tamaño de la imagen
                                            className="h-auto w-full object-cover rounded-t-lg"
                                        />
                                    ) : (
                                        <div className="h-40 w-full bg-gray-200 rounded-t-lg" />
                                    )}
                                </div>

                                <div className="p-4">
                                    <p className="text-sm text-gray-600">{store.title}</p>
                                    <p className="mt-1 text-sm">
                                        {store.price === 0 ? 'Gratis' : `$${store.price}`}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <Banner />



        </div>
    );
};

export default Services;
