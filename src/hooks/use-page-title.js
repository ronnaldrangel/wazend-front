import { useEffect } from 'react';
import Head from 'next/head';

/**
 * Hook personalizado para manejar títulos de página dinámicos
 * @param {string} pageTitle - El título específico de la página
 * @param {string} baseTitle - El título base (por defecto process.env.NEXT_PUBLIC_APP_NAME)
 * @returns {JSX.Element} - Componente Head con el título configurado
 */
export const usePageTitle = (pageTitle, baseTitle = process.env.NEXT_PUBLIC_APP_NAME) => {
  const fullTitle = pageTitle ? `${pageTitle} - ${baseTitle}` : baseTitle;
  
  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
};

/**
 * Componente para establecer el título de página
 * @param {Object} props
 * @param {string} props.title - El título específico de la página
 * @param {string} props.baseTitle - El título base (opcional)
 * @returns {JSX.Element}
 */
export const PageTitle = ({ title, baseTitle = process.env.NEXT_PUBLIC_APP_NAME }) => {
  const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
  
  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
};

export default usePageTitle;