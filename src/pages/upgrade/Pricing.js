import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckIcon } from '@heroicons/react/20/solid';

const plans = [
    {
        name: 'Pago mensual',
        id: '7737',
        price: '$15.9/mes',
        description: 'Facturación cada 30 días',
        features: [
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        url: 'https://wazend.net/plan-api-mensual/',
        featured: false,
    },
    {
        name: 'Pago anual',
        id: '8565',
        price: '$159/año',
        description: 'Facturación cada 365 días',
        features: [
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        url: 'https://wazend.net/plan-api-anual/',
        featured: true,
    },
];

export default function Pricing() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCheckout = (url) => {
        if (!email) {
            alert('Debes iniciar sesión para continuar.');
            return;
        }
        setLoading(true);
        setShowModal(true);
        setTimeout(() => {
            setLoading(false);
            setShowModal(false);
            window.location.href = `${url}?billing_email=${encodeURIComponent(email)}`;
        }, 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900">Elige un plan</h2>
            <p className="mt-3 text-lg text-gray-600">Encuentra el plan adecuado para ti</p>
            
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                {plans.map((plan) => (
                    <div key={plan.id} className={`p-8 rounded-xl shadow-lg border ${plan.featured ? 'bg-gradient-to-b from-emerald-100 to-white' : 'bg-white'}`}>
                        <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                        <p className="mt-4 text-4xl font-bold text-emerald-700">{plan.price}</p>
                        <p className="mt-2 text-gray-600">{plan.description}</p>
                        
                        <button
                            onClick={() => handleCheckout(plan.url)}
                            disabled={loading}
                            className={`mt-6 w-full py-3 rounded-md font-semibold text-white text-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-600'}`}
                        >
                            {loading ? 'Cargando...' : 'Seleccionar plan'}
                        </button>
                        
                        <ul className="mt-6 space-y-3 text-left text-gray-900">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-x-3">
                                    <CheckIcon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-center items-center">
                            <div className="w-10 h-10 border-4 border-t-emerald-600 border-gray-300 rounded-full animate-spin" />
                        </div>
                        <p className="text-center mt-4">Redirigiendo al checkout...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
