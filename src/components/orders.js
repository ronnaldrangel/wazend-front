import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Usar variable de entorno para la URL

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]); // Estado para almacenar las órdenes del usuario
  const [jwt, setJwt] = useState(null); // Estado para almacenar el token JWT
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
  const [error, setError] = useState(null); // Estado para errores
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Obtener el token JWT y el ID del usuario desde la sesión cuando esté disponible
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession(); // Obtener sesión actual
      if (session && session.jwt) {
        setJwt(session.jwt); // Guardar el token JWT en el estado
        setUserId(session.id); // Guardar el ID del usuario en el estado (session.id en tu caso)
      } else {
        setError("No se pudo obtener el JWT o el ID del usuario.");
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Obtener las órdenes del usuario autenticado desde la API de Strapi
  useEffect(() => {
    const fetchOrdenes = async () => {
      if (!jwt || !userId) return; // No hacer la solicitud si no hay JWT o ID de usuario

      try {
        setIsLoading(true); // Iniciar la carga
        const response = await fetch(
          `${strapiUrl}/api/ordenes?filters[usuarios][id][$eq]=${userId}&populate=usuarios`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`, // Pasar el token JWT en la cabecera
            },
          }
        );

        if (!response.ok) {
          throw new Error('Error al obtener las órdenes');
        }

        const result = await response.json(); // Parsear la respuesta como JSON
        setOrdenes(result.data); // Guardar las órdenes del usuario en el estado
        setIsLoading(false); // Desactivar el estado de carga
      } catch (err) {
        setError(err.message);
        setIsLoading(false); // Desactivar el estado de carga en caso de error
      }
    };

    if (jwt && userId) {
      fetchOrdenes();
    }
  }, [jwt, userId]);

  // Mostrar loading mientras se obtienen los datos
  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Mis Órdenes</h1>
      {ordenes.length === 0 ? (
        <p>No tienes órdenes.</p>
      ) : (
        <ul>
          {ordenes.map((orden) => (
            <li key={orden.id}>
              <p>Documento ID: {orden.documentId}</p>
              <p>Fecha de inicio: {new Date(orden.fechaInicio).toLocaleDateString()}</p>
              <p>Fecha de caducidad: {new Date(orden.fechaCaducidad).toLocaleDateString()}</p>
              <p>Usuario: {orden.usuarios[0]?.username || 'Sin usuario asignado'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ordenes;
