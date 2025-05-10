const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const createInstanceUrl = process.env.NEXT_PUBLIC_CREATE_INSTANCE; import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import InstanceCard from './instanceCard';
import OrderSkeleton from '../../components/loaders/skeleton';
import Link from 'next/link';
import { format } from "date-fns";
import { PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import Modal from '../../components/loaders/modal';
import NoInstances from './noInstances';
import { ClockIcon, ServerIcon } from '@heroicons/react/24/outline';

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

const handleCreateInstance = async (subscriptionId, email, mutate, setCreatingInstanceForSubscription) => {
  setCreatingInstanceForSubscription(subscriptionId);

  try {
    const response = await fetch(createInstanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId: subscriptionId, email }),
    });

    if (!response.ok) {
      throw new Error(`❌ Error al crear la instancia: ${response.statusText}`);
    }

    const result = await response.json();
    toast.success('Instancia creada correctamente');
    console.log('Respuesta del servidor:', result);

    // Actualizar los datos sin recargar la página
    mutate();

    // Añadir un retardo pequeño antes de habilitar el botón nuevamente
    setTimeout(() => {
      setCreatingInstanceForSubscription(null);
    }, 2000);

  } catch (error) {
    toast.error('Error de conexión');
    console.error('❌ Error:', error);
    setCreatingInstanceForSubscription(null);
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

const getBillingPeriodText = (period) => {
  const periodMap = {
    "month": "Mensual",
    "year": "Anual"
  };

  return periodMap[period] || period;
};

const FetchStrapi = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;
  const email = session?.user?.email;
  const [showCancelled, setShowCancelled] = useState(false);
  const [creatingInstanceForSubscription, setCreatingInstanceForSubscription] = useState(null);

  const { data, error, isLoading, mutate } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate[subscriptions][populate]=instances` : null,
    (url) => fetcher(url, jwt)
  );

  if (isLoading) return <OrderSkeleton />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data) return <OrderSkeleton />;

  if (!data?.subscriptions?.length) {
    return <NoInstances />;
  }

  // Filtrar para mostrar solo suscripciones activas o todas las suscripciones
  const filteredSubscriptions = showCancelled
    ? data.subscriptions
    : data.subscriptions.filter(sub => sub.status_woo === "active");

  return (
    <div className="space-y-6">

      {/* Filtro para mostrar/ocultar suscripciones canceladas */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filtros</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar todas</span>
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

              <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-3">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-md border ${getStatusColor(sub.status_woo)}`}>
                  {getStatusIcon(sub.status_woo)}
                  <span className="text-sm font-medium">{getStatusText(sub.status_woo)}</span>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    Próximo pago:{" "}
                    <span>
                      {sub.next_payment_date_gmt
                        ? format(new Date(sub.next_payment_date_gmt), "dd/MM/yyyy")
                        : "Sin fecha"}{" "}
                      ({getBillingPeriodText(sub.billing_period)})
                    </span>
                  </div>
                </div>
              </div>


              <h2 className="text-lg font-semibold text-gray-800 mt-1">
                {sub.product_name || "Wazend API"} (#{sub.id_woo})
              </h2>

              <div className="mt-2">
                <div className="text-sm text-gray-600">
                  <p>Instancias: <span className="font-medium">{sub.instances?.length || 0} / {sub.instances_limit || "∞"}</span></p>
                </div>
              </div>
            </div>

            <div className="mt-4 mb-8">
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sub.instances?.map((instance, idx) => (
                    <InstanceCard
                      key={idx}
                      documentId={instance.documentId}
                      instanceId={instance.instanceId}
                      instanceName={instance.instanceName}
                      serverUrl={instance.server_url}
                      isActive={true}
                    />
                  ))}

                  {/* Tarjeta para crear nueva instancia */}
                  {sub.status_woo === "active" && (!sub.instances_limit || (sub.instances?.length || 0) < sub.instances_limit) && (
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center space-y-4 py-6">

                      <ServerIcon className="h-16 w-16 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">No tiene instancias activas</h3>

                      <p className="text-gray-500 max-w-md">
                        Puede crear una instancia para comenzar a utilizar nuestro servicio.
                      </p>

                      <button
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={() => handleCreateInstance(sub.id, email, mutate, setCreatingInstanceForSubscription)}
                        disabled={creatingInstanceForSubscription === sub.id}
                      >
                        {creatingInstanceForSubscription === sub.id ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creando...</span>
                          </>
                        ) : (
                          <span>Crear instancia</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mensaje cuando no hay instancias */}
                {/* {sub.instances?.length === 0 && (
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Esta suscripción no tiene instancias asociadas.
                  </p>
                )} */}

                {/* Mensaje de límite alcanzado */}
                {sub.status_woo === "active" && sub.instances_limit && sub.instances?.length >= sub.instances_limit && (
                  <p className="mt-2 text-sm text-amber-600 font-medium text-center">
                    Límite de instancias alcanzado. Contacte con soporte para aumentar su plan.
                  </p>
                )}

                {/* Mensaje cuando la suscripción no está activa */}
                {sub.instances?.length === 0 && sub.status_woo !== "active" && (
                  <p className="mt-2 text-sm text-gray-600 font-medium text-center">
                    No se pueden crear instancias con una suscripción {getStatusText(sub.status_woo).toLowerCase()}.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FetchStrapi;