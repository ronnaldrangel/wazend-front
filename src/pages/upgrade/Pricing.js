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
        <div className="mx-auto text-center py-6">
            <h2 className="text-4xl font-extrabold text-gray-900">Elige un plan adecuado para ti</h2>
            <p className="mt-4 text-lg text-gray-600">Selecciona el plan que mejor se adapte a tus necesidades y comienza hoy.</p>

            {/* Urgency and Special Offer Section */}
            <div className="mt-10 bg-yellow-100 p-4 rounded-md text-sm text-yellow-900 font-semibold">
                ¡Oferta por tiempo limitado! Obtén un 2 meses gratis de descuento en el plan anual si te suscribes en las próximas 24 horas. ¡No te lo pierdas!
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {plans.map((plan) => (
                    <div key={plan.id} className={`relative p-8 rounded-xl shadow-lg border ${plan.featured ? 'bg-gradient-to-b from-emerald-100 to-white' : 'bg-white'} transform hover:scale-105 transition-all duration-300`}>
                        {plan.featured && (
                            <span className="absolute top-4 right-4 px-4 py-2 text-sm bg-emerald-700 text-white font-semibold rounded-full shadow-lg">
                                Más popular
                            </span>
                        )}
                        <h3 className="text-3xl font-semibold text-gray-900">{plan.name}</h3>
                        <p className="mt-4 text-5xl font-bold text-emerald-700">{plan.price}</p>
                        <p className="mt-2 text-gray-600">{plan.description}</p>

                        <button
                            onClick={() => handleCheckout(plan.url)}
                            disabled={loading}
                            className={`mt-6 w-full py-3 rounded-md font-semibold text-white text-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50'}`}
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
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center">
                        <div className="w-10 h-10 border-4 border-t-emerald-600 border-gray-300 rounded-full animate-spin mx-auto" />
                        <p className="text-lg mt-4">Redirigiendo al checkout...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
