import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import { mutate } from 'swr';

/**
 * Componente para crear una nueva instancia de prueba
 * con protección anti-abuso y actualización sin recarga
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSuccess - Función a ejecutar después de crear la instancia exitosamente
 * @returns {JSX.Element} Botón para crear instancia de prueba
 */
const CreateButton = ({ onSuccess }) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // URL del webhook para crear instancias
  const TRIAL_WEBHOOK_URL = process.env.NEXT_PUBLIC_CREATE_TRIAL;
  // URL para la mutación de SWR
  const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Duración del período de cooldown en milisegundos (10 minutos)
  const COOLDOWN_DURATION = 10 * 60 * 10;

  // Verificar si el botón debería estar deshabilitado basado en localStorage
  useEffect(() => {
    const lastAttemptTime = localStorage.getItem('trialCreationAttempt');
    
    if (lastAttemptTime) {
      const elapsedTime = Date.now() - parseInt(lastAttemptTime, 10);
      
      if (elapsedTime < COOLDOWN_DURATION) {
        const remainingTime = Math.ceil((COOLDOWN_DURATION - elapsedTime) / 1000);
        setIsDisabled(true);
        setCountdown(remainingTime);
        
        // Iniciar el contador regresivo
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        // El tiempo de espera ha terminado
        localStorage.removeItem('trialCreationAttempt');
      }
    }
  }, []);

  /**
   * Formatea el tiempo de espera en formato mm:ss
   */
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Maneja la creación de una nueva instancia
   */
  const handleCreateInstance = async () => {
    if (isDisabled) return;
    
    if (!session?.user?.email) {
      toast.error('No se pudo obtener su correo electrónico. Por favor, inicie sesión nuevamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(TRIAL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          userId: session.id || 'ID no disponible',
        }),
      });

      // Procesar la respuesta
      if (response.ok) {
        // Guardar el tiempo de intento para prevenir abuso
        localStorage.setItem('trialCreationAttempt', Date.now().toString());
        
        // Establecer el cooldown
        setIsDisabled(true);
        setCountdown(COOLDOWN_DURATION / 1000);
        
        // Notificar al usuario del éxito
        toast.success('Instancia creada correctamente');
        
        // Actualizar los datos en SWR para refrescar la UI sin recargar
        await mutate(`${STRAPI_URL}/api/users/me?populate=freetrials`);
        
        // Ejecutar callback de éxito si existe
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        const errorData = await response.text();
        console.error('Error al crear instancia:', errorData);
        
        toast.error('No se pudo crear la instancia', {
          description: 'Por favor, inténtelo de nuevo más tarde.',
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      
      toast.error('Error de conexión', {
        description: 'Compruebe su conexión a internet.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleCreateInstance}
        disabled={isSubmitting || isDisabled}
        className={`
          inline-flex items-center justify-center
          rounded-md px-6 py-3 text-sm font-medium
          text-white shadow-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${(isSubmitting || isDisabled)
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"}
        `}
        aria-label="Crear instancia de prueba"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </>
        ) : isDisabled ? (
          <>
            <svg className="mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Espere {formatCountdown(countdown)}
          </>
        ) : (
          <>
            <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Crear instancia de prueba
          </>
        )}
      </button>
      
      {isDisabled && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Solo puede crear una instancia cada 10 minutos.
        </p>
      )}
    </div>
  );
};

export default CreateButton;