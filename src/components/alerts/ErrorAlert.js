import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorAlert = ({ message, onReload, title = "Error al cargar" }) => {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 border border-red-200 dark:border-red-800">
      <div className="flex items-center text-red-700 dark:text-red-400 mb-2">
        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
      {onReload && (
        <button
          onClick={onReload}
          className="mt-4 bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
        >
          Intentar nuevamente
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;