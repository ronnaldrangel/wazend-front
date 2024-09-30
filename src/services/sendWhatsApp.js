// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [response, setResponse] = useState(null);

  const handleSendMessage = async () => {
    try {
      const data = {
        number: '51974028370',
        type: 'text',
        message: '¡Hola! ¿En qué puedo ayudarte hoy?',
        instance_id: '660C17DEC0CA7',
        access_token: '660bc7dc27a0c'
      };
  
      const response = await axios.post(
        'https://mars.wazend.net/api/send', 
        data, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Accept-Encoding': gzip, deflate, br,
            'Connection': keep-alive,
            // Otros encabezados personalizados que desees agregar
          }
        }
      );
      setResponse(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div>
      <button onClick={handleSendMessage}>Enviar mensaje</button>
      {response && (
        <div>
          <h2>Respuesta del servidor:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
