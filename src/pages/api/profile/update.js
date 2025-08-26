export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, name, phone } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!userId) {
      return res.status(400).json({ 
        message: 'User ID is required' 
      });
    }

    // Hacer la petición a Strapi usando el token privado
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${strapiUrl}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify({ name, phone }),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const errorData = await response.json();
      res.status(response.status).json(
        errorData || { message: 'Profile update failed' }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}