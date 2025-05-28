// pages/api/orders.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { wc } from '@/lib/woocommerce';

/* ----------------------------- tipos -------------------------------- */
type ErrorRes   = { error: string };
type SuccessRes = any[];  // sustituye `any[]` por tu interfaz real de Order[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorRes | SuccessRes>
) {
  // 0. Sólo GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  // 1. Email obligatorio
  const emailParam = req.query.email;
  const email = typeof emailParam === 'string' ? emailParam.toLowerCase() : '';
  if (!email) {
    return res.status(400).json({ error: 'Parámetro "email" obligatorio' });
  }

  try {
    // 2. Obtener cliente por email
    const { data: customers } = await wc.get('customers', {
      email,
      role: 'all',
    });
    if (!customers.length) {
      return res
        .status(404)
        .json({ error: `No existe cliente con email ${email}` });
    }
    const customerId: number = customers[0].id;

    // 3. Construir filtros opcionales desde query params
    const {
      status,      // e.g. 'completed', 'processing'
      per_page,    // e.g. '10'
      page,        // e.g. '2'
      after,       // e.g. '2025-01-01T00:00:00'
      before,      // e.g. '2025-05-28T23:59:59'
    } = req.query;

    // 4. Formar objeto de params dinámico
    const params: Record<string, any> = { customer: customerId };
    if (typeof status === 'string' && status) params.status = status;
    if (typeof per_page === 'string' && per_page) params.per_page = parseInt(per_page, 10);
    if (typeof page     === 'string' && page)     params.page     = parseInt(page, 10);
    if (typeof after    === 'string' && after)    params.after    = after;
    if (typeof before   === 'string' && before)   params.before   = before;

    // 5. Pedidos filtrados
    const { data: orders } = await wc.get('orders', params);

    return res.status(200).json(orders);
  } catch (err: any) {
    console.error('Woo API error →', err.response?.data ?? err);
    return res
      .status(500)
      .json({ error: err.message ?? 'Error inesperado' });
  }
}
