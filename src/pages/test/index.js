import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import useSWR from 'swr';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Dashboard = () => {
  const { data: session, status } = useSession(); // Obtén la sesión actual con NextAuth
  const [jwt, setJwt] = useState(null); // Estado para almacenar el token JWT
  const router = useRouter();

  // Fetcher para useSWR
  const fetcher = async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`, // Usa el JWT en las cabeceras
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    return response.json();
  };

  // Usamos useEffect para obtener el JWT desde la sesión cuando esté disponible
  useEffect(() => {
    const getToken = async () => {
      const session = await getSession(); // Obtén la sesión actual
      if (session) {
        setJwt(session.jwt); // Guarda el token JWT en el estado
      }
    };

    getToken();
  }, []);

  // Usamos useSWR para obtener los datos del usuario
  const { data, error, isLoading } = useSWR(jwt ? `${strapiUrl}/api/users/me` : null, fetcher);

  // Este useEffect se ejecuta una vez que los datos del usuario están disponibles
  useEffect(() => {
    if (data && !data.planPagado) {
      // Si el usuario no tiene un plan pagado, redirigimos a la página de pago
      router.push('/upgrade');
    }
  }, [data, router]);

  // Manejo de errores y estado de carga
  if (status === 'loading' || isLoading) return <div>Cargando..</div>;
  if (error) return <p>Ha ocurrido un error</p>;

  return (
    <div>
      <h1>Bienvenido, {data?.username}</h1>
      <p>Tu plan está activo: {data?.planPagado ? 'Sí' : 'No'}</p>
      {/* Aquí puedes agregar más contenido del dashboard */}
    </div>
  );
};

export default Dashboard;
