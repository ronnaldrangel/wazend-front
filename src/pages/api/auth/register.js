import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Username, email and password are required' 
      });
    }

    // Hacer la petición a Strapi usando el token privado
    const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.post(
      `${strapiUrl}/api/auth/local/register`,
      {
        username,
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    // Devolver la respuesta de Strapi
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    if (error.response) {
      // Error de Strapi
      res.status(error.response.status).json(
        error.response.data || { message: 'Registration failed' }
      );
    } else {
      // Error de red u otro
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}