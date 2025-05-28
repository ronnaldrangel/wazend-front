// pages/api/subscriptions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { wc } from '@/lib/woocommerce'

/* ----------------------------- tipos -------------------------------- */
type ErrorRes   = { error: string }
type Subscription = any  // sustitúyelo por tu tipo real
type SuccessRes = Subscription[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorRes | SuccessRes>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Método ${req.method} no permitido` })
  }

  // 1. Email obligatorio
  const emailParam = req.query.email
  const email = typeof emailParam === 'string' ? emailParam.toLowerCase() : ''
  if (!email) {
    return res.status(400).json({ error: 'Parámetro "email" obligatorio' })
  }

  // 2. Página y tamaño
  const pageParam = Array.isArray(req.query.page) ? req.query.page[0] : req.query.page
  const perPageParam = Array.isArray(req.query.per_page)
    ? req.query.per_page[0]
    : req.query.per_page

  const page = parseInt(pageParam ?? '1', 10)
  const per_page = parseInt(perPageParam ?? '10', 10)

  if (isNaN(page) || page < 1 || isNaN(per_page) || per_page < 1) {
    return res.status(400).json({ error: 'Parámetros de paginación inválidos' })
  }

  try {
    // 3. Buscar cliente por email
    const { data: customers } = await wc.get('customers', {
      email,
      role: 'all',
    })
    if (!customers.length) {
      return res
        .status(404)
        .json({ error: `No existe cliente con email ${email}` })
    }
    const customerId: number = customers[0].id

    // 4. Obtener suscripciones con paginación
    const { data: subs } = await wc.get('subscriptions', {
      customer: customerId,
      page,
      per_page,
      // status: 'active,on-hold'  // si quieres filtrar por estado
    })

    return res.status(200).json(subs)
  } catch (err: any) {
    console.error('Woo API error →', err.response?.data ?? err)
    return res
      .status(500)
      .json({ error: err.message ?? 'Error inesperado en WooCommerce' })
  }
}
