
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ButtonControl = ({ instanceName, serverUrl }) => {

  const handleRestart = async () => {
    try {
      const response = await fetch(`${serverUrl}/instance/restart/${instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': process.env.NEXT_PUBLIC_WAZEND_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Reinicio exitoso:', data);
      toast.success('Reiniciado correctamente.');
      // Aquí puedes manejar la respuesta o mostrar una notificación de éxito
    } catch (error) {
      console.error('Error al reiniciar:', error);
      // Aquí puedes manejar el error o mostrar una notificación de fallo
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch(`${serverUrl}/instance/logout/${instanceName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': process.env.NEXT_PUBLIC_WAZEND_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Desconexión exitosa:', data);
      // Aquí puedes manejar la respuesta o mostrar una notificación de éxito
      window.location.reload(); // Recarga la página después de un reinicio exitoso
    } catch (error) {
      console.error('Error al desconectar:', error);
      // Aquí puedes manejar el error o mostrar una notificación de fallo
    }
  };

  return (
    <>
      <Button
        onClick={handleRestart}
        variant="warning"
        size="default"
        className="w-full sm:w-auto"
      >
        Reiniciar
      </Button>

      <Button
        onClick={handleDisconnect}
        variant="destructive"
        size="default"
        className="w-full sm:w-auto"
      >
        Desconectar
      </Button>

    </>
  );
};

export default ButtonControl;
