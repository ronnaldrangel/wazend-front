import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import InstanceCard from './instanceCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import Link from 'next/link';
import { format } from "date-fns";
import { PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import { useState } from 'react';
import Modal from '../../components/loaders/modal';
import NoInstances from './noInstances';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const createInstanceUrl = process.env.NEXT_PUBLIC_CREATE_INSTANCE;

const fetcher = async (url, jwt) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la solicitud: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener datos de Strapi:', error);
    throw error;
  }
};

const handleCreateInstance = async (documentId, email, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(createInstanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId, email }),
    });

    if (!response.ok) {
      throw new Error(`❌ Error al crear la instancia: ${response.statusText}`);
    }

    const result = await response.json();
    toast.success('Instancia creada correctamente');
    console.log('Respuesta del servidor:', result);
    window.location.reload();
  } catch (error) {
    toast.error('Error de conexión');
    console.error('❌ Error:', error);
  } finally {
    setLoading(false);
  }
};

const getStatusText = (status) => {
  const statusMap = {
    "active": "Activa",
    "on-hold": "En espera",
    "pending": "Pendiente",
    "cancelled": "Cancelada",
    "pending-cancel": "Cancelación pendiente"
  };

  return statusMap[status] || status;
};

const getStatusColor = (status) => {
  const colorMap = {
    "active": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "on-hold": "bg-orange-100 text-orange-800 border-orange-200",
    "pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "cancelled": "bg-red-100 text-red-800 border-red-200",
    "pending-cancel": "bg-gray-100 text-gray-800 border-gray-200"
  };

  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getStatusIcon = (status) => {
  switch (status) {
    case "active":
      return <CheckCircleIcon className="w-4 h-4" />;
    case "on-hold":
      return <ExclamationCircleIcon className="w-4 h-4" />;
    case "pending":
      return <ClockIcon className="w-4 h-4" />;
    case "cancelled":
    case "pending-cancel":
      return <XCircleIcon className="w-4 h-4" />;
    default:
      return <XCircleIcon className="w-4 h-4" />;
  }
};

const FetchStrapi = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;
  const email = session?.user?.email;
  const [loading, setLoading] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate[subscriptions][populate]=instances` : null,
    (url) => fetcher(url, jwt)
  );

  if (isLoading) return <OrderSkeleton />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data) return <OrderSkeleton />;

  if (!data?.subscriptions?.length) {
    return <NoInstances />;
  }
  
  // Filtrar suscripciones canceladas si showCancelled es false
  const filteredSubscriptions = showCancelled 
    ? data.subscriptions 
    : data.subscriptions.filter(sub => 
        sub.status_woo !== "cancelled" && sub.status_woo !== "pending-cancel"
      );

  return (
    <div className="space-y-6">
      {loading && <Modal message="Creando instancia, por favor espera..." />}
      
      {/* Filtro para mostrar/ocultar suscripciones canceladas */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filtros</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar canceladas</span>
          <button 
            onClick={() => setShowCancelled(!showCancelled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${showCancelled ? 'bg-emerald-600' : 'bg-gray-200'}`}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showCancelled ? 'translate-x-6' : 'translate-x-1'}`} 
            />
          </button>
        </div>
      </div>
      
      {filteredSubscriptions
        .sort((a, b) => {
          if (a.status_woo === "active" && b.status_woo !== "active") return -1;
          if (a.status_woo !== "active" && b.status_woo === "active") return 1;
          return a.id_woo - b.id_woo;
        })
        .map((sub, index) => (
          <div key={index} className="pb-0">
            <div className="p-4 bg-white rounded-lg shadow-md mb-6 relative overflow-hidden">
              {/* Etiqueta de estado en la parte superior */}
              <div className="flex justify-between items-start mb-3">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-md border ${getStatusColor(sub.status_woo)}`}>
                  {getStatusIcon(sub.status_woo)}
                  <span className="text-sm font-medium">{getStatusText(sub.status_woo)}</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Próximo pago:{" "}
                  <span>
                    {sub.next_payment_date_gmt
                      ? format(new Date(sub.next_payment_date_gmt), "dd/MM/yyyy")
                      : "Sin fecha"}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mt-1">
                Suscripción #{sub.id_woo}
              </h2>

              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Instancias: <span className="font-medium">{sub.instances?.length || 0}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 mb-8">
              {sub.instances?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sub.instances.map((instance, idx) => (
                    <InstanceCard
                      key={idx}
                      documentId={instance.documentId}
                      instanceId={instance.instanceId}
                      instanceName={instance.instanceName}
                      serverUrl={instance.server_url}
                      isActive={instance.isActive}
                    />
                  ))}
                </div>
              ) : sub.status_woo === "active" ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Esta suscripción no tiene instancias asociadas.
                  </p>
                  <button
                    className="mt-4 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md transform transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-95 flex items-center justify-center gap-2"
                    onClick={() => handleCreateInstance(sub.id, email, setLoading)}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Crear instancia
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Esta suscripción no tiene instancias asociadas.
                </p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default FetchStrapi;