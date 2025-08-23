import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/layout/auth';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Spin from '@/components/loaders/spin';
import { PageTitle } from '@/hooks/use-page-title';

export default function EmailConfirm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/strapi/auth/send-email-confirmation', {
        method: 'POST',
        headers: {
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
    <>
      <PageTitle title="Confirmación de email" />
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
            sesión. Si no recibiste el correo, renvíalo en el formulario de abajo.
          </p>
          {/* <p className="mt-2 text-sm font-medium text-red-500">
            Si no recibes el correo, por favor revisa tu carpeta de Spam o escribe tu correo y te
            reenviaremos el enlace de confirmación.
          </p> */}
      </div>


      <div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Correo electrónico" 
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

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

        <div className="mt-4 text-center">
          <a
            href="/"
            className={buttonVariants({
              variant: "link",
              className: "text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            })}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </Layout>
    </>
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
