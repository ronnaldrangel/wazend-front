import { useState, useEffect } from 'react';

export default function CustomerPortal() {
  const [loading, setLoading] = useState(true);
  const [customerPortalUrl, setCustomerPortalUrl] = useState('');

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        // Leer la API Key desde las variables de entorno
        const apiKey = process.env.NEXT_PUBLIC_LEMONSQUEEZY_API_KEY;

        if (!apiKey) {
          throw new Error('La API Key no está configurada.');
        }

        // Realizar la solicitud GET al endpoint de Lemonsqueezy
        const response = await fetch('https://api.lemonsqueezy.com/v1/customers/4753212', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Extraer el enlace del Customer Portal y guardarlo en el estado
        const portalUrl = data?.data?.attributes?.urls?.customer_portal;
        if (portalUrl) {
          setCustomerPortalUrl(portalUrl);
        } else {
          throw new Error('No se encontró el enlace del Customer Portal.');
        }
      } catch (error) {
        console.error('Error fetching customer details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : customerPortalUrl ? (
        <button
          onClick={() => window.location.href = customerPortalUrl}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Ir al Customer Portal
        </button>
      ) : (
        <p>No se encontró el enlace del Customer Portal.</p>
      )}
    </div>
  );
}
