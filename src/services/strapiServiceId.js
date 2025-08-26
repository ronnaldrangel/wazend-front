// lib/strapiService.js
import useSWR from 'swr';
// Función fetcher para obtener los datos
const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from Strapi');
  }

  const data = await res.json();

  if (data) {
    return data;  // Devolver los datos del objeto 'user'
  } else {
    throw new Error('No se encontraron datos válidos');
  }
};

// Función para obtener datos de Strapi (reutilizable)
export function useStrapiData(endpoint) {
  const { data, error } = useSWR(
    `/api/strapi/${endpoint}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}