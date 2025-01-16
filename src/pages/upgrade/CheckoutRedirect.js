import { useState } from 'react';

export default function CheckoutRedirect({ email, variantId }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    setShowModal(true); // Mostrar el modal de carga

    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LEMONSQUEEZY_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email,
              },
              preview: true,
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID,
                },
              },
              variant: {
                data: {
                  type: 'variants',
                  id: variantId,
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const url = data.data.attributes.url;

      // Redirigir al usuario al URL del checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error al generar el checkout:', error.message);
    }

    setLoading(false);
    setShowModal(false); // Ocultar el modal de carga después de la redirección
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full mt-6 block rounded-md py-3 px-3 text-center text-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          loading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-600 focus-visible:outline-emerald-700'
        }`}
      >
        {loading ? 'Cargando...' : 'Suscribir'}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-t-emerald-600 border-gray-300 rounded-full animate-spin" />
            </div>
            <p className="text-center mt-4">Redirigiendo al checkout...</p>
          </div>
        </div>
      )}
    </div>
  );
}
