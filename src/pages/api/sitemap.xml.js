// API route para generar sitemap dinámico

const generateSitemap = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.wazend.net';
  const currentDate = new Date().toISOString();
  
  // Define las páginas estáticas que quieres incluir en el sitemap
  // Solo incluimos la página principal ya que las demás son privadas
  const staticPages = [
    {
      url: '',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: currentDate
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages
  .map(page => {
    return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return sitemap;
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const sitemap = generateSitemap();
      
      res.setHeader('Content-Type', 'text/xml');
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
      res.status(200).send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).json({ error: 'Error generating sitemap' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}