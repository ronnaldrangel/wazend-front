import React from 'react';
import Navbar from "../navbar";
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/20/solid';
import WhatsAppButton from "../../components/WhatsAppButton";
import Biblia from "../Bible"
import ToggleMode from "../ui/toggle-mode"


export default function Layout({ children, title, showButton }) {
    return (
        <>
            <div className="min-h-full">

                {/* <ToggleMode /> */}
                <Navbar />

                {title && (
                    <header className="bg-white shadow-sm">
                        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                            {/* {showButton && ( */}
                                <Link
                                    href="/upgrade/" // Usamos Link en lugar de a
                                    className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                >
                                    <PlusIcon className="h-6 w-auto" aria-hidden="true" />
                                    <span className="ml-2 hidden sm:block text-base font-medium">Contratar servicio</span>
                                </Link>
                            {/* )} */}
                        </div>
                    </header>
                )}

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                    <Biblia />
                </div>

                <main>
                    <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                    <WhatsAppButton />
                </main>

            </div>
        </>
    );
};
