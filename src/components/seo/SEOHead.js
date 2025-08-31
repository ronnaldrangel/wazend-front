import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Componente SEOHead para manejar meta tags dinámicos y optimización SEO
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción de la página
 * @param {string} props.keywords - Palabras clave separadas por comas
 * @param {string} props.image - URL de la imagen para Open Graph
 * @param {string} props.type - Tipo de contenido (website, article, etc.)
 * @param {string} props.author - Autor del contenido
 * @param {Object} props.structuredData - Datos estructurados JSON-LD
 * @param {string} props.canonical - URL canónica personalizada
 * @param {boolean} props.noIndex - Si true, añade noindex
 * @param {string} props.locale - Idioma de la página
 */
const SEOHead = ({
  title,
  description = 'Wazend - Plataforma líder en automatización de WhatsApp Business. Gestiona conversaciones, automatiza respuestas y mejora tu atención al cliente.',
  keywords = 'WhatsApp Business, automatización, chatbot, atención al cliente, marketing digital, mensajería',
  image = '/images/logo.svg',
  type = 'website',
  author = 'Wazend',
  structuredData,
  canonical,
  noIndex = false,
  locale = 'es_ES'
}) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wazend.net';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Wazend';
  
  // Construir título completo
  const fullTitle = title ? `${title} - ${appName}` : appName;
  
  // URL canónica
  const canonicalUrl = canonical || `${baseUrl}${router.asPath.split('?')[0]}`;
  
  // URL de imagen completa
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // Datos estructurados por defecto
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": appName,
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.svg`,
    "description": description,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      "https://twitter.com/wazend",
      "https://linkedin.com/company/wazend"
    ]
  };

  return (
    <Head>
      {/* Meta tags básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta httpEquiv="Content-Language" content={locale.replace('_', '-')} />
      
      {/* URL canónica */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={appName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@wazend" />
      <meta name="twitter:creator" content="@wazend" />
      
      {/* Meta tags adicionales para SEO */}
      <meta name="theme-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
      <meta name="application-name" content={appName} />
      
      {/* Datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData)
        }}
      />
      
      {/* Preconnect para mejorar performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
};

export default SEOHead;