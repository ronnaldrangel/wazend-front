import { useState, useCallback } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserCircleIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteButton from './delete-button';

const fetchInstanceData = async (url) => {
  try {
    // console.log(`🔍 Fetching instance data from: ${url}`);

    const response = await fetch(url, {
      headers: {
        apiKey: `${process.env.NEXT_PUBLIC_WAZEND_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('✅ Datos obtenidos de Wazend:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener datos de Wazend:', error);
    throw error;
  }
};

const InstanceCard = ({ documentId, instanceId, instanceName, serverUrl, isActive, isTrial }) => {
  const { data, error, isLoading, mutate } = useSWR(
    instanceId ? `${serverUrl}/instance/fetchInstances?instanceId=${instanceId}` : null,
    fetchInstanceData
  );

  const [isDeleting, setIsDeleting] = useState(false);

  const instance = data?.[0] || {};
  const [visibleKey, setVisibleKey] = useState(false);

  const toggleKeyVisibility = () => {
    setVisibleKey(!visibleKey);
  };

  const copyToClipboard = () => {
    if (instance.token) {
      navigator.clipboard.writeText(instance.token);
      toast.success('API Key copiada al portapapeles.');
    }
  };

  /**
    * Maneja la eliminación de una instancia
    */
  const handleDeleteInstance = useCallback(async (documentId) => {
    setIsDeleting(true);
    try {
      // Aquí iría la lógica de eliminación

      // Refrescar los datos después de eliminar
      await mutate();
    } catch (error) {
      console.error('Error al eliminar la instancia:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [mutate]);


  return (
    <Card className="flex flex-col gap-4" shadow="md" padding="md">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-bold">{instanceName}</p>

      </div>

      {/* API Key con íconos de ojo y copiar */}
      <div className="bg-muted p-3 rounded-sm flex items-center justify-between">
        <p className="text-foreground text-sm font-mono">
          {visibleKey ? instance.token : '********-****-****-****-************'}
        </p>
        <div className="flex space-x-4">
          <Button onClick={toggleKeyVisibility} variant="iconOnly" size="auto">
            {visibleKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </Button>
          <Button onClick={copyToClipboard} variant="iconOnly" size="auto">
            <ClipboardIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Datos de la instancia */}
      <div className="mt-6 group block flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              className="inline-block h-10 w-10 rounded-full bg-muted"
              src={instance.profilePicUrl || "/images/profile-wa.webp"}
              alt="WhatsApp"
              width={40}
              height={40}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Kcp"
            />
            <div className="ml-3">
              <p className="text-md font-semibold text-foreground">{instance.profileName || "Sin nombre"}</p>
              <p className="text-sm font-base text-muted-foreground">
                {instance.ownerJid ? instance.ownerJid.split('@')[0] : "-"}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <UserCircleIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-base text-muted-foreground">
                {instance._count?.Contact || 0}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ChatBubbleOvalLeftIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-base text-muted-foreground">
                {instance._count?.Message || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de conexión */}
      <div className="mt-4 flex justify-between items-center">
        <p
          className={`text-sm font-semibold px-3 py-1 rounded-2xl text-white ${instance.connectionStatus === "open"
            ? "bg-green-600"
            : instance.connectionStatus === "connecting"
              ? "bg-orange-500"
              : instance.connectionStatus === "close"
                ? "bg-red-600"
                : "bg-gray-600"
            }`}
        >
          {instance.connectionStatus === "open"
            ? "Conectado"
            : instance.connectionStatus === "connecting"
              ? "Conectando"
              : instance.connectionStatus === "close"
                ? "Desconectado"
                : "Desconectado"}
        </p>

        <div className='flex gap-x-2'>
          {/* Botón de ajustes con Link funcional */}
          {isActive ? (
            <Link href={isTrial ? `/instances/${documentId}?trial=true` : `/instances/${documentId}`} passHref>
              <button className="hover:shadow-lg transition-shadow duration-300 border border-border bg-card text-card-foreground px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
                <Cog6ToothIcon className="h-6 w-6" />
                <span>Ajustes</span>
              </button>
            </Link>
          ) : (
            <span></span>
          )}

          {!isTrial ? (
            <DeleteButton
              documentId={documentId}
              instanceName={instanceName}
              onDelete={() => handleDeleteInstance(documentId)}
              disabled={isDeleting}
              isTrial={isTrial}
            />
          ) : null}

        </div>

      </div>

    </Card>
  );
};

export default InstanceCard;
