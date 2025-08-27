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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity z-50">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-card border border-border px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <div>
              <div className="flex justify-center items-center h-16">
                <Spin />
              </div>
              <p className="text-center mt-4 text-foreground">{message}</p>
              {isTakingLong && (
                <p className="text-center mt-4 text-yellow-600 dark:text-yellow-400">
                  Esto está tardando más de lo esperado... por favor, mantén la página abierta.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
