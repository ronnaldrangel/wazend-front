import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import {
  UserCircleIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import DeleteButton from '../dashboard/DeleteButton';

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
  const { data, error, isLoading } = useSWR(
    instanceId ? `${serverUrl}/instance/fetchInstances?instanceId=${instanceId}` : null,
    fetchInstanceData
  );

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

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-6 gap-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-bold">{instanceName}</p>

      </div>

      {/* API Key con íconos de ojo y copiar */}
      <div className="bg-gray-200 p-3 rounded-sm flex items-center justify-between">
        <p className="text-black text-sm font-mono">
          {visibleKey ? instance.token : '********-****-****-****-************'}
        </p>
        <div className="flex space-x-4">
          <button onClick={toggleKeyVisibility} className="text-gray-500 hover:text-gray-700">
            {visibleKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          <button onClick={copyToClipboard} className="text-gray-500 hover:text-gray-700">
            <ClipboardIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Datos de la instancia */}
      <div className="mt-6 group block flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img className="inline-block h-10 w-10 rounded-full bg-gray-200"
              src={instance.profilePicUrl || "/images/WAPP.webp"}
              alt="WhatsApp"
            />
            <div className="ml-3">
              <p className="text-md font-semibold text-black">{instance.profileName || "Sin nombre"}</p>
              <p className="text-sm font-base text-gray-500">
                {instance.ownerJid ? instance.ownerJid.split('@')[0] : "-"}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
              <p className="text-sm font-base text-gray-600">
                {instance._count?.Contact || 0}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-600" />
              <p className="text-sm font-base text-gray-600">
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
            <Link href={isTrial ? `/trial/${documentId}` : `/instances/${documentId}`} passHref>
              <button className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-base font-semibold shadow-md flex items-center justify-center space-x-2">
                <Cog6ToothIcon className="h-6 w-6" />
                <span>Ajustes</span>
              </button>
            </Link>
          ) : (
            <span className="text-base font-semibold bg-red-500 text-white px-6 py-2 rounded-lg">Tu servicio expiro.</span>
          )}


          {/* <DeleteButton
            documentId={documentId}
            instanceName={instanceName}
            onDelete={() => handleDeleteInstance(documentId)}
          /> */}

        </div>

      </div>

    </div>
  );
};

export default InstanceCard;
