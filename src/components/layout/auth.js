// components/Layout.js

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NEXT_PUBLIC_AUTH_BG, NEXT_PUBLIC_LOGO } from '../../../config/config';

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-white dark:bg-zinc-900">
      <div className="flex min-h-full flex-1">

      <div className="relative hidden w-1/2 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={NEXT_PUBLIC_AUTH_BG}
          alt="Background"
          width={960} // Ajusta el ancho deseado
          height={1080} // Ajusta la altura deseada
        />
      </div>

      <div className="flex flex-1 w-1/2 flex-col justify-center px-8 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link href="/">
            <Image
              className="h-8 w-auto"
              src={NEXT_PUBLIC_LOGO}
              alt="Logo"
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
