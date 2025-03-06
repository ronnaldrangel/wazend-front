import { useSession } from 'next-auth/react';
import Loader from '../../components/loaders/OrderSkeleton';
import { useStrapiData } from '../../services/strapiService';
import Image from 'next/image';

const Services = () => {
    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData('stores');

    // console.log('Data:', stores);

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

    return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {stores.map((store) => (
        <div
            key={store.id}
            className="bg-white shadow-md rounded-lg p-6"
        >
            <div className="flex items-center mb-2">
                {store.image ? (
                    <Image
                        src={store.image} // asumiendo que la imagen se encuentra en store.image.url
                        alt={store.name}
                        width={200}
                        height={100}
                        className="h-10 w-10 mr-4"
                    />
                ) : (
                    // Muestra un placeholder en caso de no existir imagen
                    <div className="h-10 w-10 mr-4 bg-gray-200" />
                )}
                <h3 className="text-base font-semibold">{store.name}</h3>
            </div>
            <hr className="border-t border-gray-100 mb-4" />
            <p className="text-sm text-gray-600">{store.description}</p>
            <p className="mt-2 text-sm font-bold">Desde {store.price}</p>
            <button
                onClick={() => window.open(store.button, '_blank')}
                className="mt-4 w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-emerald-700 transition shadow-md"
            >
                Más información
            </button>
        </div>
    ))}
</div>
    );
};

export default Services;
