import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/auth';
import { getSession } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Spin from '../../components/loaders/spin';
import { PageTitle } from '@/hooks/use-page-title';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Se envió un correo para restablecer la contraseña.');
        router.replace('/login');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al enviar el correo.');
      }
    } catch {
      toast.error('Ha ocurrido un error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title="Recuperar contraseña" />
      <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-foreground">
        Recuperar contraseña
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Escribe tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>

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
            'Enviar correo de reinicio'
          )}
        </Button>
      </form>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className={buttonVariants({ variant: 'link', size: 'md' })}>
          Iniciar sesión
        </Link>
      </p>
    </Layout>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: { destination: '/', permanent: false },
    };
  }
  return { props: {} };
};
