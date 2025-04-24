import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Loader from '../../components/loaders/OrderSkeleton';
import { useStrapiData } from '../../services/strapiService';
import Link from 'next/link';

const Services = () => {
    // Estado para el tab activo
    const [activeTab, setActiveTab] = useState('integraciones');
    
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
    const templates = stores.filter(store => store.type === "template");

    return (
        <div className="mx-auto">
            {/* Header del marketplace en una caja */}
            <div className="mb-10 border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Marketplace de Wazend</h1>
                <p className="text-gray-600">
                    Descubre integraciones y plantillas para impulsar tu experiencia con WhatsApp
                </p>
            </div>

            {/* Sección de tabs */}
            <div className='mb-10 border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm'>
            <div className="border-b border-gray-200 mb-8">
                <div className="flex space-x-8">
                    <button 
                        onClick={() => setActiveTab('integraciones')}
                        className={`border-b-2 py-4 px-1 text-sm font-medium ${
                            activeTab === 'integraciones' 
                            ? 'border-emerald-500 text-emerald-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <span>Integraciones</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('plantillas')}
                        className={`border-b-2 py-4 px-1 text-sm font-medium ${
                            activeTab === 'plantillas' 
                            ? 'border-emerald-500 text-emerald-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <span>Plantillas</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Sección de complementos */}
            {activeTab === 'integraciones' && (
                <div id="integraciones" className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        {plugins.length > 6 && (
                            <Link href="/marketplace/integraciones" className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center">
                                Ver todas
                            </Link>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plugins.map((store) => (
                            <Link key={store.id} href={`/marketplace/${store.documentId}`}>
                                <div className="bg-white shadow-sm hover:shadow-md rounded-lg transition-shadow duration-200 cursor-pointer border border-gray-100 h-full flex flex-col">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                                        {store.img && store.img.url ? (
                                            <img
                                                src={store.img.url}
                                                alt={store.title}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gray-200">
                                                <div className="text-gray-400 text-lg">Plugin</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-medium text-gray-800 mb-1">{store.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 flex-grow">
                                            {store.description ? store.description.substring(0, 80) + (store.description.length > 80 ? '...' : '') : 'Integra con tus servicios favoritos'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${store.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                {store.price === 0 ? 'Gratis' : `${store.price}`}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">Plugin</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Sección de plantillas */}
            {activeTab === 'plantillas' && (
                <div id="plantillas" className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        {templates.length > 6 && (
                            <Link href="/marketplace/plantillas" className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center">
                                Ver todas
                            </Link>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((store) => (
                            <Link key={store.id} href={`/marketplace/${store.documentId}`}>
                                <div className="bg-white shadow-sm hover:shadow-md rounded-lg transition-shadow duration-200 cursor-pointer border border-gray-100 h-full flex flex-col">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                                        {store.img && store.img.url ? (
                                            <img
                                                src={store.img.url}
                                                alt={store.title}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gray-200">
                                                <div className="text-gray-400 text-lg">Plantilla</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-medium text-gray-800 mb-1">{store.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 flex-grow">
                                            {store.description ? store.description.substring(0, 80) + (store.description.length > 80 ? '...' : '') : 'Plantillas listas para usar'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-medium ${store.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                {store.price === 0 ? 'Gratis' : `${store.price}`}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">Plantilla</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            </div>

            {/* Banner de creadores */}
            {/* <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-10 px-8 rounded-xl shadow-lg mt-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Conviértete en creador hoy</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Comparte tus plantillas o complementos, aumenta tu visibilidad y genera ingresos, todo con unos pocos clics.
                    </p>
                    <Link href="https://wa.link/5se5ao" passHref>
                        <button className="group bg-white text-emerald-600 py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 inline-flex items-center">
                            Únete ahora
                        </button>
                    </Link>
                </div>
            </div> */}

        </div>
    );
};

export default Services;