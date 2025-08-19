import Image from 'next/image';
import { ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

// Componente para mostrar una lista de grupos obtenidos desde una fuente externa
export default function Index({ groupList, loading, documentId }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    // Mostrar mensaje de carga mientras los datos aún no han sido cargados
    if (loading) {
        return <div className="text-center py-10">Cargando grupos...</div>;
    }

    // Asegurar que groupList no sea undefined
    const safeGroupList = groupList || [];

    // Filtrar los grupos para excluir aquellos que tengan isCommunity o announce en true
    const filteredGroups = safeGroupList
        .filter(item => !item.isCommunity && !item.announce)
        // Ordenar los grupos por timestamp de creación de forma descendente (más reciente primero)
        .sort((a, b) => b.creation - a.creation);

    // Función para copiar el ID del grupo al portapapeles
    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        toast.success('ID copiado al portapapeles: ' + id);
    };

    // Función para convertir timestamp a formato de fecha
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };

    // Enviar petición POST al webhook con el documentId usando variable de entorno
    const handleRefreshGroups = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_UPDATE_GROUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ documentId }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            toast.success('Grupos actualizados correctamente');
            window.location.reload();
        } catch (error) {
            console.error('Error al actualizar grupos:', error);
            toast.error('Error al actualizar grupos');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            {/* Botón para actualizar la lista de grupos */}
            <div className="flex justify-end mb-4">
                <Button
                    onClick={handleRefreshGroups}
                    disabled={isUpdating}
                    variant="default"
                    className="flex items-center gap-2"
                >
                    <ArrowPathIcon className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    {isUpdating ? 'Actualizando...' : 'Actualizar grupos'}
                </Button>
            </div>

            {/* Mostrar mensaje si la lista filtrada está vacía o no definida */}
            {filteredGroups.length === 0 && (
                <div className="text-center py-10">No hay grupos disponibles.</div>
            )}

            {/* Contenedor de los elementos usando grid para una visualización responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Iteración sobre la lista de grupos filtrados y ordenados */}
                {filteredGroups.map((item, index) => (
                    <div
                        key={index}
                        className="bg-card border border-border shadow rounded-lg p-6 transition-shadow duration-200"
                    >
                        {/* Mostrar el ID del grupo con icono de copiar */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                            <span className="line-clamp-1">ID: {item.id}</span>
                            <ClipboardIcon
                                onClick={() => copyToClipboard(item.id)}
                                className="h-5 w-5 cursor-pointer hover:text-foreground"
                            />
                        </div>
                        <div className="flex items-center mb-2">
                            {/* Mostrar imagen del grupo si está disponible, de lo contrario una letra inicial */}
                            {item.pictureUrl ? (
                                <Image
                                    src={item.pictureUrl}
                                    alt={item.subject}
                                    width={200}
                                    height={100}
                                    className="h-10 w-10 mr-4 object-cover rounded"
                                />
                            ) : (
                                <div className="h-10 w-10 mr-4 bg-muted rounded flex items-center justify-center">
                                    <span className="text-xl font-bold text-muted-foreground">
                                        {item.subject[0]}
                                    </span>
                                </div>
                            )}
                            <div>
                                {/* Mostrar nombre del grupo */}
                                <h3 className="text-base font-semibold">{item.subject}</h3>
                                {/* Mostrar fecha de creación */}
                                <p className="text-xs text-muted-foreground">Creado: {formatDate(item.creation)}</p>
                            </div>
                        </div>
                        <hr className="border-t border-border mb-4" />
                        {/* Descripción del grupo, si existe */}
                        {item.desc && <p className="text-sm text-muted-foreground line-clamp-3">{item.desc}</p>}
                    </div>
                ))}
            </div>
        </>
    );
}