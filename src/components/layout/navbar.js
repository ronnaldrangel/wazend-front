import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import LogoGravatar from '@/components/layout/logo'
import ToggleMode from '../ui/toggle-mode'

const navigation = [
  { name: 'Prueba gratis', href: '/trial', trial: true },
  { name: 'Mis servicios', href: '/' },
  { name: 'Facturación', href: '/billing' },
  { name: 'Recomienda & Gana', href: '/affiliates' },
  // { name: 'Documentación', href: 'https://docs.wazend.net/', external: true },
]

const userNavigation = [
  { name: 'Tu perfil', href: '/profile' },
  { name: 'Ayuda', href: 'https://docs.wazend.net/', external: true },
  { name: 'Contactenos', href: 'https://wazend.net/contact', external: true  },
  { name: 'Cerrar sesión', href: '/', signOut: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState(router.pathname)
  const { data: session } = useSession()

  useEffect(() => {
    const handleRouteChange = (url) => setCurrentPath(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => router.push('/login'))
  }

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 relative z-10">
      {({ open }) => (
        <>
          {/* Desktop nav */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              {/* Logo + Primary links */}
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Image
                      className="block h-7 w-auto lg:hidden"
                      src={process.env.NEXT_PUBLIC_LOGO || '/images/logo.svg'}
                      alt="Logo"
                      width={236}
                      height={60}
                    />
                    <Image
                      className="hidden h-7 w-auto lg:block"
                      src={process.env.NEXT_PUBLIC_LOGO || '/images/logo.svg'}
                      alt="Logo"
                      width={236}
                      height={60}
                    />
                  </Link>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        currentPath === item.href
                          ? 'border-primary text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                      aria-current={currentPath === item.href ? 'page' : undefined}
                      target={item.external ? '_blank' : undefined}
                    >
                      <span className={item.trial ? 'bg-primary text-white px-2 py-1 rounded-lg' : ''}>
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User menu + toggle */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
                {session && (
                  <>
                    <p className="text-gray-500 text-sm font-medium hidden lg:block">{session.user.name}</p>
                    <Menu as="div" className="relative ml-3">
                      <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <LogoGravatar email={session.user.email} size={40} />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.signOut ? 'text-red-500' : '',
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  onClick={item.signOut ? handleSignOut : undefined}
                                  target={item.external ? '_blank' : undefined}
                                >
                                  <div className="flex items-center">
                                    {item.name}
                                    {item.external && (
                                      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-2 text-gray-700" />
                                    )}
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden -mr-2">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Backdrop overlay when menu is open */}
          {open && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity sm:hidden z-20"
              aria-hidden="true"
              onClick={() => document.querySelector('[aria-label="Close main menu"]').click()}
            />
          )}

          {/* Mobile menu - Off Canvas */}
          {session && (
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="transform -translate-x-full"
              enterTo="transform translate-x-0"
              leave="transition ease-in duration-300"
              leaveFrom="transform translate-x-0"
              leaveTo="transform -translate-x-full"
            >
              <Disclosure.Panel
                className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-30 overflow-y-auto sm:hidden"
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                  <Image
                    className="h-8 w-auto"
                    src={process.env.NEXT_PUBLIC_LOGO || '/images/logo.svg'}
                    alt="Logo"
                    width={236}
                    height={60}
                  />
                  <Disclosure.Button
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Close main menu"
                  >
                    {/* <XMarkIcon className="h-6 w-6" aria-hidden="true" /> */}
                  </Disclosure.Button>
                </div>

                <div className="space-y-1 py-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={classNames(
                        currentPath === item.href
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                      )}
                      aria-current={currentPath === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>

                <div className="border-t border-gray-200 py-4">
                  <div className="flex items-center px-4">
                    <LogoGravatar email={session.user.email} size={40} className="h-10 w-10 rounded-full" />
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{session.user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={item.external ? 'a' : Link}
                        href={item.href}
                        className={classNames(
                          item.signOut ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-800',
                          'block px-4 py-2 text-base font-medium hover:bg-gray-100'
                        )}
                        onClick={(e) => {
                          if (item.signOut) {
                            e.preventDefault()
                            handleSignOut()
                          }
                        }}
                        target={item.external ? '_blank' : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          )}
        </>
      )}
    </Disclosure>
  )
}