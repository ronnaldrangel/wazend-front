import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ArrowTopRightOnSquareIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router';
import Link from 'next/link';

import md5 from 'md5';

import { signOut, useSession } from 'next-auth/react';

import Image from 'next/image';

// const user = {
//   name: 'Tom Cook',
//   email: 'tom@example.com',
//   imageUrl:
//     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
// }

const navigation = [
  { name: 'Dashboard', href: '/'},
  { name: 'Herramientas', href: '/tools'},
  { name: 'Grupo VIP', href: 'https://api.whatsapp.com/send?phone=51924079147&text=Hola%20soy%20cliente%20y%20quiero%20unirme%20al%20grupo%20VIP%20de%20Wazend%2C%20mi%20correo%20es', external: true},
  { name: 'Documentación', href: 'https://help.wazend.net/', external: true},
]
const userNavigation = [
  { name: 'Tu perfil', href: '/profile' },
  { name: 'Facturación', href: 'https://wazend.lemonsqueezy.com/billing', external: false},
  { name: 'Cerrar sesión', href: '#', signOut: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(router.pathname);

  const { data: session } = useSession();

  // Avatar Retro
  const getGravatarUrl = (email, size = 200) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=retro`;
  };

  const userEmail = session?.user?.email || 'nulled';
  const avatarUrl = getGravatarUrl(userEmail);
  // Avatar Retro

  useEffect(() => {
    const handleRouteChange = (url) => {
      setCurrentPath(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm border-b border-gray-100">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <Image
                        className="block h-8 w-auto lg:hidden"
                        src="/images/icon-dark.svg"
                        alt="Wazend Logo"
                        width={236} // Ajusta el ancho deseado
                        height={60} // Ajusta la altura deseada
                      />
                      <Image
                        className="hidden h-8 w-auto lg:block"
                        src="/images/icon-dark.svg"
                        alt="Wazend Logo"
                        width={236} // Ajusta el ancho deseado
                        height={60} // Ajusta la altura deseada
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
                            ? 'border-emerald-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                        )}
                        aria-current={currentPath === item.href ? 'page' : undefined}
                        target={item.external ? "_blank" : undefined}
                      >
                        {item.name}
                        {item.external && <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 text-gray-500" />}
                      </Link>
                    ))}
                  </div>
                </div>

                {session && (
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {/* <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                    <div className='relative'>
                      <p className='text-gray-500 text-sm font-medium lg:block hidden'>
                        {session.user.email}
                      </p>
                    </div>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={avatarUrl} alt="" />
                        </Menu.Button>
                      </div>
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
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  onClick={item.signOut ? signOut : undefined}
                                  target={item.external ? "_blank" : undefined}
                                >
                                  <div className='flex items-center'>
                                  {item.name}
                                  {item.external && <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-2 text-gray-700" />}
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}


                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                    <span className="absolute -inset-0.5" />
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


            {session && (
              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        currentPath === item.href
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                      )}
                      aria-current={currentPath === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={avatarUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">User #{session.id}</div>
                      <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                    </div>
                    {/* <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          onClick={item.signOut ? signOut : undefined}
                          target={item.external ? "_blank" : undefined}
                        >
                          {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>

            )}

          </>
        )}
      </Disclosure>

    </>
  )
}
