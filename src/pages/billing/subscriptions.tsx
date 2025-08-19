'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/loaders/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

type Subscription = {
  id: number
  status: string
  total: string
  next_payment_date_gmt: string | null
  line_items: { name: string }[]
}

async function fetcher(url: string): Promise<Subscription[]> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('No se pudieron cargar las suscripciones')
  return res.json()
}

function statusClasses(status: string) {
  const base = 'inline-block rounded-full px-2 py-[2px] text-xs font-semibold capitalize'
  return (
    {
      active: `${base} bg-green-500/10 text-green-600 dark:text-green-400`,
      pending: `${base} bg-yellow-500/10 text-yellow-600 dark:text-yellow-400`,
      'on-hold': `${base} bg-yellow-500/10 text-yellow-600 dark:text-yellow-400`,
      cancelled: `${base} bg-destructive/10 text-destructive`,
      expired: `${base} bg-muted text-muted-foreground`,
    }[status as keyof ReturnType<typeof Object>] ?? `${base} bg-muted text-muted-foreground`
  )
}

export default function SubscriptionsTableSoporte() {
  const { data: session, status } = useSession()
  const email = session?.user?.email

  // Paginación
  const [page, setPage] = useState(1)
  const perPage = 10

  // Key dinámica para SWR
  const fetchKey = () => {
    if (!email) return null
    const params = new URLSearchParams({
      email,
      page: String(page),
      per_page: String(perPage),
    })
    return `/api/subscriptions?${params.toString()}`
  }

  const { data, error, isLoading } = useSWR<Subscription[]>(fetchKey, fetcher)

  // Estados tempranos
  if (status === 'loading' || isLoading) {
    return <Skeleton />
  }

  if (status === 'unauthenticated' || !email) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No autenticado</AlertTitle>
        <AlertDescription>Debes iniciar sesión para ver tus suscripciones.</AlertDescription>
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
    return <p>No hay suscripciones para {email}.</p>
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
              <TableHead>Próximo pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(sub => (
              <TableRow key={sub.id} className="hover:bg-muted/50">
                <TableCell>{sub.id}</TableCell>
                <TableCell>
                  <span className={statusClasses(sub.status)}>{sub.status}</span>
                </TableCell>
                <TableCell>{sub.line_items?.[0]?.name ?? '—'}</TableCell>
                <TableCell>
                  {sub.next_payment_date_gmt
                    ? new Date(sub.next_payment_date_gmt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell className="text-right">${sub.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
        >
          Anterior
        </Button>
        <span className="text-xs">Página {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={data.length < perPage}
          onClick={() => setPage(p => p + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
