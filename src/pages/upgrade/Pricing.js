import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useStrapiData } from '../../services/strapiService';
import Loader from '../../components/loaders/skeleton';

export default function Pricing() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activePeriod, setActivePeriod] = useState('Monthly'); // Estado para controlar el período activo
    
    // Obtenemos los planes desde Strapi
    const { data: strapiPlansRaw, error, isLoading } = useStrapiData('products?populate=*');
    
    // Filtramos y ordenamos los planes por tipo de facturación y precio
    const strapiPlans = strapiPlansRaw 
        ? [...strapiPlansRaw]
            .filter(plan => plan.billing_period === activePeriod)
            .sort((a, b) => a.price - b.price)
        : [];
    
    // Planes mensuales y anuales para calcular si hay disponibles
    const monthlyPlans = strapiPlansRaw?.filter(plan => plan.billing_period === 'Monthly') || [];
    const yearlyPlans = strapiPlansRaw?.filter(plan => plan.billing_period === 'Yearly') || [];
    
    console.log('Planes de Strapi filtrados por período:', strapiPlans);
    
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

    // Mostrar loader mientras se cargan los datos
    if (isLoading) {
        return <Loader />;
    }

    // Mostrar mensaje de error si hay un problema al cargar los datos
    if (error) {
        return (
            <div className="text-red-600 dark:text-red-400">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    // Función para renderizar las características del plan de manera segura
    const renderFeatures = (features) => {
        // Si es un string, lo dividimos por comas
        if (typeof features === 'string') {
            return features.split(',').map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                    <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature.trim()}</span>
                </li>
            ));
        }
        // Si es un array, mapeamos cada elemento
        else if (Array.isArray(features)) {
            return features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                    <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{typeof feature === 'string' ? feature : feature.text || ''}</span>
                </li>
            ));
        }
        // Si no es ninguno, devolvemos un array vacío
        return [];
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900">Elige un plan para <span className="text-teal-700">continuar</span></h2>
                <p className="mt-4 text-lg text-gray-600">¡Elige el plan que mejor se adapte a tus necesidades!</p>
                
                {/* Selector de período de facturación - Ajustado para fondo #f3f4f6 */}
                <div className="flex justify-center mt-8">
                    <div className="inline-flex p-1.5 bg-white rounded-full shadow-md border border-gray-200">
                        <button 
                            onClick={() => setActivePeriod('Monthly')}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                activePeriod === 'Monthly' 
                                    ? 'bg-teal-600 text-white shadow-sm' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            disabled={monthlyPlans.length === 0}
                        >
                            Mensual
                        </button>
                        <button 
                            onClick={() => setActivePeriod('Yearly')}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                activePeriod === 'Yearly' 
                                    ? 'bg-teal-600 text-white shadow-sm' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            disabled={yearlyPlans.length === 0}
                        >
                            Anual
                        </button>
                    </div>
                </div>
                
                {/* Badge de ahorro para planes anuales */}
                {activePeriod === 'Yearly' && (
                    <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Ahorra 2 meses con facturación anual
                        </span>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {strapiPlans && strapiPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <img 
                                src={plan.image?.url || 'https://placeholder.com/40'} 
                                alt={`${plan.name} icon`} 
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-lg">
                                    {plan.billing_period === 'Monthly' ? '/mes' : '/año'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">Dólar estadounidense</p>
                        </div>
                        
                        <button
                            onClick={() => handleCheckout(plan.woo_id)}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-teal-700 text-white rounded-md font-medium mb-6 hover:bg-teal-800 transition-colors"
                        >
                            Elegir plan
                        </button>
                        
                        <ul className="space-y-3">
                            {plan.features && renderFeatures(plan.features)}
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