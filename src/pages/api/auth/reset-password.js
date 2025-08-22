export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, password, passwordConfirmation } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!code || !password || !passwordConfirmation) {
      return res.status(400).json({ 
        message: 'Code, password and passwordConfirmation are required' 
      });
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirmation) {
      return res.status(400).json({ 
        message: 'Passwords do not match' 
      });
    }

    // Hacer la petición a Strapi usando el token privado
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${strapiUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, password, passwordConfirmation }),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const errorData = await response.json();
      res.status(response.status).json(
        errorData || { message: 'Reset password failed' }
      );
    }
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}