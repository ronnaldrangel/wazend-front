import { useRouter } from 'next/router';
import Layout from '../../components/layout/dashboard';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

// Importación de íconos solo para la primera sección
import { EyeIcon, EyeSlashIcon, ClipboardIcon } from '@heroicons/react/24/outline';

const InstancePage = () => {
    const router = useRouter();
    const { id } = router.query; // Obtén el id de la ruta
    const { data: session } = useSession(); // Obtén la sesión actual

    const [isTokenVisible, setIsTokenVisible] = useState(false);
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [daysRemaining, setDaysRemaining] = useState(null); // Estado para los días restantes

    // Configura la función de fetch para SWR
    const fetcher = (url) =>
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${session?.jwt}`, // Usa el JWT de la sesión
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());

    // Usa SWR para hacer la solicitud de datos
    const { data, error } = useSWR(
        session && id ? `${strapiUrl}/api/subscriptions/${id}` : null,
        fetcher
    );

    // Calcula los días restantes una vez que tenemos los datos
    useEffect(() => {
        if (data && data.data) {
            const calculateDaysRemaining = () => {
                const currentDate = new Date();
                const endDate = new Date(data.data.endDate);
                const timeDifference = endDate - currentDate;
                const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                setDaysRemaining(daysDifference);
            };
            calculateDaysRemaining();
        }
    }, [data]);

    // Si ocurre un error o no hay datos, se muestra un mensaje de error en lugar de fallar
    if (error || !data || !data.data) return (
        <Layout title="Mi servicio" NoTab={true}>
            <p>Cargando...</p>
        </Layout>
    );

    const service = data.data;

    const handleCopy = () => {
        navigator.clipboard.writeText(service.password);
        toast.success('Copiado exitosamente.');
    };

    return (
        <Layout title="Mi servicio" NoTab={true}>
            <div className='space-y-8'>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Servicio #{service.id}</h1>


                {/* Seccion con Info */}
                <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
                    <div className='flex flex-col md:flex-row'>

                        {/* Servicio ID */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Servicio ID</h3>
                                <p className='mt-2 text-lg font-semibold text-green-600'>{service.id}</p>
                            </div>
                        </div>

                        {/* Producto */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Producto</h3>
                                <p className='mt-2 text-lg font-semibold text-green-600'>{service.type}</p>
                            </div>
                        </div>

                        {/* Plan */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Plan</h3>
                                <p className='mt-2 text-lg font-semibold text-green-600'>Plan {service.plan}</p>
                            </div>
                        </div>

                    </div>

                    <div className='flex flex-col md:flex-row'>

                        {/* Fecha de Creación */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Creado</h3>
                                <p className='mt-2 text-lg font-semibold text-green-600'>
                                    {new Date(service.startDate).toLocaleDateString({
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Fecha de Expiración */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Expira en</h3>
                                {/* <p className='mt-2 text-lg font-semibold text-green-600'>{service.endDate}</p> */}
                                <p className='mt-2 text-lg font-semibold text-green-600'>
                                    {daysRemaining !== null ? `${daysRemaining} día(s)` : 'Calculando...'}
                                </p>
                            </div>
                        </div>

                        {/* Ciclo de Facturación */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Ciclo de facturación</h3>
                                <p className='mt-2 text-lg font-semibold text-green-600'>{service.billingCycle}</p>
                            </div>
                        </div>

                    </div>
                </section>


                {/* sección con credenciales */}
                <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
                    <div className='flex flex-col md:flex-row'>

                        {/* Correo de acceso */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Correo de acceso</h3>
                                <p className='text-lg font-medium text-blue-500'>{service.email}</p>
                            </div>
                        </div>

                        {/* Contraseña de acceso */}
                        <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
                            <div className='flex-1 flex-col p-4'>
                                <h3 className='text-sm font-base'>Contraseña de acceso</h3>
                                <div className="flex items-center space-x-2">
                                    <p className='text-lg font-medium text-blue-500'>
                                        {isTokenVisible ? service.password : '••••••••••'}
                                    </p>
                                    <button onClick={() => setIsTokenVisible(!isTokenVisible)} className="focus:outline-none">
                                        {isTokenVisible ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-900" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-800" />
                                        )}
                                    </button>
                                    <button onClick={handleCopy} className="focus:outline-none">
                                        <ClipboardIcon className="h-5 w-5 text-gray-800" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                <section className='rounded-lg bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
                    <h2 className='mb-4 text-xl font-semibold'>Accede a tu servicio</h2>
                    <p className='mb-1'>Para acceder a tu servicio primero dale clic al botón de acceder.</p>
                    <p className='mb-8'>Después de eso, copia las credenciales que están en la parte superior.</p>

                    <div className="mt-6 flex flex-col md:flex-row md:justify-center md:space-x-2 space-y-2 md:space-y-0">

                        {/* Enlace Acceder al Servicio en color Emerald */}
                        <a href={`${service.url}`} target="_blank" rel="noopener noreferrer"
                            className="w-full md:w-1/2 flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-emerald-600 text-white px-6 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            Acceder
                        </a>

                        {/* Enlace Documentación */}
                        <a href="https://docs.wazend.net/" target="_blank" rel="noopener noreferrer"
                            className="w-full md:w-1/2 flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white text-slate-900 px-6 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            Documentación
                        </a>
                    </div>


                </section>

                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            </div>
        </Layout>
    );
};

export default InstancePage;
