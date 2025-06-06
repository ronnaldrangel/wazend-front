import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/layout/auth';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Button, buttonVariants } from '@/components/ui/button';
import Spin from '@/components/loaders/spin';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EmailConfirm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch(`${strapiUrl}/api/auth/send-email-confirmation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Se ha enviado un enlace de confirmación a su correo.');
        toast.success('Se ha enviado un correo para confirmar su cuenta.');
        setEmail('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'An error occurred while processing your request.');
        toast.error(errorData.message || 'An error occurred.');
      }
    } catch (error) {
      setMessage('There was an error processing your request.');
      toast.error('An error has occurred.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>

      <div className="mt-8 flex flex-col">
        <CheckCircleIcon
          className="h-auto w-10 text-green-400 dark:text-green-500 mb-4"
        />
          <p className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Te has registrado correctamente.
          </p>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Revisa tu correo para confirmar tu cuenta antes de iniciar
            sesión en el panel de control de{' '}
            {process.env.NEXT_PUBLIC_APP_NAME || 'My App'}.
          </p>
          {/* <p className="mt-2 text-sm font-medium text-red-500">
            Si no recibes el correo, por favor revisa tu carpeta de Spam o escribe tu correo y te
            reenviaremos el enlace de confirmación.
          </p> */}
      </div>


      <div className="mt-6 border-t pt-6 border-gray-200">
        <p className="text-balance text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            ¿No recibiste el correo electrónico?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Introduce tu email y te reenviaremos el enlace de confirmación.
          </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spin className="mr-2" /> Cargando
              </>
            ) : (
              'Reenviar correo de confirmación'
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
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
