import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckIcon } from '@heroicons/react/20/solid';

const plans = [
    {
        name: 'Basico',
        imageUrl: 'https://minio-app.wazend.net/strapi/Recurso_2_073883635c.svg', // Reemplaza con la ruta correcta
        price: '$15',
        period: '/mes',
        currency: 'Dólar estadounidense',
        features: [
            '1 Instancia de WhatsApp',
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        woo_id: '7737',
    },
    {
        name: 'Pro',
        imageUrl: 'https://minio-app.wazend.net/strapi/Recurso_1_1_d150b732bf.svg', // Reemplaza con la ruta correcta
        price: '$59',
        period: '/mes',
        currency: 'Dólar estadounidense',
        features: [
            '5 Instancia de WhatsApp',
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        woo_id: '11284',
    },
    {
        name: 'Enterprise',
        imageUrl: 'https://minio-app.wazend.net/strapi/Recurso_1_98dcf3b23d.svg', // Reemplaza con la ruta correcta
        price: '$199',
        period: '/mes',
        currency: 'Dólar estadounidense',
        features: [
            '20 Instancia de WhatsApp',
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        woo_id: '11287',
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
            const response = await fetch('https://wazend.net/wp-json/magic-login/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ZGV2b3A6WXp3dyBBaXJtIE9NdTIgNjFZRyBNYzAzIFdGS1Y=',
                },
                body: JSON.stringify({
                    user: email,
                    send: false,
                    redirect_to: `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`,
                }),
            });

            const data = await response.json();

            if (data?.link) {
                window.location.href = data.link;
            } else {
                window.location.href = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`;
            }
        } catch (error) {
            console.error('Error al realizar el post:', error);
            window.location.href = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`;
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900">Elige un plan para <span className="text-teal-700">continuar</span></h2>
                <p className="mt-4 text-lg text-gray-600">¡Elige el plan que mejor se adapte a tus necesidades!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.name} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <img 
                                src={plan.imageUrl} 
                                alt={`${plan.name} icon`} 
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-lg">{plan.period}</span>
                            </div>
                            <p className="text-sm text-gray-600">{plan.currency}</p>
                        </div>
                        
                        <button
                            onClick={() => handleCheckout(plan.woo_id)}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-teal-700 text-white rounded-md font-medium mb-6 hover:bg-teal-800 transition-colors"
                        >
                            Comprar ahora
                        </button>
                        
                        <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
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
