
import { ExclamationTriangleIcon} from '@heroicons/react/24/solid';

export default function MessageTrial() {

  return (
      <div className="w-full">
        <div className="rounded-lg shadow-md bg-blue-100 text-blue-900 p-6">
          <div className="flex items-center font-bold text-xl mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
            Su instancia de prueba
          </div>

          <p className="text-sm font-semibold mb-4">Información importante:</p>

          <ul className="list-disc list-inside space-y-1 text-sm mb-4">
            <li>La instancia vence en 3 días.</li>
            <li>La instancia puede eliminarse en cualquier momento por abuso.</li>
            <li>Límite de uso: 10 acciones o solicitudes cada 5 minutos.</li>
          </ul>
        </div>
      </div>
  );
}
