import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PageTitle } from '@/hooks/use-page-title';

export default function Error404() {
  return (
    <>
      <PageTitle title="404 - Página no encontrada" />
      <div className="h-screen">
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-bold text-primary">404</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Página no encontrada
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
              La página que estás buscando no existe o ha sido movida
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild variant="default">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}