import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckIcon } from '@heroicons/react/20/solid';

const plans = [
    {
        name: 'Pago mensual',
        woo_id: '7737',
        price: '$15.9/mes',
        description: 'Facturación cada 30 días',
        features: [
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        featured: false,
    },
    {
        name: 'Pago anual',
        woo_id: '8565',
        price: '$159/año',
        description: 'Facturación cada 365 días',
        features: [
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        featured: true,
    },
];

export default function Pricing() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCheckout = async (woo_id) => {
        if (!email) {
            alert('Debes iniciar sesión para continuar.');
            return;
        }
        
        setLoading(true);
        setShowModal(true);
        
        try {
            // Hacer el POST request al endpoint con autorización en el encabezado
            const response = await fetch('https://wazend.net/wp-json/magic-login/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ZGV2b3A6WXp3dyBBaXJtIE9NdTIgNjFZRyBNYzAzIFdGS1Y=', // Autorización
                },
                body: JSON.stringify({
                    user: email,
                    send: false,
                    redirect_to: `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`,
                }),
            });

            const data = await response.json();

            if (data?.link) {
                // Redirigir al usuario al link proporcionado en la respuesta
                window.location.href = data.link;
            } else {
                // Si no hay link en la respuesta, redirigir al checkout directamente
                window.location.href = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`;
            }
        } catch (error) {
            console.error('Error al realizar el post:', error);
            // Si ocurre un error, redirigir al checkout directamente
            window.location.href = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`;
        } finally {
            setLoading(false);
            setShowModal(false);
        }
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
                    <div key={plan.woo_id} className={`relative p-8 rounded-xl shadow-lg border ${plan.featured ? 'bg-gradient-to-b from-emerald-100 to-white' : 'bg-white'} transform hover:scale-105 transition-all duration-300`}>
                        {plan.featured && (
                            <span className="absolute top-4 right-4 px-4 py-2 text-sm bg-emerald-700 text-white font-semibold rounded-full shadow-lg">
                                Más popular
                            </span>
                        )}
                        <h3 className="text-3xl font-semibold text-gray-900">{plan.name}</h3>
                        <p className="mt-4 text-5xl font-bold text-emerald-700">{plan.price}</p>
                        <p className="mt-2 text-gray-600">{plan.description}</p>

                        <button
                            onClick={() => handleCheckout(plan.woo_id)}
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
