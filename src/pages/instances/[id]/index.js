import { useState } from 'react';
import { useRouter } from 'next/router';
import { CommandLineIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, Cog6ToothIcon, DocumentTextIcon, SignalIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/dashboard';
import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiServiceId';
import { toast } from 'sonner';

// Importación de los componentes de cada sección
import Dashboard from './dashboard';
import Config from './config';
import Proxy from './proxy';
import Integrations from './integrations';

export default function Profile() {
    const { query } = useRouter();
    const documentId = query.id || ''; // Evitar undefined inicial
    console.log("Document ID:", documentId);

    // Estado para la data cargada
    const [instanceData, setInstanceData] = useState(null);
    const [activeComponent, setActiveComponent] = useState('Dashboard');

    // Estado para manejar el modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, error, isLoading } = useStrapiData(`instances/${documentId}`);
    const instance = data?.data || {}; // Asegurar que siempre sea un objeto

    if (isLoading) {
        return <Layout><Loader /></Layout>;
    }

    if (error) {
        return (
            <Layout>
                <div className="text-red-600 dark:text-red-400">
                    Error al cargar los datos: {error.message}
                </div>
            </Layout>
        );
    }

    if (!instanceData && Object.keys(instance).length > 0) {
        console.log("Raw API Response:", data);
        setInstanceData(instance);
        console.log("Instance Data Loaded:", instance);
    }

    // Lista de botones con información de cada uno
    const menuItems = [
        { name: 'Dashboard', icon: UserCircleIcon, component: 'Dashboard' },
        { name: 'Configuraciones', icon: Cog6ToothIcon, component: 'Config' },
        { name: 'Proxy', icon: SignalIcon, component: 'Proxy' },
        { name: 'Integraciones', icon: CommandLineIcon, component: 'Integrations' },
        { name: 'Documentación', icon: DocumentTextIcon, path: `https://docs.wazend.net/wazend`, external: true },
    ];

    // Función para copiar el enlace al portapapeles
    const copyToClipboard = () => {
        const shareUrl = `https://app.wazend.net/share/${documentId}`; // Construir la URL de compartir
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success('Copiado exitosamente.');
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    };    

    // Renderiza el componente activo
    const renderComponent = () => {
        if (!instanceData) return <Loader />;

        console.log("Passing instanceId to Component:", instanceData.instanceId);
        switch (activeComponent) {
            case 'Dashboard':
                return <Dashboard instanceId={instanceData.instanceId} serverUrl={instanceData.server_url} />;
            case 'Config':
                return <Config instanceId={instanceData.instanceName} serverUrl={instanceData.server_url}/>;
            case 'Proxy':
                return <Proxy instanceId={instanceData.instanceName} serverUrl={instanceData.server_url}/>;
            case 'Integrations':
                return <Integrations instanceId={instanceData.instanceName} serverUrl={instanceData.server_url}/>;
            default:
                return <Dashboard instanceId={instanceData.instanceId} serverUrl={instanceData.server_url} />;
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/5">
                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            item.external ? (
                                <a key={item.name} href={item.path} target="_blank" rel="noopener noreferrer"
                                    className="w-full px-2 py-2.5 text-left text-sm font-medium rounded-md flex items-center gap-x-2 transition-colors duration-200 ease-in-out border-l-0 text-gray-700 hover:bg-gray-200 hover:underline border-transparent">
                                    <item.icon className="h-5 w-5 text-gray-700" strokeWidth="2" />
                                    {item.name}
                                </a>
                            ) : (
                                <button key={item.name} onClick={() => setActiveComponent(item.component)}
                                    className={`w-full px-2 py-2.5 text-left text-sm font-medium rounded-md flex items-center gap-x-2 transition-colors duration-200 ease-in-out border-l-0 ${activeComponent === item.component
                                        ? 'bg-gray-300 text-emerald-700 border-emerald-700'
                                        : 'text-gray-700 hover:bg-gray-200 hover:underline border-transparent'
                                        }`}>
                                    <item.icon className={`h-5 w-5 ${activeComponent === item.component ? 'text-emerald-700' : 'text-gray-700'}`} strokeWidth="2" />
                                    {item.name}
                                </button>
                            )
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-4/5">
                    {/* Botón "Compartir instancia" */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-6 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Compartir instancia
                    </button>


                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h3 className="text-xl font-semibold mb-4">Enlace para compartir</h3>
                                <input
                                    type="text"
                                    value={`https://app.wazend.net/share/${documentId}`}
                                    readOnly
                                    className="w-full p-2 border rounded-md mb-4"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out">
                                    Copiar enlace
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full px-6 py-3 mt-4 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out">
                                    Cerrar
                                </button>

                            </div>
                        </div>
                    )}

                    <div className="rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{activeComponent}</h2>
                    </div>
                    {renderComponent()}
                </div>
            </div>
        </Layout>
    );
}
