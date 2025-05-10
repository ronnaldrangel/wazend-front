import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Spin from '@/components/loaders/spin';
import Modal from '@/components/loaders/modal';

export default function MyAccount() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCheckout = async () => {
        if (!email) {
            toast.error('Debes iniciar sesión para continuar.');
            return;
        }

        setLoading(true);
        setShowModal(true);

        try {
            const response = await fetch(
                'https://wazend.net/wp-json/magic-login/v1/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'Basic ZGV2b3A6WXp3dyBBaXJtIE9NdTIgNjFZRyBNYzAzIFdGS1Y=',
                    },
                    body: JSON.stringify({
                        user: email,
                        send: false,
                        redirect_to: `https://wazend.net/my-account/`,
                    }),
                }
            );

            const data = await response.json();

            if (data?.link) {
                window.location.href = data.link;
            } else {
                toast.error('No tienes compras recientes.');
            }
        } catch (error) {
            console.error('Error al realizar el post:', error);
            toast.error('No tienes compras recientes.');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col space-y-4 py-4">
                    <div className="flex justify-center">
                        <CreditCardIcon
                            className="h-12 w-12 text-gray-400"
                            aria-hidden="true"
                        />
                    </div>

                    <h2 className="text-lg font-medium text-gray-900 text-center">
                        ¿Quieres gestionar tus suscripciones?
                    </h2>

                    <p className="text-gray-500 max-w-md mx-auto text-center text-sm">
                        Accede al panel de suscripciones para gestionar tus métodos de pago y
                        mantener todo bajo control de manera sencilla y eficiente.
                    </p>

                    <div className="pt-2 flex justify-center">
                        <Button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="inline-flex items-center justify-center px-5 py-3 text-white text-sm font-medium transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <Spin className="mr-2" /> Cargando
                                </>
                            ) : (
                                <>
                                    Ir al panel de facturación
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {showModal && (
                <Modal message="Redirigiendo al panel..."></Modal>
            )}
        </div>
    );
}
