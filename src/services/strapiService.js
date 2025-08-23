// lib/strapiService.js
import useSWR from 'swr';

// Función fetcher segura que usa la API route interna
const fetcher = async (url, options = {}) => {
  const { headers = {}, ...restOptions } = options;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};

// Hook para datos que devuelven arrays
export function useStrapiArrayData(endpoint, options = {}) {
  const { data, error } = useSWR(
    `/api/strapi/${endpoint}`,
    (url) => fetcher(url, options)
  );

  return {
    data: data?.data || [],
    error,
    isLoading: !error && !data,
  };
}

// Hook para datos que devuelven objetos únicos
export function useStrapiObjectData(endpoint, options = {}) {
  const { data, error } = useSWR(
    `/api/strapi/${endpoint}`,
    (url) => fetcher(url, options)
  );

  return {
    data: data?.data || null,
    error,
    isLoading: !error && !data,
  };
}

// Hook para datos con autenticación JWT
export function useStrapiJWTData(endpoint, token, options = {}) {
  const { data, error } = useSWR(
    token ? `/api/strapi/${endpoint}` : null,
    (url) => fetcher(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
  );

  return {
    data: data?.data || null,
    error,
    isLoading: !error && !data,
  };
}

// Función para fetch directo sin SWR
export async function fetchStrapiData(endpoint, options = {}) {
  const response = await fetcher(`/api/strapi/${endpoint}`, options);
  return response;
}

// Función legacy para compatibilidad (deprecated)
export function useStrapiData(endpoint, options = {}) {
  console.warn('useStrapiData is deprecated. Use useStrapiArrayData or useStrapiObjectData instead.');
  return useStrapiArrayData(endpoint, options);
}