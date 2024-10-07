import React from 'react';
import { useSession } from 'next-auth/react';
import { TrashIcon } from '@heroicons/react/24/solid';

import ProfileLayout from './ProfileLayout';


export default function General() {
  const { data: session } = useSession();

  return (
    <>
      <ProfileLayout>
        <div className="w-full md:w-3/4 grid gap-y-4">
          {/* Formulario */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
            <div className="grid gap-y-6">
              <p className="block text-md font-semibold leading-6 text-gray-900">Detalles</p>

              {/* Nombre */}
              <div>
                <label htmlFor="website" className="block text-xs font-semibold leading-6 text-gray-900">
                  Nombre
                </label>
                <div className="mt-1">
                  {session && (
                    <span className="inline-flex items-center rounded-sm bg-gray-100 px-4 py-2 text-sm font-base text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {session.user.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Correo electrónico */}
              <div>
                <label htmlFor="about" className="block text-xs font-semibold leading-6 text-gray-900">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  {session && (
                    <span className="inline-flex items-center rounded-sm bg-gray-100 px-4 py-2 text-sm font-base text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {session.user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de eliminación */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-6">
            <p className="block text-md font-semibold leading-6 text-gray-900 mb-2">¿Estás seguro de esto?</p>
            <p className="block text-sm font-base leading-6 text-gray-900 mb-6">
              Wazend eliminará sus suscripciones actuales y todos sus proyectos, junto con todas sus implementaciones, configuraciones y todos los demás recursos pertenecientes a su cuenta personal. Esta acción no es reversible.
            </p>
            <button
              type="button"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=51924079147&text=Hola%2C%20quiero%20eliminar%20mi%20cuenta%20de%20Wazend.', '_blank')}
              className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Sí, borrar mi cuenta
            </button>
          </div>

        </div>
      </ProfileLayout>
    </>
  );
};

