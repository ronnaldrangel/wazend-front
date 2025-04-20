import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, ServerIcon } from '@heroicons/react/24/outline';

import InstanceCard from '../dashboard/instanceCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import CreateButton from './CreateButton';
import DeleteButton from './DeleteButton';

// Constantes y configuración
const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Función para realizar peticiones a la API de Strapi
 */
const fetchFromStrapi = async (url, jwt) => {
  if (!jwt) return null;
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error en la solicitud: ${response.status} - ${errorBody || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos de Strapi:', error);
    throw error;
  }
};

/**
 * Componente para calcular y mostrar días restantes
 */
const ExpirationBadge = ({ endDate }) => {
  const endDateTime = new Date(endDate);
  const today = new Date();
  const diffTime = endDateTime - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const getStatusColor = () => {
    if (diffDays <= 1) return 'bg-red-100 text-red-800';
    if (diffDays <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className={`rounded-t-lg ${getStatusColor()} p-4 mb-6`}>
      <div className="flex items-center font-medium text-sm">
        <ClockIcon className="h-5 w-5 mr-2" />
        {diffDays <= 1 ? (
          <span>¡Tu instancia expira <strong>mañana</strong>!</span>
        ) : (
          <span>Tu instancia expira en <strong>{diffDays} días</strong> ({endDateTime.toLocaleDateString('es-PE')})</span>
        )}
      </div>
    </div>
  );
};

/**
 * Componente de información sobre la instancia de prueba
 */
const TrialInfoCard = () => (
  <div className="rounded-lg shadow-md bg-blue-50 text-blue-900 p-6">
    <div className="flex items-center font-bold text-lg mb-3">
      <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2" />
      Información sobre su instancia de prueba
    </div>

    <ul className="space-y-2 text-sm">
      <li className="flex items-start">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
        <span>La instancia de prueba tiene una duración limitada.</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
        <span>No se requiere tarjeta de crédito o débito para la prueba.</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
        <span>La instancia puede ser eliminada por abuso según nuestros términos de servicio.</span>
      </li>
      <li className="flex items-start">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
        <span>Límite de uso: 10 acciones o solicitudes cada 5 minutos.</span>
      </li>
    </ul>
  </div>
);

/**
 * Componente principal para mostrar y gestionar instancias de prueba
 */
const FreeTrialDashboard = () => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data, error, isLoading, mutate } = useSWR(
    session?.jwt ? `${STRAPI_URL}/api/users/me?populate=freetrials` : null,
    url => fetchFromStrapi(url, session?.jwt),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // Refresca cada 30 segundos
    }
  );

  /**
   * Callback que se ejecuta cuando se crea una instancia exitosamente
   */
  const handleInstanceCreated = useCallback(async () => {
    // Refrescar los datos sin necesidad de recargar la página
    await mutate();
  }, [mutate]);

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

  // Maneja el estado de carga
  if (isLoading) return <OrderSkeleton />;

  // Maneja errores
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 border border-red-200">
        <div className="flex items-center text-red-700 mb-2">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <h3 className="font-bold">Error al cargar las instancias</h3>
        </div>
        <p className="text-sm text-red-600">{error.message}</p>
        <button 
          onClick={() => mutate()} 
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // Si no hay datos disponibles
  if (!data) return <OrderSkeleton />;

  const hasInstances = data?.freetrials?.length > 0;

  return (
    <div className="space-y-6">
      {hasInstances ? (
        <div className="space-y-6">
          {data.freetrials.map((trial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Barra de estado de expiración */}
              <ExpirationBadge endDate={trial.endDate} />
              
              {/* Detalles de la instancia */}
              <InstanceCard
                serverUrl={trial.server_url}
                documentId={trial.documentId}
                instanceId={trial.instanceId}
                instanceName={trial.instanceName}
                isActive={trial.isActive}
                isTrial={true}
              />
              
              {/* Acciones disponibles */}
              {/* <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
                <DeleteButton 
                  documentId={trial.documentId} 
                  instanceName={trial.instanceName}
                  onDelete={() => handleDeleteInstance(trial.documentId)}
                  disabled={isDeleting}
                />
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <ServerIcon className="h-16 w-16 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No tiene instancias activas</h3>
            <p className="text-gray-500 max-w-md">
              Puede crear una instancia de prueba gratuita para comenzar a utilizar nuestro servicio.
            </p>
            <CreateButton onSuccess={handleInstanceCreated} />
          </div>
        </div>
      )}

      {/* Información sobre la prueba gratuita */}
      <div className="mt-4">
        <TrialInfoCard />
      </div>
    </div>
  );
};

export default FreeTrialDashboard;