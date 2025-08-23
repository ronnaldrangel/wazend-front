// components/Layout.js

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import ToggleMode from '../ui/toggle-mode';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className="h-screen bg-background">

      <div className="flex min-h-full flex-1">

      <div className="relative hidden w-1/2 lg:block">
          {process.env.NEXT_PUBLIC_AUTH_BG?.endsWith('.mp4') ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={process.env.NEXT_PUBLIC_AUTH_BG} type="video/mp4" />
            </video>
          ) : (
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src={process.env.NEXT_PUBLIC_AUTH_BG || '/images/bg-auth.png'}
              alt="Background"
              width={960}
              height={1080}
            />
          )}
        </div>

        <div className="flex flex-1 w-1/2 flex-col justify-center px-8 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">

            <Link href="/">
              {/* Logo claro - visible en modo claro */}
              <Image
                className={`block h-${process.env.NEXT_PUBLIC_LOGO_HEIGHT || '7'} w-auto dark:hidden`}
                src={process.env.NEXT_PUBLIC_LOGO || '/images/logo.svg'}
                alt="Logo"
                width={236}
                height={60}
              />
              {/* Logo oscuro - visible en modo oscuro */}
              <Image
                className={`hidden h-${process.env.NEXT_PUBLIC_LOGO_HEIGHT || '7'} w-auto dark:block`}
                src={process.env.NEXT_PUBLIC_LOGO_DARK || '/images/logo-dark.svg'}
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
