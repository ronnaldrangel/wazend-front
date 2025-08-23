import { useEffect } from 'react';
import Head from 'next/head';

interface PageTitleProps {
  title: string;
  baseTitle?: string;
}

/**
 * Hook personalizado para manejar títulos de página dinámicos
 */
export const usePageTitle = (pageTitle: string, baseTitle: string = 'Wazend AI'): JSX.Element => {
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
export const PageTitle = ({ title, baseTitle = 'Wazend AI' }: PageTitleProps) => {
  const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
  
  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
};

export default usePageTitle;