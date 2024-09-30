import Navbar from "../../components/navbar"
import Head from 'next/head';
import { UserCircleIcon, TrashIcon } from '@heroicons/react/24/solid'

import { useSession } from 'next-auth/react';

import Layout from '../../layout/dashboard';

export default function Profile() {

  const { data: session } = useSession();

  return (
    <>
      <Layout title="Perfil">
              {/* aca empieza el contenido */}
              <div className="space-y-10 divide-y divide-gray-900/10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Detalles</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Esta información se mostrará públicamente.
                    </p>
                  </div>

                  <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                            Nombre
                          </label>
                          <div className="mt-2">
                            {session && (
                              <span className="inline-flex items-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {session.user.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                            Correo electrónico
                          </label>
                          <div className="mt-2">
                            {session && (
                              <span className="inline-flex items-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {session.user.email}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">*Este campo no puede ser moficado.</p>
                        </div>

                        <div className="col-span-full">
                          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Foto
                          </label>
                          <div className="mt-2 flex items-center gap-x-3">
                            {session && (
                              <img src={session.user.image} className="h-12 w-12 rounded-full" />
                            )}
                            <a
                              href="https://myaccount.google.com/connections"
                              target="_blank"
                              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              Administrar en myaccount.google.com
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-red-600">Borrar cuenta</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Se eliminará sus suscripciones en curso y todos sus widgets, junto con todos los demás recursos que pertenecen a su cuenta. Esta acción no es reversible.</p>
                  </div>

                  <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">

                    <div className="px-4 py-6 sm:p-8">


                      <p className="block text-sm font-medium leading-6 text-gray-900 mb-3">¿Estas seguro de esto?</p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Si, borrar mi cuenta
                      </button>

                    </div>

                  </div>
                </div>
              </div>

              {/* aca acaba el contenido */}

      </Layout>
    </>
  )
}
