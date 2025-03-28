import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { useStrapiData } from '../../services/strapiService';
import Image from 'next/image';
import Link from 'next/link';

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

            {/* Sección de plantillas */}
            <div>
                <h2 className="text-xl font-bold mb-4">Plantillas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Banner para invitar a ser parte del marketplace */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-16 px-6 text-center mt-16 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Conviértete en creador hoy</h2>
                <p className="text-lg mb-6">
                    Envía una plantilla o complemento, hazte destacar y gana dinero, todo en solo unos clics.
                </p>
                <Link href="https://wa.link/5se5ao" passHref>
                    <button className="bg-white text-emerald-600 py-4 px-10 rounded-full shadow-lg hover:bg-emerald-100 transition duration-300 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-300">
                        Únete ahora
                    </button>
                </Link>
            </div>



        </div>
    );
};

export default Services;
