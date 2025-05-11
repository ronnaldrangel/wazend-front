import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useStrapiData } from '@/services/strapiService';
import Loader from '@/components/loaders/skeleton';
import { Button } from '@/components/ui/button';
import Modal from '@/components/loaders/modal';

export default function Pricing() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activePeriod, setActivePeriod] = useState('Monthly');

    const { data: strapiPlansRaw, error, isLoading } = useStrapiData('products?populate=*');
    const strapiPlans = strapiPlansRaw
        ? [...strapiPlansRaw]
            .filter(plan => plan.billing_period === activePeriod)
            .sort((a, b) => a.price - b.price)
        : [];
    const monthlyPlans = strapiPlansRaw?.filter(plan => plan.billing_period === 'Monthly') || [];
    const yearlyPlans = strapiPlansRaw?.filter(plan => plan.billing_period === 'Yearly') || [];

    const handleCheckout = async (woo_id) => {
        if (!email) {
            alert('Debes iniciar sesión para continuar.');
            return;
        }
        setLoading(true);
        setShowModal(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'https://wazend.net'}/wp-json/magic-login/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ZGV2b3A6WXp3dyBBaXJtIE9NdTIgNjFZRyBNYzAzIFdGS1Y=',
                },
                body: JSON.stringify({
                    user: email,
                    send: false,
                    redirect_to: `${process.env.NEXT_PUBLIC_URL || 'https://wazend.net'}/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`,
                }),
            });
            const data = await res.json();
            window.location.href = data?.link || `${process.env.NEXT_PUBLIC_URL || 'https://wazend.net'}/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`;
        } catch {
            window.location.href = `${process.env.NEXT_PUBLIC_URL || 'https://wazend.net'}/checkouts/checkout/?aero-add-to-checkout=${woo_id}&aero-qty=1&billing_email=${encodeURIComponent(email)}`;
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div className="text-red-600 dark:text-red-400">Error al cargar los datos: {error.message}</div>;

    const renderFeatures = (features) => {
        if (typeof features === 'string') {
            return features.split(',').map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{f.trim()}</span>
                </li>
            ));
        } else if (Array.isArray(features)) {
            return features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{typeof f === 'string' ? f : f.text || ''}</span>
                </li>
            ));
        }
        return [];
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900">
                    Elige un plan para{' '}
                    <span className="text-[hsl(var(--primary))]">continuar</span>
                </h2>
                <p className="mt-4 text-base text-gray-600">¡Elige el plan que mejor se adapte a tus necesidades!</p>

                {/* Selector de período */}
                <div className="flex justify-center mt-8">
                    <div className="inline-flex p-1.5 bg-white rounded-full shadow-md border border-gray-200">
                        <Button
                            variant={activePeriod === 'Monthly' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-full px-6 py-2.5 text-sm font-medium"
                            onClick={() => setActivePeriod('Monthly')}
                            disabled={monthlyPlans.length === 0}
                        >
                            Mensual
                        </Button>
                        <Button
                            variant={activePeriod === 'Yearly' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-full px-6 py-2.5 text-sm font-medium"
                            onClick={() => setActivePeriod('Yearly')}
                            disabled={yearlyPlans.length === 0}
                        >
                            Anual
                        </Button>
                    </div>
                </div>

                {activePeriod === 'Yearly' && (
                    <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <CheckIcon className="mr-1.5 h-3 w-3 flex-shrink-0" />
                            Ahorra 2 meses con facturación anual
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {strapiPlans.map(plan => (
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
                        <Button
                            onClick={() => handleCheckout(plan.woo_id)}
                            disabled={loading}
                            className="w-full mb-6"
                        >
                            Elegir plan
                        </Button>
                        <ul className="space-y-2 text-sm">
                            {plan.features && renderFeatures(plan.features)}
                        </ul>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal message="Redirigiendo al checkout..."></Modal>
            )}
        </div>
    );
}
