import { useState } from 'react';
import { useRouter } from 'next/router';
import { CommandLineIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, Cog6ToothIcon, DocumentTextIcon, SignalIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/dashboard';
import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiServiceId';

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

    // Renderiza el componente activo
    const renderComponent = () => {
        if (!instanceData) return <Loader />;

        console.log("Passing instanceId to Component:", instanceData.instanceId);
        switch (activeComponent) {
            case 'Dashboard':
                return <Dashboard instanceId={instanceData.instanceId} serverUrl={instanceData.server_url} />;
            case 'Config':
                return <Config instanceId={instanceData.instanceName} />;
            case 'Proxy':
                return <Proxy instanceId={instanceData.instanceName} />;
            case 'Integrations':
                return <Integrations instanceId={instanceData.instanceId} />;
            default:
                return <Dashboard instanceId={instanceData.instanceId} />;
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
                    <div className="rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{activeComponent}</h2>
                    </div>
                    {renderComponent()}
                </div>
            </div>
        </Layout>
    );
}
