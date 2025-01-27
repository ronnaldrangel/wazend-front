// components/Layout.js

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToggleMode from '../ui/toggle-mode';

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-white dark:bg-zinc-900">
      <div className="flex min-h-full flex-1">

      <div className="relative hidden w-1/2 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/bg-register.webp"
            alt="Wazend Login Background"
            width={960} // Ajusta el ancho deseado
            height={1080} // Ajusta la altura deseada
          />
        </div>

        <div className="flex flex-1 w-1/2 flex-col justify-center px-8 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">

            <Link href="/">
              <Image
                className="h-8 w-auto dark:hidden"
                src="/images/logo-light.svg"
                alt="Wazend Logo - Light"
                width={236}
                height={60}
              />
              <Image
                className="h-8 w-auto hidden dark:block"
                src="/images/logo-dark.svg"
                alt="Wazend Logo - Dark"
                width={236}
                height={60}
              />
            </Link>

            <main>{children}</main>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;
