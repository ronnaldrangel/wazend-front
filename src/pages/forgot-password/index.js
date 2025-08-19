import { useState, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/auth';
import { getSession } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Spin from '../../components/loaders/spin';
import TurnstileWidget from '@/components/ui/turnstile';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const router = useRouter();
  const turnstileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error('Por favor, completa la verificación de seguridad.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`${strapiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken }),
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
      // Reset Turnstile on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken('');
      setIsSubmitting(false);
    }
  };

  return (
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

        {/* Turnstile */}
        <TurnstileWidget
          ref={turnstileRef}
          onVerify={setTurnstileToken}
          onError={() => {
            setTurnstileToken('');
            toast.error('Error en la verificación de seguridad. Inténtalo de nuevo.');
          }}
          onExpire={() => {
            setTurnstileToken('');
            toast.warning('La verificación de seguridad ha expirado. Por favor, verifica nuevamente.');
          }}
          className="flex justify-center"
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || !turnstileToken}>
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
