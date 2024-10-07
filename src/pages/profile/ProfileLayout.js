import Layout from '../../layout/dashboard';
import { UserCircleIcon, Cog6ToothIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Profile({ children }) {
  const router = useRouter();
  const currentRoute = router.pathname;

  // Lista de botones con información de cada uno
  const menuItems = [
    { name: 'General', icon: UserCircleIcon, path: '/profile' },
    { name: 'Preferencias', icon: Cog6ToothIcon, path: '/profile/preferences' },
    { name: 'Facturas', icon: DocumentTextIcon, path: '/profile/invoices' },
  ];

  return (
    <>
      <Layout title="Perfil">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Primera columna: Menú de navegación */}
          <div className="w-full md:w-1/4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`w-full px-4 py-2 text-left text-sm font-base text-gray-700 rounded-md flex items-center gap-x-2 ${
                    currentRoute === item.path ? 'bg-gray-200' : 'hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="h-5 w-5 text-gray-700" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* aca children*/}
          {children}
            
        </div>
      </Layout>
    </>
  );
}
