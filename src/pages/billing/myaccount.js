import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function MyAccount() {
    const { data: session } = useSession();
    const email = session?.user?.email || '';
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCheckout = async () => {
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
                    redirect_to: `https://wazend.net/my-account/`,
                }),
            });

            const data = await response.json();

            if (data?.link) {
                window.location.href = data.link;
            } else {
                // window.location.href = `https://wazend.net/my-account/`;
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
        <div className="mx-auto py-6 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">¿Quieres gestionar tus suscripciones?</h2>
            <p className="mt-4 text-md text-gray-600">Accede al panel de suscripciones para gestionar tus métodos de pago y mantener todo bajo control de manera sencilla y eficiente.</p>

            <button
                onClick={handleCheckout}
                disabled={loading}
                className={`mt-6 inline-flex items-center justify-center w-full py-3 rounded-lg font-medium text-white text-base shadow-md transition-all duration-300 ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                    }`}
            >
                {loading ? (
                    <span>Cargando...</span>
                ) : (
                    <span>Ir al panel de facturación</span>
                )}
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center">
                        <div className="w-10 h-10 border-4 border-t-emerald-600 border-gray-300 rounded-full animate-spin mx-auto" />
                        <p className="text-lg mt-4">Redirigiendo al panel...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
