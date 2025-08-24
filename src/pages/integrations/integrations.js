import { useState } from 'react';
import Loader from '../../components/loaders/skeleton';
import { useStrapiData } from '../../services/strapiService';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import ErrorAlert from '@/components/alerts/ErrorAlert';

const Services = () => {
    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData('marketplaces?populate=*');

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <ErrorAlert 
                title="Error al cargar los datos" 
                message={error.message} 
            />
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
                                            <div className="relative h-10 w-10">
                                                <Image
                                                    src={store.img.url}
                                                    alt={store.title}
                                                    width={40}
                                                    height={40}
                                                    className="object-contain rounded"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                                    priority={false}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full">
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