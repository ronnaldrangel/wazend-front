import { useState, useEffect } from 'react';
import Image from 'next/image';

const QRCodeComponent = ({ instanceName }) => {
  const [qrBase64, setQrBase64] = useState('');

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch(`https://api.wazend.net/instance/connect/${instanceName}`, {
          method: 'GET',
          headers: {
            apiKey: 'UkVKATZZMZqZgtxMscKhfhbxORHDH41K',
          },
        });
        const data = await response.json();
        console.log('API Response:', data); // Imprimir respuesta completa para depuración
        setQrBase64(data.base64); // Guardar solo el valor Base64
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    fetchQRCode();
  }, []);

  return (
    <div className='mb-4 md:mb-0 flex-shrink-0'>
      <div className='inline-block border-2 border-gray-200 p-2 rounded-lg overflow-hidden h-52'>
        {qrBase64 ? (
          <Image
            src={qrBase64}
            alt='QR Code'
            width={200}
            height={200}
            className='rounded-md w-full h-full object-cover'
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default QRCodeComponent;
