import { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import useSWR from 'swr';
//import NoOrders from '../NoOrders';
import OrderSkeleton from '../OrderSkeleton';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

import Link from 'next/link';
import NoInstances from './NoTrialInstances';

import MessageTrial from './MessageTrial';

const UserSubscription = () => {
  const { data: session, status } = useSession();
  const [jwt, setJwt] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetcher = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  useEffect(() => {
    const getTokenAndUserId = async () => {
      const session = await getSession();
      if (session) {
        setJwt(session.jwt);
        try {
          const response = await fetch(`${strapiUrl}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${session.jwt}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUserId(userData.id);
          } else {
            console.error('Error fetching user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    getTokenAndUserId();
  }, []);

  const { data, error, isLoading } = useSWR(jwt ? `${strapiUrl}/api/users/me?populate=freetrials` : null, fetcher);

  // Log the data to the console to inspect the response structure
  //console.log("API Response Data:", data);

  if (status === 'loading' || isLoading || error || !data || !data.freetrials) return <OrderSkeleton />;
  if (data.freetrials.length === 0) return <NoInstances />;

  return (
    <div>
      <ul className="space-y-4">
        {data.freetrials.map((order) => (
          <li key={order.id} className="flex flex-col md:flex-row bg-white rounded-xl p-8 shadow-lg gap-4 md:items-center ">
            {/* First Part: Image */}
            <div className="hidden">
              <Image
                src='/images/pattern-1.jpg'
                alt="Plan image"
                className="w-32 h-30 object-cover rounded-lg"
                width={118}
                height={89}
              />
            </div>

            {/* Second Part: Plan Content and Date */}
            <div className="md:w-1/3 flex-grow">
              <Link href={`/instances/${order.instanceId}`} passHref>
                <div className="flex-row items-center space-x-2 text-emerald-600 inline-flex">
                  <p className="text-lg font-semibold hover:underline">Wazend-API</p>
                  <ArrowTopRightOnSquareIcon className='h-4 w-4 text-emerald-700' />
                </div>
              </Link>
              <p className="text-2xl font-bold">{order.instanceId}</p>
              <div className="flex flex-row items-center space-x-2 mt-1 text-gray-500">
                <div className={`w-3 h-3 rounded-full ${new Date(order.endDate) < new Date()
                  ? 'bg-red-500'
                  : 'bg-blue-500'
                  }`} />
                <p className="text-sm font-bold uppercase">
                  {new Date(order.endDate) < new Date() ? 'Cancelado' : 'Free Trial'}
                </p>
                <p className="text-sm">Expira el {new Date(order.endDate).toLocaleDateString()}</p>
              </div>
            </div>




            {/* Third Part: Button */}
            <div className="justify-end ">
              {new Date(order.endDate) >= new Date() ? (
                <Link href={`/instances/${order.instanceId}`} passHref>
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

      <div className='mt-8'>
        <MessageTrial />
      </div>
    </div>
  );
};

export default UserSubscription;
