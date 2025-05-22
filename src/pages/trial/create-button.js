import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';
import { mutate } from 'swr';
import Spin from '@/components/loaders/spin';
import { Button } from '@/components/ui/button';

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
  const COOLDOWN_DURATION = 1000 * 60 * 10;

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
      <Button
        type="button"
        onClick={handleCreateInstance}
        disabled={isSubmitting || isDisabled}
        aria-label="Crear instancia de prueba"
      >
        {isSubmitting ? (
          <>
            <Spin/>
            Cargando...
          </>
        ) : isDisabled ? (
          <>
            Espere {formatCountdown(countdown)}
          </>
        ) : (
          <>
            Crear instancia de prueba
          </>
        )}
      </Button>
      
      {isDisabled && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Solo puede crear una instancia cada 10 minutos.
        </p>
      )}
    </div>
  );
};

export default CreateButton;