// API route para proxy seguro a Strapi
export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  
  // Construir la URL del endpoint de Strapi
  const strapiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Construir query string con todos los parámetros (como ?populate=*)
  const queryString = new URLSearchParams(queryParams).toString();
  const strapiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${strapiPath}${queryString ? `?${queryString}` : ''}`;
  
  try {
    // Preparar headers para la petición a Strapi
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_TOKEN}`, // Token privado del servidor
    };
    
    // Si hay un token de autorización del cliente, usarlo en lugar del token de API
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    
    // Realizar la petición a Strapi
    const response = await fetch(strapiUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Error fetching data from Strapi',
        status: response.status,
        statusText: response.statusText
      });
    }
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Strapi API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}