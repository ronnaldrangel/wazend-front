export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { isReseller, resellerName } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Instance ID is required' });
    }

    // Preparar los datos para la actualización
    const updatedData = {
      data: {
        isReseller,
        resellerName,
      }
    };

    // Hacer la petición PUT a Strapi usando el token privado
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${strapiUrl}/api/instances/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const errorData = await response.json();
      res.status(response.status).json(
        errorData || { message: 'Failed to update instance' }
      );
    }
  } catch (error) {
    console.error('Instance update API error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}