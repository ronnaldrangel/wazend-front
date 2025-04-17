import Layout from '@/components/layout/dashboard';
import React from 'react';
import { useRouter } from 'next/router';
import SubsList from '../pages/dashboard/subsList';
import Bulletin from './dashboard/bulletin';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Tus instancias">

      {/* <div className="mx-auto mb-10">
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
        </div> */}


      <div className="flex flex-col space-y-10">
        <SubsList />
        {/* <Bulletin /> */}
      </div>


    </Layout>
  );
};

