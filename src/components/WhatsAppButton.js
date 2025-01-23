import { useEffect, useState } from "react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

const ActionButtons = () => {
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    // Configuración de WhatsApp
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // Obtiene el número de WhatsApp de la variable de entorno
    if (!phoneNumber) {
      console.error("NEXT_PUBLIC_WHATSAPP_NUMBER no está configurada.");
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|iPad|iPhone|iPod/i.test(userAgent);

    const message = encodeURIComponent("Hola, soy cliente. Necesito soporte.");
    const baseUrl = isMobile
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    setWhatsAppUrl(baseUrl);

    // Configuración de YouTube
    const youtubeChannelUrl = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL; // URL del canal de YouTube desde variables de entorno
    if (!youtubeChannelUrl) {
      console.error("NEXT_PUBLIC_YOUTUBE_CHANNEL_URL no está configurada.");
      return;
    }
    setYoutubeUrl(youtubeChannelUrl);
  }, []);

  return (
    <>
      {/* Botón de YouTube */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 fixed bottom-20 right-4 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <PlayCircleIcon className="h-8 w-auto" />
      </a>

      {/* Botón de WhatsApp */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <ChatBubbleOvalLeftIcon className="h-8 w-auto" />
      </a>
    </>
  );
};

export default ActionButtons;
