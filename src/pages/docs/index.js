// pages/wazend-docs.js

import React from 'react';

import Navbar from "../../components/navbar";

const WazendDocsPage = () => {
    return (
        <div className="min-h-full">

            <Navbar />

            <header className="bg-white shadow-sm">

            </header>

            <main>
                <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
                    <iframe
                        src=""
                        style={{
                            width: '100%',
                            height: 'calc(100% - 50px)', // Ajusta la altura para dejar espacio para el encabezado
                            border: 'none',
                        }}
                        title="Wazend Documentation"
                    />
                </div>
            </main>

        </div>
    );
};

export default WazendDocsPage;
