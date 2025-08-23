import { useEffect } from 'react';
import Head from 'next/head';

interface PageTitleProps {
  title: string;
  baseTitle?: string;
}

/**
 * Hook personalizado para manejar títulos de página dinámicos
 */
export const usePageTitle = (pageTitle: string, baseTitle: string = process.env.NEXT_PUBLIC_APP_NAME || 'Wazend API'): JSX.Element => {
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
 */
export const PageTitle = ({ title, baseTitle = process.env.NEXT_PUBLIC_APP_NAME || 'Wazend API' }: PageTitleProps) => {
  const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
  
  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
};

export default usePageTitle;