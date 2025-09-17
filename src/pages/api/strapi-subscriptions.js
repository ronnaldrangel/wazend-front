// pages/api/strapi-subscriptions.js
import { getToken } from 'next-auth/jwt';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    // Obtener el token JWT de la sesión (siguiendo el patrón de subs-list.js)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.jwt) {
      return res.status(401).json({ error: 'No autorizado - JWT requerido' });
    }

    // Parámetros de paginación
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '25', 10);

    // Hacer la petición a Strapi para obtener el usuario con sus subscriptions (siguiendo el patrón de subs-list.js)
    const response = await fetch(
      `${strapiUrl}/api/users/me?populate[subscriptions][populate]=instances`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Error en Strapi:', response.status, response.statusText);
      return res.status(response.status).json({
        error: `Error al obtener datos de Strapi: ${response.statusText}`
      });
    }

    const userData = await response.json();

    // Extraer las subscriptions del usuario
    const subscriptions = userData.subscriptions || [];

    // Console log para debug
    // console.log('📊 Datos de subscriptions obtenidos de Strapi:', {
    //   userId: userData.id,
    //   email: userData.email,
    //   totalSubscriptions: subscriptions.length,
    //   subscriptions: subscriptions.map(sub => ({
    //     id: sub.id,
    //     status: sub.status_woo,
    //     product: sub.product_name,
    //     billing: sub.billing_period,
    //     instances: sub.instances?.length || 0
    //   }))
    // });

    // Formatear los datos para que sean compatibles con la tabla
    const formattedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      id_woo: sub.id_woo,
      documentId: sub.documentId,
      status: sub.status_woo || 'unknown',
      status_woo: sub.status_woo,
      product_name: sub.product_name || 'Producto no especificado',
      billing_period: sub.billing_period,
      next_payment_date_gmt: sub.next_payment_date_gmt,
      last_payment_date_gmt: sub.last_payment_date_gmt,
      total: sub.total || '0',
      price: sub.price || 0,
      instances: sub.instances || [],
      instances_limit: sub.instances_limit,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    }));

    return res.status(200).json({
      data: formattedSubscriptions,
      meta: {
        pagination: {
          page,
          pageSize,
          total: subscriptions.length
        }
      }
    });

  } catch (error) {
    console.error('Error en API strapi-subscriptions:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
}