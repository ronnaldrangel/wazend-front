'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/loaders/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// -----------------------------
// Define tu tipo real de Order
// -----------------------------
type Order = {
  id: number
  status: string
  total: string
  date_created_gmt: string
  line_items: { name: string; quantity: number }[]
}

// Fetcher genérico para pedidos
async function fetcher(url: string): Promise<Order[]> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('No se pudieron cargar los pedidos')
  return res.json()
}

// Helper para colorear el estado
function statusClasses(status: string) {
  const base = 'inline-block rounded-full px-2 py-[2px] text-xs font-semibold capitalize'
  return (
    {
      completed: `${base} bg-green-500/10 text-green-600 dark:text-green-400`,
      processing: `${base} bg-blue-500/10 text-blue-600 dark:text-blue-400`,
      cancelled: `${base} bg-destructive/10 text-destructive`,
      refunded: `${base} bg-muted text-muted-foreground`,
    }[status as keyof { [key: string]: string }] ?? `${base} bg-muted text-muted-foreground`
  )
}

export default function OrdersTableSoporte() {
  const { data: session, status } = useSession()
  const email = session?.user?.email
  const [page, setPage] = useState(1)
  const perPage = 10

  // Key dinámico con paginación
  const fetchKey = () => {
    if (!email) return null
    const params = new URLSearchParams({
      email,
      page: String(page),
      per_page: String(perPage),
    })
    return `/api/orders?${params.toString()}`
  }

  const { data, error, isLoading } = useSWR<Order[]>(fetchKey, fetcher)

  // Estados tempranos de UI
  if (status === 'loading' || isLoading) {
    return <Skeleton />
  }

  if (status === 'unauthenticated' || !email) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No autenticado</AlertTitle>
        <AlertDescription>Debes iniciar sesión para ver tus pedidos.</AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return <p>No hay pedidos para {email}.</p>
  }

  return (
      <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <span className={statusClasses(order.status)}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  {order.line_items[0]
                    ? `${order.line_items[0].name} x${order.line_items[0].quantity}`
                    : '—'}
                </TableCell>
                <TableCell>
                  {order.date_created_gmt
                    ? new Date(order.date_created_gmt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell className="text-right">${order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Controles de paginación con shadcn-ui */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Anterior
        </Button>
        <span className='text-xs'>Página {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={data.length < perPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
