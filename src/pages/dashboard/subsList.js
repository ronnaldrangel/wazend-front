import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import InstanceCard from './instanceCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import Link from 'next/link';
import { format } from "date-fns";
import { PlusIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';


const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

const FetchStrapi = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate[subscriptions][populate]=instances` : null,
    (url) => fetcher(url, jwt)
  );

  // console.log(data);

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  if (!data) return <OrderSkeleton />;


  if (!data?.subscriptions?.length) {
    return <>
      <div className="bg-white rounded-xl px-6 py-10 text-center shadow-lg w-full mx-auto border border-gray-200 min-h-[400px] flex flex-col justify-center items-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          ¡Crea tu primera instancia en Wazend!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Comience contratando uno de nuestros planes.
        </p>
        <Link
          href="/upgrade/"
          className="mt-6 inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-white text-base font-medium shadow-md hover:bg-emerald-500 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          <span className="ml-3">Crea una instancia</span>
        </Link>
      </div>
    </>;
  }

  return (
    <div className="space-y-6">
      {data.subscriptions
        .sort((a, b) => (a.status_woo === "active" ? -1 : 1)) // Ordena los activos primero
        .map((sub, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {sub.status_woo === "active" ? (
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              )}
              Suscripción #{sub.id_woo}
            </h2>
  
            <p className="text-sm text-gray-600">
              Próximo pago:{" "}
              <span className="font-medium">
                {sub.next_payment_date_gmt
                  ? format(new Date(sub.next_payment_date_gmt), "dd/MM/yyyy")
                  : "Sin fecha"}
              </span>
            </p>
  
            {sub.instances?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {sub.instances.map((instance, idx) => (
                  <InstanceCard
                    key={idx}
                    instanceId={instance.instanceId}
                    instanceName={instance.instanceName}
                    isActive={true} // Puedes ajustar según la API
                    endDate={sub.next_payment_date_gmt}
                    serverUrl={instance.server_url}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Esta suscripción no tiene instancias asociadas.</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default FetchStrapi;
