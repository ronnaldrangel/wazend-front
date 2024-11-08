
import { toast } from 'sonner';

const ButtonControl = () => {
  
  const handleRestart = async () => {
    try {
      const response = await fetch('https://api.wazend.net/instance/restart/wazend-wap', {
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
      const response = await fetch('https://api.wazend.net/instance/logout/wazend-wap', {
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
    <div className="mt-6 flex justify-end space-x-2">
      <button
        onClick={handleRestart}
        className="rounded-md bg-gray-200 hover:bg-gray-300 px-4 py-2 text-black font-medium text-sm"
      >
        REINICIAR
      </button>
      <button
        onClick={handleDisconnect}
        className="rounded-md bg-red-700 hover:bg-red-800 px-4 py-2 text-white font-medium text-sm"
      >
        DESCONECTAR
      </button>
    </div>
  );
};

export default ButtonControl;
