'use client'

import React from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/loaders/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import CheckoutButton from './checkout'

type Subscription = {
  id: number
  id_woo: number
  documentId: string
  status: string
  status_woo: string
  product_name: string
  billing_period: string
  next_payment_date_gmt: string | null
  last_payment_date_gmt: string | null
  total: string
  price: number
  instances: any[]
  instances_limit: number
  createdAt: string
  updatedAt: string
}

async function fetcher(url: string): Promise<{ data: Subscription[], meta: any }> {
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
      paused: `${base} bg-blue-500/10 text-blue-600 dark:text-blue-400`,
    }[status as keyof ReturnType<typeof Object>] ?? `${base} bg-muted text-muted-foreground`
  )
}

function getBillingPeriodText(period: string) {
  const periodMap: { [key: string]: string } = {
    "month": "Mensual",
    "year": "Anual",
    "Monthly": "Mensual",
    "Yearly": "Anual"
  };
  return periodMap[period] || period;
}

export default function SubscriptionsTableSoporte() {
  const { data: session, status } = useSession()
  const email = session?.user?.email

  // Key dinámica para SWR - mostrar solo los primeros 100
  const fetchKey = () => {
    if (!email) return null
    const params = new URLSearchParams({
      page: '1',
      pageSize: '100',
    })
    return `/api/strapi-subscriptions?${params.toString()}`
  }

  const { data: response, error, isLoading } = useSWR<{ data: Subscription[], meta: any }>(fetchKey, fetcher)
  const data = response?.data || []

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
              {/* <TableHead>Producto</TableHead> */}
              <TableHead>Precio</TableHead>
              <TableHead>Siguente pago</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(sub => (
              <TableRow key={sub.id} className="hover:bg-muted/50">
                <TableCell>#{sub.id_woo}</TableCell>
                <TableCell>
                  <span className={statusClasses(sub.status_woo || sub.status)}>
                    {sub.status_woo || sub.status}
                  </span>
                </TableCell>
                {/* <TableCell>{sub.product_name || '—'}</TableCell> */}
                <TableCell>
                  <span className="font-medium">
                    ${sub.total || sub.price || '0'} / {getBillingPeriodText(sub.billing_period)}
                  </span>
                </TableCell>
                <TableCell>
                  {sub.next_payment_date_gmt ? (() => {
                    const nextPaymentDate = new Date(sub.next_payment_date_gmt);
                    const today = new Date();
                    const diffTime = nextPaymentDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 7 && diffDays > 0) {
                      return `En ${diffDays} día${diffDays === 1 ? '' : 's'}`;
                    } else if (diffDays === 0) {
                      return 'hoy';
                    } else if (diffDays < 0) {
                      return 'Vencido';
                    } else {
                      return nextPaymentDate.toLocaleDateString('es-ES');
                    }
                  })() : '—'}
                </TableCell>
                <TableCell>
                  <CheckoutButton
                    buttonText="Ver"
                    redirectUrl={`/my-account/view-subscription/${sub.id_woo}/`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Información de suscripciones */}
      <div className="flex justify-center items-center mt-4">
        {response?.meta?.pagination && (
          <span className="text-sm text-muted-foreground">
            Mostrando {data.length} de {response.meta.pagination.total} suscripciones
          </span>
        )}
      </div>
    </div>
  )
}
