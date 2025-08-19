import { useState } from 'react';
import Loader from '../../components/loaders/skeleton';
import { useStrapiData } from '../../services/strapiService';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

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
                            <Card 
                                shadow="sm" 
                                padding="md" 
                                hover="shadow"
                                className="cursor-pointer h-full flex flex-col"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        {store.img && store.img.url ? (
                                            <img
                                                src={store.img.url}
                                                alt={store.title}
                                                className="h-10 w-10"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-full">
                                                <p className="text-xs text-muted-foreground">Sin img</p>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-foreground text-lg">{store.title}</h3>
                                </div>

                                {/* Línea separadora */}
                                <div className="border-t border-border my-3 -mx-6"></div>

                                <div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {store.shortDescription}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;