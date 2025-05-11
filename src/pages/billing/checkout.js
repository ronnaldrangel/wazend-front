import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Spin from '@/components/loaders/spin';
import Modal from '@/components/loaders/modal';

const CheckoutButton = ({
    buttonText = 'Ir al panel de facturación',
    redirectUrl = '/my-account/'
}) => {
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
                `${process.env.NEXT_PUBLIC_URL || 'https://wazend.net'}/wp-json/magic-login/v1/token`,
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
                        redirect_to: `${process.env.NEXT_PUBLIC_URL || 'https://wazend.net'}${redirectUrl}`,
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
        <>
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
                        {buttonText}
                    </>
                )}
            </Button>

            {showModal && <Modal message="Redirigiendo..." />}
        </>
    );
};

export default CheckoutButton;