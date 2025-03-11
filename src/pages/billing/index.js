import { useState } from 'react';
import Layout from '../../components/layout/dashboard';
import Billing from './billing';
import Subscription from './subscriptions';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Index() {
    const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' es el valor inicial

    return (
        <Layout>

            <div className="flex bg-gray-200 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab("subscriptions")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "subscriptions"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700"
                        }`}
                >
                    Suscripciones
                </button>
                <button
                    onClick={() => setActiveTab("billing")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "billing"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700"
                        }`}
                >
                    Historial de pagos
                </button>
            </div>

            {/* Content */}
            <div className="mt-4">
                {activeTab === 'subscriptions' ? <Subscription /> : <Billing />}
            </div>


            <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">¿Quieres gestionar tus suscripciones?</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Accede al panel de suscripciones para gestionar tus métodos de pago y mantener todo bajo control de manera sencilla y eficiente.
                </p>
                <a
                    href="https://wazend.net/my-account/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md  transition-all shadow-sm"
                >
                    Ir a gestionar suscripciones
                </a>
            </div>


        </Layout>
    );
}
