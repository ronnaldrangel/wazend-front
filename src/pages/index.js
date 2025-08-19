import Layout from '@/components/layout/dashboard';
import React from 'react';
import { useRouter } from 'next/router';
import SubsList from './dashboard/subs-list';
import Bulletin from './dashboard/bulletin';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Mis servicios" cta="true">


      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <SubsList />
        </div>
        <div className="w-full md:w-1/3">
          <Bulletin />
        </div>
      </div>
      

      <div className="mt-6 w-full bg-card shadow-sm border border-border rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground font-medium text-md md:text-base">¿Necesitas ayuda?</span>
          </div>
          <span className="text-muted-foreground font-normal text-md md:text-base md:ml-0">
            Aquí puedes consultar la base de conocimientos y ver nuestros tutoriales.
          </span>
        </div>

        <Link href="https://docs.wazend.net/" target='_blank_' className="flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-md md:text-base whitespace-nowrap">
          Explora la base de conocimientos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>


    </Layout>
  );
};

