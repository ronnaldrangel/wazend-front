import React from 'react';
import Biblia from "@/components/layout/bible"
import { Disclosure } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; // Importación del ícono

export default function Layout({ children, isReseller, resellerName }) {
    return (
        <div className="min-h-full">

            {/* <ToggleMode /> */}
            <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-100 dark:bg-gray-900 dark:border-gray-700">
                {() => (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Condición para mostrar el logo, ícono y nombre del reseller, o un mensaje de carga */}
                            <div className="flex flex-shrink-0 items-center">
                                {/* Verificamos si isReseller está disponible */}
                                {isReseller === undefined ? (
                                    <span className="text-lg font-semibold">Cargando...</span>
                                ) : (
                                    isReseller ? (
                                        // Si esReseller es true, mostramos el ícono y nombre del reseller
                                        resellerName ? (
                                            <div className="flex items-center space-x-2">
                                                <ChatBubbleLeftIcon className="h-8 w-8 text-emerald-600" />
                                                <span className="text-lg font-semibold">{resellerName}</span>
                                            </div>
                                        ) : (
                                            // Si el nombre del reseller aún no está disponible, mostramos "Cargando..."
                                            <div className="flex items-center space-x-2">
                                                <ChatBubbleLeftIcon className="h-8 w-8 text-emerald-600" />
                                                <span className="text-lg font-semibold">Cargando...</span>
                                            </div>
                                        )
                                    ) : (
                                        // Si isReseller es false, mostramos el logo
                                        <Image
                                            className="block h-8 w-auto"
                                            src="/images/icon-dark.svg"
                                            alt="Wazend Logo"
                                            width={236}
                                            height={60}
                                        />
                                    )
                                )}
                            </div>

                            {/* Texto a la derecha con fondo verde y bordes redondeados */}
                            <div className="flex items-center">
                                <span className="bg-green-700 text-white font-semibold px-4 py-1 rounded-full text-sm">
                                    Tu Instancia
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Disclosure>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                <Biblia />
            </div>

            <main>
                <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

        </div>
    );
};
