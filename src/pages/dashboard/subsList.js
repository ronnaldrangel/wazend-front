import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import InstanceCard from './instanceCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import Link from 'next/link';
import { format } from "date-fns";
import { PlusIcon } from '@heroicons/react/24/solid';
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

const FetchStrapi = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;
  const email = session?.user?.email;
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {loading && <Modal message="Creando instancia, por favor espera..." />}
      {data.subscriptions
        .sort((a, b) => {
          if (a.status_woo === "active" && b.status_woo !== "active") return -1;
          if (a.status_woo !== "active" && b.status_woo === "active") return 1;
          return a.id_woo - b.id_woo;
        })
        .map((sub, index) => (
          <div key={index} className="pb-0">
            <div className="p-4 bg-white rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {sub.status_woo === "active" ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                  ) : sub.status_woo === "on-hold" ? (
                    <ExclamationCircleIcon className="w-6 h-6 text-orange-500" />
                  ) : sub.status_woo === "pending" ? (
                    <ClockIcon className="w-6 h-6 text-yellow-500" />
                  ) : sub.status_woo === "cancelled" ? (
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  ) : sub.status_woo === "pending-cancel" ? (
                    <XCircleIcon className="w-6 h-6 text-gray-500" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                  )}
                  <span>Suscripción #{sub.id_woo}</span>
                </div>
              </h2>

              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-sm text-gray-600">
                    Estado: <span className={`font-medium ${sub.status_woo === "active" ? "text-emerald-600" :
                      sub.status_woo === "on-hold" ? "text-orange-500" :
                        sub.status_woo === "pending" ? "text-yellow-500" :
                          sub.status_woo === "cancelled" ? "text-red-600" :
                            sub.status_woo === "pending-cancel" ? "text-gray-500" :
                              "text-red-500"
                      }`}>{getStatusText(sub.status_woo)}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Instancias: <span className="font-medium">{sub.instances?.length || 0}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Próximo pago:{" "}
                  <span className="font-medium">
                    {sub.next_payment_date_gmt
                      ? format(new Date(sub.next_payment_date_gmt), "dd/MM/yyyy")
                      : "Sin fecha"}
                  </span>
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
                      isActive={true}
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