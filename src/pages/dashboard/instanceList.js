import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import InstanceCard from './instanceCard';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = async (url, jwt) => {
  try {
    // console.log(`🔍 Fetching data from: ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('✅ Datos obtenidos de Strapi:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener datos de Strapi:', error);
    throw error;
  }
};

const FetchStrapi = () => {
  const { data: session } = useSession();
  const jwt = session?.jwt;

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate=subscriptions` : null,
    (url) => fetcher(url, jwt)
  );

  return (
    <>
      {isLoading && <OrderSkeleton/>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!isLoading && data?.subscriptions?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.subscriptions.map((sub, index) => (
            <InstanceCard key={index} instanceId={sub.instanceId} instanceName={sub.instanceName} isActive={sub.isActive} endDate={sub.endDate} />
          ))}
        </div>
      )}

      {!isLoading && data?.subscriptions?.length === 0 && <p>No hay suscripciones activas.</p>}
    </>
  );
};

export default FetchStrapi;
