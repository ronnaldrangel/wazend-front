import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { Turnstile } from '@marsidev/react-turnstile';
import Layout from '../../components/layout/auth';
import Spin from '../../components/loaders/spin';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SignSocial from './SignSocial';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { PageTitle } from '@/hooks/use-page-title';

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  // ref para asegurarnos de que solo mostramos 1 toast
  const activatedToastRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    // solo si viene activation=true y aún no lo mostramos
    if (router.query.activation === 'true' && !activatedToastRef.current) {
      activatedToastRef.current = true;
      toast.success('Cuenta activada exitosamente.');
      // limpiar query param sin forzar nuevo fetch de página
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router.isReady, router.query.activation, router.pathname, router]);


  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error('Por favor, completa la verificación de seguridad.');
      return;
    }
    
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
      turnstileToken,
    });

    if (result.ok) {
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
      router.replace(callbackUrl || '/');
      toast.success('Sesión iniciada correctamente.');
    } else {
      const userCheck = await checkUserConfirmation(e.target.email.value);
      if (userCheck.exists && !userCheck.confirmed) {
        router.push('/email-confirmation');
      } else {
        toast.error('Credenciales incorrectas');
      }
      setIsSubmitting(false);
    }
  };

  const checkUserConfirmation = async (email) => {
    try {
      const res = await fetch(`/api/auth/check-user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      return data;
    } catch {
      return { exists: false };
    }
  };

  return (
    <>
      <PageTitle title="Iniciar sesión" />
      <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-foreground">
        Iniciar sesión 👋
      </h2>

      <SignSocial />
      <form className="mt-6 space-y-6" onSubmit={onSubmit}>
        {/* Email */}
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
              Contraseña
            </label>
            <Link
              href="/forgot-password"
              className={buttonVariants({ variant: 'link', size: 'md' })}
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          <FormInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            className="pr-10"
            rightElement={
              <Button
                type="button"
                variant="iconOnly"
                size="auto"
                className="absolute inset-y-0 right-0 flex items-center px-3"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </Button>
            }
          />
        </div>

        {/* Cloudflare Turnstile */}
        <div className="flex justify-start">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_SITE_KEY_CLOUDFLARE}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken('')}
            onExpire={() => setTurnstileToken('')}
            theme="auto"
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting || !turnstileToken}>
          {isSubmitting ? (
            <>
              <Spin className="mr-2" /> Cargando
            </>
          ) : (
            'Ingresa'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link href="/register" className={buttonVariants({ variant: 'link', size: 'md' })}>
          Regístrate ahora
        </Link>
      </p>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};
