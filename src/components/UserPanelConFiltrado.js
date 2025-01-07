import { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import NoOrders from './NoOrders';
import OrderSkeleton from './OrderSkeleton';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const UserSubscription = () => {
  const { data: session, status } = useSession();
  const [jwt, setJwt] = useState(null);

  const fetcher = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        console.error('Error al obtener los datos:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al realizar el fetch:', error);
      return null;
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const session = await getSession();
      if (session) {
        setJwt(session.jwt);
      }
    };

    getToken();
  }, []);

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate=subscriptions` : null,
    fetcher
  );

  if (status === 'loading' || isLoading) return <OrderSkeleton />;
  if (error || !data || !data.subscriptions) return <NoOrders />;

  // Filtrar las suscripciones de tipo "API"
  const filteredSubscriptions = data.subscriptions.filter(
    (subscription) => subscription.type === 'API'
  );

  if (filteredSubscriptions.length === 0) return <NoOrders />;

  return (
    <div>
      <ul className="space-y-4">
        {filteredSubscriptions.map((subscription) => (
          <li
            key={subscription.id}
            className="flex flex-col md:flex-row bg-white rounded-xl p-8 shadow-lg gap-4 md:items-center"
          >
            {/* Imagen oculta */}
            <div className="hidden">
              <Image
                src="/images/pattern-1.jpg"
                alt="Plan image"
                className="w-32 h-30 object-cover rounded-lg"
                width={118}
                height={89}
              />
            </div>

            {/* Detalles de la suscripción */}
            <div className="md:w-1/3 flex-grow">
              <p className="text-2xl font-bold">Wazend {subscription.type} (#{subscription.id})</p>
              <div className="flex flex-row items-center space-x-2 mt-1 text-gray-500">
                <div
                  className={`w-3 h-3 rounded-full ${
                    subscription.statusPlan === 'pending'
                      ? 'bg-yellow-500'
                      : subscription.statusPlan === 'active'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
                <p className="text-sm font-bold uppercase">PLAN {subscription.plan}</p>
                <p className="text-sm">
                  Expira el {new Date(subscription.endDate).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            {/* Botón de acción */}
            <div className="flex justify-end space-x-4">
              {new Date(subscription.endDate) >= new Date() ? (
                <Link href={`/instances/${subscription.instanceId}`} passHref>
                  <button
                    className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white text-slate-900 px-6 py-2 rounded-lg text-lg font-semibold shadow-md w-full md:w-auto flex items-center justify-center space-x-2"
                  >
                    <ArrowRightCircleIcon className="h-6 w-6" />
                    <span>Acceder</span>
                  </button>
                </Link>
              ) : (
                <span className="text-lg font-semibold text-red-500">
                  Tu servicio fue cancelado
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSubscription;