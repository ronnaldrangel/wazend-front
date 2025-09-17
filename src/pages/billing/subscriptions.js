'use client'

import React from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/loaders/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import CheckoutButton from './checkout.js'

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = async (url, jwt) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la solicitud: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener datos de Strapi:', error);
    throw error;
  }
};

function statusClasses(status) {
  const base = 'inline-block rounded-full px-2 py-[2px] text-xs font-semibold capitalize'
  return (
    {
      active: `${base} bg-green-500/10 text-green-600 dark:text-green-400`,
      pending: `${base} bg-yellow-500/10 text-yellow-600 dark:text-yellow-400`,
      'on-hold': `${base} bg-yellow-500/10 text-yellow-600 dark:text-yellow-400`,
      cancelled: `${base} bg-destructive/10 text-destructive`,
      expired: `${base} bg-muted text-muted-foreground`,
      paused: `${base} bg-blue-500/10 text-blue-600 dark:text-blue-400`,
    }[status] ?? `${base} bg-muted text-muted-foreground`
  )
}

function getBillingPeriodText(period) {
  const periodMap = {
    "month": "Mensual",
    "year": "Anual",
    "Monthly": "Mensual",
    "Yearly": "Anual"
  };
  return periodMap[period] || period;
}

export default function SubscriptionsTableSoporte() {
  const { data: session } = useSession()
  const jwt = session?.jwt
  const email = session?.user?.email

  const { data, error, isLoading } = useSWR(
    jwt ? `${strapiUrl}/api/users/me?populate[subscriptions][populate]=instances` : null,
    (url) => fetcher(url, jwt)
  );

  // Estados tempranos
  if (isLoading) {
    return <Skeleton />
  }

  if (!session || !jwt) {
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

  if (!data?.subscriptions || data.subscriptions.length === 0) {
    return <p>No hay suscripciones para {email}.</p>
  }

  const subscriptions = data.subscriptions;

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Siguente pago</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-muted/50">
                <TableCell>#{sub.id_woo}</TableCell>
                <TableCell>
                  <span className={statusClasses(sub.status_woo || sub.status)}>
                    {sub.status_woo || sub.status}
                  </span>
                </TableCell>
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
    </div>
  )
}
