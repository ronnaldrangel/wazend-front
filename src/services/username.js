import useSWR from 'swr';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const UsernameDisplay = ({ jwt }) => {
  const fetcher = async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.json();
  };

  const { data, error, isLoading } = useSWR(`${strapiUrl}/api/users/me`, fetcher);

  if (error) return <p>Ha ocurrido un error</p>;
  if (isLoading) return <div>Cargando..</div>

  return <p>Tu nombre de usuario es: {data.name}</p>;
};

export default UsernameDisplay;
