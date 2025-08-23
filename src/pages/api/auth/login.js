import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    console.error('❌ Credenciales faltantes');
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Formato de email inválido');
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`,
      {
        identifier: email,
        password: password,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos timeout
      }
    );
    
    const { user, jwt } = response.data;
    
    // Validar que la respuesta contenga los datos necesarios
    if (!user || !jwt || !user.id || !user.email) {
      console.error('❌ Respuesta de autenticación incompleta');
      return res.status(500).json({ error: 'Respuesta de autenticación incompleta' });
    }
    
    console.log('✅ Login exitoso para:', user.email);
    return res.status(200).json({ user: { ...user, jwt }, success: true });
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout en autenticación');
      return res.status(408).json({ error: 'Timeout en autenticación' });
    } else if (error.response?.status === 400) {
      console.error('❌ Credenciales inválidas');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    } else if (error.response?.status === 401) {
      console.error('❌ No autorizado - verificar API_TOKEN');
      return res.status(401).json({ error: 'Error de autorización' });
    } else {
      console.error('❌ Error de login:', error.response?.data || error.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

// Función exportada para usar en NextAuth
export async function authenticateUser(email, password) {
  // Validaciones básicas
  if (!email || !password) {
    console.error('❌ Credenciales faltantes');
    return null;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Formato de email inválido');
    return null;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`,
      {
        identifier: email,
        password: password,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos timeout
      }
    );
    
    const { user, jwt } = response.data;
    
    // Validar que la respuesta contenga los datos necesarios
    if (!user || !jwt || !user.id || !user.email) {
      console.error('❌ Respuesta de autenticación incompleta');
      return null;
    }
    
    console.log('✅ Login exitoso para:', user.email);
    return { ...user, jwt };
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout en autenticación');
    } else if (error.response?.status === 400) {
      console.error('❌ Credenciales inválidas');
    } else if (error.response?.status === 401) {
      console.error('❌ No autorizado - verificar API_TOKEN');
    } else {
      console.error('❌ Error de login:', error.response?.data || error.message);
    }
    return null;
  }
}