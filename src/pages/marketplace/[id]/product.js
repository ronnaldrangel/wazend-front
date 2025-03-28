import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiService';
import Image from 'next/image';
import Link from 'next/link';

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

    return (
        <div>
            Esto es {documentId}
        </div>
    );
};

export default Services;