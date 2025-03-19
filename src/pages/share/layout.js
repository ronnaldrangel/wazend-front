import React from 'react';
import Navbar from "./navbar";
import Biblia from "@/components/Bible"

export default function Layout({ children, title}) {
    return (
        <>
            <div className="min-h-full">

                {/* <ToggleMode /> */}
                <Navbar />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                    <Biblia />
                </div>

                <main>
                    <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

            </div>
        </>
    );
};
