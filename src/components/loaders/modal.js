import { useEffect, useState } from 'react';

const Modal = ({ message }) => {
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTakingLong(true);
    }, 30000); // 30 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center">
          {/* Spinner con --primary en lugar de emerald */}
          <div className="w-10 h-10 border-4 border-t-primary border-gray-300 rounded-full animate-spin" />
        </div>
        <p className="text-center mt-4">{message}</p>
        {isTakingLong && (
          <p className="text-center mt-4 text-yellow-600">
            Esto está tardando más de lo esperado... por favor, mantén la página abierta.
          </p>
        )}
      </div>
    </div>
  );
};

export default Modal;
