import Layout from '../components/layout/auth';
import { getSession } from 'next-auth/react';

import { CheckCircleIcon } from '@heroicons/react/20/solid';


export default function EmailConfirm() {
  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-lg max-w-md w-full text-left mt-8 flex items-start">
        <CheckCircleIcon className="h-auto w-20 text-green-400 dark:text-green-500 mr-3" />
        <div>
          <p className="text-balance text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Te has registrado correctamente.
          </p>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión en el panel de control de Wazend.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  // Check if session exists or not, if not, redirect
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};