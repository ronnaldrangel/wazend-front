import { useSession } from 'next-auth/react';
import Layout from '../components/layout/dashboard';
import Link from 'next/link';
import { ChevronRightIcon, GlobeAltIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import Bulletin from './bulletin';

export default function Example() {
  const { data: session } = useSession();
  const email = session?.user?.email || '';
  const checkoutUrl = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=9390&aero-qty=1&billing_email=${encodeURIComponent(email)}`;

  const services = [
    {
      name: "INSTANCIAS",
      description: "Administra y configura tus instancias de WhatsApp",
      buttonText: "GESTIONAR",
      buttonUrl: "/dashboard", // Ajusta esta URL según sea necesario
      icon: <ChevronRightIcon className="w-6 h-6 text-emerald-600" />,
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
    <>
      <Layout title="Inicio">

        <div className="mx-auto mb-10">
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

        <Bulletin />

      </Layout>
    </>
  );
}
