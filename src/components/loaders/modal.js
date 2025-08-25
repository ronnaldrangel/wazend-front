import { useEffect, useState } from 'react';
import Spin from './spin';

const Modal = ({ message }) => {
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTakingLong(true);
    }, 30000); // 30 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
      <div className="bg-background p-8 rounded-lg shadow-lg border border-border">
        <div className="flex justify-center items-center">
          <Spin />
        </div>
        <p className="text-center mt-4 text-gray-900 dark:text-gray-100">{message}</p>
        {isTakingLong && (
          <p className="text-center mt-4 text-yellow-600 dark:text-yellow-400">
            Esto está tardando más de lo esperado... por favor, mantén la página abierta.
          </p>
        )}
      </div>
    </div>
  );
};

export default Modal;
