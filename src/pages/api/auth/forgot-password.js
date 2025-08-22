export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validar que el email esté presente
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    // Hacer la petición a Strapi usando el token privado
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${strapiUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const errorData = await response.json();
      res.status(response.status).json(
        errorData || { message: 'Forgot password request failed' }
      );
    }
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}