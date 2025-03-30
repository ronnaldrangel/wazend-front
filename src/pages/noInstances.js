import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import Modal from '../components/loaders/modal';
import NoInstances from './dashboard/noInstances';
import Link from 'next/link';
import { WindowIcon, GlobeAltIcon, PaperClipIcon } from '@heroicons/react/24/solid';
import OrderSkeleton from '../components/loaders/OrderSkeleton';

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
  const email = session?.user?.email; // Obtener el email del usuario autenticado
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate[subscriptions][populate]=instances` : null,
    (url) => fetcher(url, jwt)
  );

  useEffect(() => {
    if (data) {
      // Si data está disponible, no es necesario manejar el estado de expansión aquí
    }
  }, [data]);

  if (isLoading) return <OrderSkeleton />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data) return <OrderSkeleton />;

  if (!data?.subscriptions?.length) {
    return <NoInstances />;
  }

  const services = [
    {
      name: "INSTANCIAS",
      description: "Administra y configura tus instancias de WhatsApp",
      buttonText: "GESTIONAR",
      buttonUrl: "/dashboard", // Ajusta esta URL según sea necesario
      icon: <WindowIcon className="w-6 h-6 text-emerald-600" />,
    },
    {
      name: "MARKETPLACE",
      description: "Las mejores plantillas y complementos de la comunidad Wazend.",
      buttonText: "IR AHORA",
      buttonUrl: "/marketplace", // Ajusta esta URL según sea necesario
      icon: <GlobeAltIcon className="w-6 h-6 text-emerald-600" />,
    },
    {
      name: "DOCUMENTACIÓN",
      description: "Empieza con nuestros documentos y guías a continuación.",
      buttonText: "APRENDE MÁS",
      buttonUrl: "https://docs.wazend.net/wazend", // Ajusta esta URL según sea necesario
      icon: <PaperClipIcon className="w-6 h-6 text-emerald-600" />,
    }
  ];

  return (
    <div className="mx-auto">
      <h1 className="text-xl font-semibold mb-4">Mis instancias y servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col bg-white rounded-lg shadow-md p-6 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex justify-center items-center mr-4">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-700">{service.name}</h2>
            </div>
            <p className="text-gray-600">{service.description}</p>
            <Link href={service.buttonUrl} className="bg-white mt-2 w-full text-center rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm border border-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              {service.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchStrapi;
