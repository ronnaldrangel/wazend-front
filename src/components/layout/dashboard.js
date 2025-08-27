import React from 'react';
import Navbar from './navbar';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/20/solid';
import WhatsAppButton from '../../components/WhatsAppButton';
import Biblia from './bible';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from "@/components/lenguage-switcher"

export default function Layout({ children, title, cta }) {
  return (
    <div className="flex flex-col min-h-screen">    {/* <- actualizado */}

      {/* ─── NAVBAR STICKY ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      {/* ──────────────────────────────────────────────────────────────── */}



      <div >
        <div className='mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8'>
          <Biblia />
        </div>
      </div>

      {title && (
        <header className=''>
          <div className="mx-auto max-w-7xl py-0 px-4 sm:px-6 lg:px-8 flex items-center justify-between ">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {cta && (
              <Button asChild variant="default" className='p-6'>
                <Link href="/upgrade/">
                  <PlusIcon />
                  <span className="text-sm lg:text-base font-semibold">Comprar servicios</span>
                </Link>
              </Button>
            )}
          </div>
        </header>
      )}

      <main className="flex-1">   {/* <- ocupa el alto restante */}
        <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
        <WhatsAppButton />
      </main>

      {/* FOOTER */}
      <footer>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-row items-center justify-between text-sm text-muted-foreground">
          
          <LanguageSwitcher />

          <Link href={`${(process.env.NEXT_PUBLIC_URL)}/terms-of-service/`} className="hover:text-foreground underline-offset-4 hover:underline text-right">
            Términos del Servicio y Condiciones de Uso
          </Link>

        </div>
      </footer>
    </div>
  );
}
