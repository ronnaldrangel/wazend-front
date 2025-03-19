import { Disclosure } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()

  return (
    <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-100 dark:bg-gray-900 dark:border-gray-700">
      {() => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo a la izquierda */}
              <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-8 w-auto lg:hidden dark:hidden"
                    src="/images/icon-dark.svg"
                    alt="Wazend Logo"
                    width={236}
                    height={60}
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block dark:hidden"
                    src="/images/icon-dark.svg"
                    alt="Wazend Logo"
                    width={236}
                    height={60}
                  />
                  {/* Logo para modo oscuro */}
                  <Image
                    className="hidden dark:block h-8 w-auto"
                    src="/images/icon-light.svg"
                    alt="Wazend Logo"
                    width={236}
                    height={60}
                  />
              </div>

              {/* Texto a la derecha con fondo verde y bordes redondeados */}
              <div className="flex items-center">
                <span className="bg-green-700 text-white font-semibold px-4 py-1 rounded-full text-sm">
                  Instancia compartida
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
