import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiServiceId';
import Link from 'next/link';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon, PuzzlePieceIcon, PlayIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';

const ProductDetail = ({ documentId }) => {
    // Obtenemos los datos de 'stores' de la API
    const { data: stores, error, isLoading } = useStrapiData(`marketplaces/${documentId}`);

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

    const product = stores.data;

    // Lógica para mostrar "Obtener gratis" o el precio
    const isFree = product.price === 0;
    const buttonText = isFree ? "Obtener gratis" : `Comprar por $${product.price}`;

    // URL dinámica del botón (Verificamos si existe)
    const buttonUrl = product.buttonUrl || '#';  // Si no existe la URL, se pone un valor por defecto
    const isButtonDisabled = buttonUrl === '#';

    // Determinar el icono basado en el tipo de producto
    const TypeIcon = product.type === 'plugin' ? PuzzlePieceIcon : DocumentTextIcon;

    return (
        <div className="w-full">
            {/* Barra de navegación superior */}
            <div className="container mx-auto mb-4">
                <Link href="/marketplace" className="inline-flex items-center text-gray-600 hover:text-emerald-600 font-medium group transition-colors duration-200">
                    <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span>Volver al Marketplace</span>
                </Link>
            </div>

            {/* Hero section con información principal */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100  rounded-lg">
                <div className="container mx-auto py-10 px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Información del producto */}
                        <div className="flex-1">
                            <div className="flex items-center mb-2">
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                    {product.type === 'plugin' ? 'Plugin' : 'Plantilla'}
                                </span>
                                {product.isFeatured && (
                                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                        <StarIcon className="h-3 w-3 mr-1" />
                                        Destacado
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
                            {product.author && (
                                <p className="text-gray-600 mb-4">Por <span className="font-medium">{product.author}</span></p>
                            )}
                            <p className="text-gray-700 mb-6 max-w-2xl">
                                {product.shortDescription}
                            </p>
                        </div>

                        {/* Card de precio y compra */}
                        <div className="bg-white rounded-lg shadow-md p-6 md:w-72 flex flex-col">
                            <div className="mb-4">
                                <p className={`text-3xl font-bold ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
                                    {isFree ? 'Gratis' : `$${product.price}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {isFree ? 'Sin costo adicional' : 'Pago único'}
                                </p>
                            </div>

                            {!isButtonDisabled ? (
                                <Link href={buttonUrl} className="w-full">
                                    <button className="w-full inline-flex items-center justify-center bg-emerald-600 text-white px-5 py-3 rounded-md shadow-sm hover:bg-emerald-500 transition duration-200 font-medium">
                                        {isFree ? (
                                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        ) : (
                                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        )}
                                        {buttonText}
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    className="w-full inline-flex items-center justify-center bg-gray-200 text-gray-500 px-5 py-3 rounded-md cursor-not-allowed font-medium"
                                    disabled
                                >
                                    {buttonText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenido principal - Solo Video */}
                    <div className="lg:col-span-2">
                        {/* Video */}
                        {product.youtubeId && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                        <PlayIcon className="h-5 w-5 mr-2 text-emerald-500" />
                                        Video demostrativo
                                    </h2>
                                </div>
                                <div className="p-4">
                                    <div className="relative w-full h-0 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${product.youtubeId}`}
                                            title="Video demostrativo"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Información adicional */}
                    <div className="lg:col-span-1">
                        {/* Descripción - Ahora en la columna de información */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Descripción</h2>
                            </div>
                            <div className="p-6">
                                <div className="prose prose-emerald max-w-none">
                                    {product.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    ) : (
                                        <p>{product.shortDescription}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Características */}
                        {product.features && product.features.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800">Características</h2>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-3">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Información del desarrollador */}
                        {product.author && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800">Desarrollador</h2>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-3">
                                            {product.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.author}</p>
                                            <p className="text-sm text-gray-500">Desarrollador verificado</p>
                                        </div>
                                    </div>
                                    <Link href="https://wa.link/5se5ao" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
                                        Contactar al desarrollador
                                        <ArrowLeftIcon className="h-3 w-3 ml-1 rotate-180" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Información del producto */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Información</h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tipo</span>
                                        <span className="font-medium">{product.type === 'plugin' ? 'Plugin' : 'Plantilla'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Última actualización</span>
                                        <span className="font-medium">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Versión</span>
                                        <span className="font-medium">{product.version || '1.0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;