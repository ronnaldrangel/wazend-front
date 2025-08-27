import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FormInput from '@/components/ui/form-input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Preload from '@/components/loaders/skeleton';
import { Button } from '@/components/ui/button';
import ErrorAlert from '@/components/alerts/ErrorAlert';

const API_KEY = process.env.NEXT_PUBLIC_WAZEND_API_KEY;

const settingDescriptions = {
    rejectCall: { title: 'Rechazar llamadas', description: 'Rechaza automáticamente las llamadas entrantes.' },
    groupsIgnore: { title: 'Ignorar grupos', description: 'Ignora mensajes y notificaciones de chats grupales.' },
    alwaysOnline: { title: 'Siempre en línea', description: 'Mantiene el estado de la cuenta como "en línea" todo el tiempo.' },
    readMessages: { title: 'Leer mensajes automáticamente', description: 'Marca los mensajes como leídos automáticamente al recibirlos.' },
    readStatus: { title: 'Leer estados automáticamente', description: 'Ve automáticamente los estados de los contactos sin necesidad de abrirlos.' },
    syncFullHistory: { title: 'Sincronizar historial completo', description: 'Sincroniza todo el historial de mensajes en la cuenta.' },
    msgCall: { title: 'Mensaje de rechazo', description: 'Mensaje personalizado al rechazar llamadas.' }
};

const fetcher = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': API_KEY,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

const InstancePage = ({ instanceId, serverUrl }) => {
    const { data, error } = useSWR(`${serverUrl}/settings/find/${instanceId}`, fetcher);

    const [settings, setSettings] = useState({
        rejectCall: false,
        groupsIgnore: false,
        alwaysOnline: false,
        readMessages: false,
        readStatus: false,
        syncFullHistory: false,
        msgCall: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setSettings({
                rejectCall: data.rejectCall,
                groupsIgnore: data.groupsIgnore,
                alwaysOnline: data.alwaysOnline,
                readMessages: data.readMessages,
                msgCall: data.msgCall || '',
            });
        }
    }, [data]);

    const updateSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${serverUrl}/settings/set/${instanceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': API_KEY,
                },
                body: JSON.stringify({ ...settings, readStatus: false, syncFullHistory: false }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Configuración guardada correctamente');
            } else {
                toast.error('Error al guardar la configuración.');
            }
        } catch (error) {
            toast.error('Error al guardar la configuración.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInputChange = (e) => {
        setSettings((prev) => ({ ...prev, msgCall: e.target.value }));
    };

    if (error) return <ErrorAlert title="Error al cargar configuraciones" message={error.message || 'Ha ocurrido un error inesperado'} />;
    if (!data) return  <Preload />;

    return (
        <>
            <Card shadow="custom" padding="md" className="border border-border shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                <div className="space-y-4">

                <p className='mb-4 text-lg font-semibold'>Ajustes de WhatsApp</p>
                    {/* Rechazar llamadas con el campo de mensaje justo debajo */}
                    <div className="py-3 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-foreground">{settingDescriptions.rejectCall.title}</p>
                                <p className="text-muted-foreground text-sm">{settingDescriptions.rejectCall.description}</p>
                            </div>
                            <Switch
                                checked={settings.rejectCall}
                                onCheckedChange={() => toggleSetting('rejectCall')}
                            />
                        </div>

                        {/* Cuadro de texto debajo cuando está activo */}
                        {settings.rejectCall && (
                            <div className="mt-2">
                                <FormInput
                                    type="text"
                                    value={settings.msgCall}
                                    onChange={handleInputChange}
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Otras configuraciones */}
                    {Object.entries(settings).map(([key, value]) => (
                        key !== 'rejectCall' && key !== 'msgCall' && (
                            <div key={key} className="flex justify-between items-center py-3 border-b">
                                <div>
                                    <p className="font-semibold text-foreground">{settingDescriptions[key]?.title}</p>
                                    <p className="text-muted-foreground text-sm">{settingDescriptions[key]?.description}</p>
                                </div>
                                <Switch
                                    checked={value}
                                    onCheckedChange={() => toggleSetting(key)}
                                />
                            </div>
                        )
                    ))}
                </div>

                <Button
                    onClick={updateSettings}
                    disabled={isLoading}
                    className={`mt-4 ${isLoading ? 'cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </Card>

        </>
    );
};

export default InstancePage;
