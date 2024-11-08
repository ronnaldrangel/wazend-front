
import { ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

import MessageTrial from '../trial/MessageTrial'

export default function NoInstances() {
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Controla si el botón está habilitado o no

  const handleButtonClick = async () => {
    setIsSubmitting(true); // Deshabilita el botón cuando comienza el envío

    try {
      // Envía una solicitud POST al webhook de n8n
      const response = await fetch("https://n8n.rangel.pro/webhook/1fd23cdf-f701-48aa-973d-31022d9e3948", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "usuario@ejemplo.com",
          message: "Este es un mensaje de prueba desde Next.js",
        }),
      });

      if (response.ok) {
        setNotification("Solicitud enviada a n8n. Esperando confirmación...");
        
        // Espera a que se reciba la confirmación de n8n
        const confirmResponse = await pollForConfirmation();
        if (confirmResponse) {
          setNotification("Correo enviado exitosamente!");
          setIsSubmitting(false); // Habilita el botón solo si se recibe la confirmación
        } else {
          setNotification("No se recibió confirmación de n8n. El botón permanecerá deshabilitado.");
        }
      } else {
        console.error("Error al enviar la solicitud a n8n.");
        setNotification("Error al enviar la solicitud a n8n.");
        setIsSubmitting(false); // Habilita el botón en caso de error en el envío inicial
      }
    } catch (error) {
      console.error("Error de red:", error);
      setNotification("Error de red al enviar la solicitud.");
      setIsSubmitting(false); // Habilita el botón en caso de error de red
    }
  };

  // Función para verificar periódicamente la confirmación desde n8n
  const pollForConfirmation = async () => {
    try {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        // Espera 3 segundos entre cada intento
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Llama a la API de Next.js que maneja la confirmación
        const res = await fetch("/api/notification");
        const data = await res.json();

        // Si recibimos confirmación de éxito, regresamos true
        if (data.status === "success") {
          return true;
        }

        attempts += 1;
      }

      // Si no se recibe confirmación después de varios intentos, regresamos false
      return false;
    } catch (error) {
      console.error("Error al verificar la confirmación:", error);
      return false;
    }
  };

  return (
      <>
        <MessageTrial/>
        {/* Botón debajo de la tarjeta y alineado a la derecha */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isSubmitting} // Deshabilita el botón mientras se espera la confirmación
            className={`inline-flex items-center rounded-md px-6 py-3 text-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600"
            }`}
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {isSubmitting ? "Procesando..." : "Crear instancia de prueba"}
          </button>
        </div>

        {/* Mostrar notificación si existe */}
        {notification && (
          <p className="mt-4 text-center text-sm font-semibold text-green-600">
            {notification}
          </p>
        )}
      </>
  );
}
