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
                    <span>{f.trim()}</span>
                </li>
            ));
        } else if (Array.isArray(features)) {
            return features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                    <span>{typeof f === 'string' ? f : f.text || ''}</span>
                </li>
            ));
        }
        return [];
    };

    return (
        <div className="max-w-7xl mx-auto">

            {/* Selector de período */}
            <div className="flex mb-8">

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strapiPlans.map(plan => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">

                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                        </div>

                        <ul className="space-y-2 text-md">
                            {plan.features && renderFeatures(plan.features)}
                        </ul>

                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                {/* <p className="text-gray-500 text-sm">Desde</p> */}
                                <p className="text-emerald-600 font-bold text-lg">${plan.price} USD</p>
                                <p className="text-gray-500 text-sm">{plan.billing_period === 'Monthly' ? 'Mensual' : 'Anual'}</p>
                            </div>

                            <Button
                                onClick={() => handleCheckout(plan.woo_id)}
                                disabled={loading}
                                className="text-base px-4"
                            >
                                Pedir Ahora
                            </Button>
                        </div>


                    </div>
                ))}
            </div>

            {showModal && (
                <Modal message="Redirigiendo al checkout..."></Modal>
            )}
        </div>
    );
}
