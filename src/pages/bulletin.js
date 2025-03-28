import { useSession } from 'next-auth/react';
import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiService';
import Image from 'next/image';

const Index = () => {
    const { data: session } = useSession(); // Obtener la sesión del usuario
    const email = session?.user?.email; // Obtener el email de la sesión del usuario

    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData('bulletins?populate=*');

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
        <>
            <h1 className="text-xl font-semibold mb-4">Enlaces importantes</h1>
            <div className="grid gap-4 lg:grid-cols-3">

                {stores.map((store) => {
                    // Verifica si isCheckout es true y se tiene el email
                    let link = store.button;
                    if (store.isCheckout && email) {
                        link = `${store.button}&billing_email=${encodeURIComponent(email)}`;
                    }

                    return (
                        <div key={store.id} className="flex flex-col bg-white rounded-lg shadow-md p-6 gap-4">
                            {/* Imagen de la tarjeta */}
                            {store.img?.url && (
                                <img
                                    src={store.img.url}
                                    alt={store.title}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                            )}

                            <p className="text-xl font-semibold tracking-tight text-gray-950">{store.title}</p>
                            <p className="text-base text-gray-600 flex-grow">{store.description}</p>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-2 w-full text-center rounded-lg p-3 text-base font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600`}
                            >
                                Ver más
                            </a>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Index;
