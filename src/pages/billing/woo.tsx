'use client'

import useSWR from 'swr'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import Skeleton from '@/components/loaders/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

/* ------------------------------------ */
/* Helper para colorear el estado       */
/* ------------------------------------ */
function statusClasses(status: string) {
  const base = 'inline-block rounded-full px-2 py-[2px] text-xs font-semibold capitalize'
  return (
    {
      active: `${base} bg-green-100 text-green-700`,
      pending: `${base} bg-yellow-100 text-yellow-700`,
      'on-hold': `${base} bg-yellow-100 text-yellow-700`,
      cancelled: `${base} bg-red-100 text-red-700`,
      expired: `${base} bg-gray-200 text-gray-600`,
    }[status as keyof ReturnType<typeof Object>] ?? `${base} bg-gray-100 text-gray-700`
  )
}

export default function SubscriptionsTableSoporte() {
  const EMAIL = 'soporte@wazend.net'
  const { data, error, isLoading } = useSWR(
    `/api/subscriptions?email=${encodeURIComponent(EMAIL)}`,
    fetcher,
  )

  if (isLoading) {
    return (
      <>
        <Skeleton />
      </>
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
    return <p>No hay suscripciones para {EMAIL}.</p>
  }

  return (
    <div className=" bg-white rounded-lg shadow-md p-4">
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

              {/* Estado con color */}
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
    </div>
  )
}
