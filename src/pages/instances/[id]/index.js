// Importación de los componentes de cada sección
import Dashboard from './dashboard';
import Config from './config';
import Proxy from './proxy';
import Integrations from './integrations';
import Group from './group';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CommandLineIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, Cog6ToothIcon, DocumentTextIcon, SignalIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/dashboard';
import Loader from '@/components/loaders/OrderSkeleton';
import { useStrapiData } from '@/services/strapiServiceId';
import { toast } from 'sonner';
import { PaperAirplaneIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

export default function Profile() {
    const { query } = useRouter();
    const documentId = query.id || ''; // Evitar undefined inicial
    console.log("Document ID:", documentId);

    // Estado para la data cargada
    const [instanceData, setInstanceData] = useState(null);
    const [activeComponent, setActiveComponent] = useState('Dashboard');

    // Estado para manejar el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resellerName, setResellerName] = useState(''); // Nombre del reseller
    const [isReseller, setIsReseller] = useState(false); // Estado del modo reseller

    const { data, error, isLoading } = useStrapiData(`instances/${documentId}`);
    const instance = data?.data || {}; // Asegurar que siempre sea un objeto

    useEffect(() => {
        if (instance && instance.isReseller !== undefined) {
            setIsReseller(instance.isReseller); // Actualizar el estado al valor de la API
        }
        if (instance && instance.resellerName) {
            setResellerName(instance.resellerName); // Asegurar que el nombre del reseller se cargue al inicializar
        }
    }, [instance]); // Se ejecuta cada vez que la instancia cambia

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

    // Establecer las variables de estado de acuerdo con la data
    const isResellerMode = instance.isReseller; // Establecer si es reseller
    const resellerNameFromInstance = instance.resellerName; // Establecer el nombre del reseller

    // Lista de botones con información de cada uno
    const menuItems = [
        { name: 'Dashboard', icon: UserCircleIcon, component: 'Dashboard' },
        { name: 'Configuraciones', icon: Cog6ToothIcon, component: 'Config' },
        { name: 'Proxy', icon: SignalIcon, component: 'Proxy' },
        { name: 'Grupos', icon: UserGroupIcon, component: 'Grupos' },
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

    // Función para realizar la actualización PUT en Strapi
    const saveSettings = async () => {
        const updatedData = {
            data: {
                isReseller, // Estado del modo reseller
                resellerName, // Nombre del reseller
            }
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instances/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // API Key en los headers
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                toast.success('Configuración guardada');
                setIsModalOpen(false); // Cerrar el modal después de guardar
            } else {
                toast.error('Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error al actualizar Strapi:', error);
            toast.error('Error al guardar la configuración');
        }
    };

    // Renderiza el componente activo
    const renderComponent = () => {
        if (!instanceData) return <Loader />;

        console.log("Passing instanceId to Component:", instanceData.instanceId);
        switch (activeComponent) {
            case 'Dashboard':
                return <Dashboard instanceId={instanceData.instanceId} serverUrl={instanceData.server_url} />;
            case 'Config':
                return <Config instanceId={instanceData.instanceName} serverUrl={instanceData.server_url} />;
            case 'Proxy':
                return <Proxy instanceId={instanceData.instanceName} serverUrl={instanceData.server_url} />;
            case 'Integrations':
                return <Integrations instanceId={instanceData.instanceName} serverUrl={instanceData.server_url} />;
            case 'Grupos':
                return <Group groupList={instanceData.groupList} documentId={instanceData.documentId} />;
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
                        className="mb-6 inline-flex items-center px-4 py-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-md text-sm font-medium shadow-sm hover:shadow transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                    >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                        Compartir instancia
                    </button>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h3 className="text-xl font-semibold mb-4">Enlace para compartir</h3>
                                <div className="flex items-center mb-4">
                                    <input
                                        type="text"
                                        value={`https://app.wazend.net/share/${documentId}`}
                                        readOnly
                                        className="w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="ml-2 p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                    >
                                        <ClipboardIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mt-4 mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Modo Reseller</label>
                                    <Switch
                                        checked={isReseller}
                                        onChange={setIsReseller}
                                        className={`${isReseller ? 'bg-emerald-600' : 'bg-gray-300'}
                                            relative inline-flex items-center h-6 rounded-full w-11`}
                                    >
                                        <span
                                            className={`${isReseller ? 'translate-x-6' : 'translate-x-1'}
                                                inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
                                        />
                                    </Switch>
                                </div>

                                {isReseller && (
                                    <div className="mt-4 mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Reseller</label>
                                        <input
                                            type="text"
                                            value={resellerName}  // Asegúrate de que esté vinculado al estado correcto
                                            onChange={(e) => setResellerName(e.target.value)}  // Maneja el cambio de valor
                                            className="w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>
                                )}

                                {/* Botones en dos columnas */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={saveSettings}
                                        className="w-full px-6 py-3 bg-emerald-600 text-white text-md font-medium rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out">
                                        Guardar
                                    </button>

                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full px-6 py-3 bg-white text-gray-600 text-md font-medium border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors duration-200 ease-in-out">
                                        Cerrar
                                    </button>
                                </div>
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
