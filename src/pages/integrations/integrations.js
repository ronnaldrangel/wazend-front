import { useState } from 'react';
import Loader from '../../components/loaders/skeleton';
import { useStrapiData } from '../../services/strapiService';
import Link from 'next/link';

const Services = () => {
    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData('marketplaces?populate=*');

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600">
                <p className="font-medium">Error al cargar los datos</p>
                <p className="text-sm">{error.message}</p>
            </div>
        );
    }

    // Filtrar los datos por tipo de producto
    const plugins = stores.filter(store => store.type === "plugin");

    return (
        <div className="mx-auto">
            {/* Header del marketplace en una caja */}
            {/* <div className="mb-10 border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Integraciones de Wazend</h1>
                <p className="text-gray-600">
                    Descubre integraciones y plantillas para impulsar tu experiencia con WhatsApp
                </p>
            </div> */}

            {/* Sección de complementos */}
            <div id="integraciones" className="mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plugins.map((store) => (
                        <Link key={store.id} href={`${store.buttonUrl}`}>
                            <div className="p-6 bg-white shadow-sm hover:shadow-md rounded-lg transition-shadow duration-200 cursor-pointer border border-gray-100 h-full flex flex-col">

                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        {store.img && store.img.url ? (
                                            <img
                                                src={store.img.url}
                                                alt={store.title}
                                                className="h-12 w-12"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full">
                                                <p className="text-xs text-gray-500">Sin img</p>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{store.title}</h3>
                                </div>

                                {/* Línea gris separadora */}
                                <div className="border-t border-gray-100 my-3 -mx-6"></div>

                                <div>
                                    <p className="mt-2 text-sm text-gray-700">
                                        {store.shortDescription}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;