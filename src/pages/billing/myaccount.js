import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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
                        <CreditCardIcon className="h-16 w-16 text-gray-400" aria-hidden="true" />
                    </div>
                    
                    <h2 className="text-lg font-medium text-gray-900 text-center">
                        ¿Quieres gestionar tus suscripciones?
                    </h2>
                    
                    <p className="text-gray-500 max-w-md mx-auto text-center">
                        Accede al panel de suscripciones para gestionar tus métodos de pago y 
                        mantener todo bajo control de manera sencilla y eficiente.
                    </p>
                    
                    <div className="pt-2 flex justify-center">
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className={`inline-flex items-center justify-center rounded-md px-5 py-3 text-white text-sm font-medium shadow-sm transition-all duration-200 ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Cargando...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowRightIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                                    <span>Ir al panel de facturación</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <svg className="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-700">Redirigiendo al panel...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}