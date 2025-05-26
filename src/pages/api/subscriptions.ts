import type { NextApiRequest, NextApiResponse } from 'next';
import { wc } from '@/lib/woocommerce';

/* ----------------------------- tipos -------------------------------- */
type ErrorRes   = { error: string };
type SuccessRes = any[];               // tipa con tu interfaz real

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorRes | SuccessRes>
) {
  /* 0. Sólo GET */
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  /* 1. Email obligatorio */
  const emailParam = req.query.email;
  const email = typeof emailParam === 'string' ? emailParam.toLowerCase() : '';
  if (!email) {
    return res.status(400).json({ error: 'Parámetro "email" obligatorio' });
  }

  try {
    /* 2. Cliente por correo (role=all para cubrir subscriber/guest) */
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

    /* 3. Suscripciones vía endpoint «subscriptions?customer={id}» */
    const { data: subs } = await wc.get('subscriptions', {
      customer: customerId,
      // Opcionales: status: 'active,on-hold', per_page: 100, page: 1
    });

    return res.status(200).json(subs);
  } catch (err: any) {
    console.error('Woo API error →', err.response?.data ?? err);
    return res
      .status(500)
      .json({ error: err.message ?? 'Error inesperado' });
  }
}
