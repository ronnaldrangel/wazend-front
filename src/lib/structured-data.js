/**
 * Utilidades para generar datos estructurados (JSON-LD) para SEO
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.wazend.net';
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Wazend';

/**
 * Datos estructurados para la organización
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": appName,
  "url": baseUrl,
  "logo": `${baseUrl}/images/logo.svg`,
  "description": "Plataforma líder en automatización de WhatsApp Business. Gestiona conversaciones, automatiza respuestas y mejora tu atención al cliente.",
  "foundingDate": "2020",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Spanish", "English"],
    "url": `${baseUrl}/contact`
  },
  "sameAs": [
    "https://app.wazend.net",
    "https://www.linkedin.com/company/wazend/",
    "https://www.instagram.com/wazend.es/",
    "https://www.youtube.com/@wazend-es",
    "https://www.facebook.com/wazend.es/"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ES"
  }
});

/**
 * Datos estructurados para software/aplicación
 */
export const getSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": appName,
  "url": baseUrl,
  "description": "Plataforma de automatización de WhatsApp Business para empresas",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Prueba gratuita disponible. Precios en dólares estadounidenses (USD)"
  },
  "author": {
    "@type": "Organization",
    "name": appName
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  }
});

/**
 * Datos estructurados para página web
 */
export const getWebPageSchema = (title, description, url) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "description": description,
  "url": url,
  "isPartOf": {
    "@type": "WebSite",
    "name": appName,
    "url": baseUrl
  },
  "about": {
    "@type": "Thing",
    "name": "WhatsApp Business Automation"
  },
  "mainEntity": {
    "@type": "Organization",
    "name": appName
  }
});

/**
 * Datos estructurados para sitio web
 */
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": appName,
  "url": baseUrl,
  "description": "Plataforma líder en automatización de WhatsApp Business",
  "publisher": {
    "@type": "Organization",
    "name": appName
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

/**
 * Datos estructurados para artículo/blog
 */
export const getArticleSchema = (title, description, author, datePublished, dateModified, url, image) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Person",
    "name": author || appName
  },
  "publisher": {
    "@type": "Organization",
    "name": appName,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/logo.svg`
    }
  },
  "datePublished": datePublished,
  "dateModified": dateModified || datePublished,
  "url": url,
  "image": image || `${baseUrl}/images/logo.svg`,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

/**
 * Datos estructurados para FAQ
 */
export const getFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Datos estructurados para breadcrumbs
 */
export const getBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

/**
 * Combinar múltiples esquemas
 */
export const combineSchemas = (...schemas) => {
  return schemas.filter(Boolean);
};