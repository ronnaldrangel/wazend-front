import { useEffect, useState } from 'react';
import axios from 'axios';
import LayoutInstance from './LayoutInstance'; // Importa el componente Panel

const FetchInstances = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.wazend.net/instance/fetchInstances',
          {
            headers: {
              apiKey: 'CC4A9EF716E0-4CFE-A865-231524F23281',
            },
            params: {
              instanceName: 'ronald',
            },
          }
        );

        //console.log('Datos de la API:', response.data); // Imprimir datos completos en la consola

        setData(response.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err.message); // Imprimir el error en consola
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Pasamos los datos al componente Panel */}
      <LayoutInstance instanceData={data} />
    </div>
  );
};

export default FetchInstances;
