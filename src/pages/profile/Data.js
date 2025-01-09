import { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react'; // Para manejar la sesión

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // URL del backend desde las variables de entorno

export default function User() {
  const { data: session, status } = useSession(); // Obtén la sesión actual
  const [data, setData] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'authenticated' && session?.jwt) {
          const response = await fetch(`${strapiUrl}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${session.jwt}`, // JWT de la sesión
            },
          });

          if (!response.ok) {
            throw new Error('Error al obtener datos');
          }

          const result = await response.json();
          setData(result); // Guarda los datos en el estado
        }
      } catch (err) {
        setError(err.message); // Maneja errores
      } finally {
        setLoading(false); // Termina el indicador de carga
      }
    };

    fetchData();
  }, [status, session]);

  if (status === 'loading' || loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  // Asegúrate de que `data` no sea nulo antes de renderizar
  if (!data) {
    return <div>No se encontraron datos del usuario.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-slate-700 mb-4">
        {data.name || 'Nombre no disponible'}
      </h1>
      <p className="text-gray-500">Email: {data.email || 'Correo no disponible'}</p>
      <p className="text-gray-500">
        Última actualización: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'No disponible'}
      </p>
    </div>
  );
}