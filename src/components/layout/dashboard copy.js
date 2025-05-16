import React from 'react';
import Navbar from './navbar';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/20/solid';
import WhatsAppButton from '../../components/WhatsAppButton';
import Biblia from './bible';
import { Button } from '@/components/ui/button';

export default function Layout({ children, title }) {
  return (
    <div className="min-h-full">
      <Navbar />

      {title && (
        <header className="bg-white shadow-sm shadow-gray-300">
          <div className="mx-auto max-w-7xl py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              {title}
            </h1>
            <Button asChild variant="default" size="sm">
              <Link href="/upgrade/" className="inline-flex items-center">
                <PlusIcon className="h-5 w-auto" aria-hidden="true" />
                <span className="text-sm font-medium">Contratar ahora</span>
              </Link>
            </Button>
          </div>
        </header>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <Biblia />
      </div>

      <main>
        <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
        <WhatsAppButton />
      </main>
    </div>
  );
}
