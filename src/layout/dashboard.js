// components/Layout.js

import React from 'react';
import Navbar from "../components/navbar"

export default function Layout({ children, title }) {
    return (
        <>
            <div className="min-h-screen">

                <Navbar />

                <header className="bg-white shadow">
                    {/* <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                    </div> */}
                </header>
                <main>
                    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                    </div>
                    <div className="mx-auto max-w-7xl py-0 px-4 sm:px-6 lg:px-8">{children}</div>
                </main>


            </div>
        </>
    );
};

