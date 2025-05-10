import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import Layout from '../../components/layout/auth';
import Spin from '../../components/loaders/spin';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import SignSocial from '../../components/SignSocial';
import { Button, buttonVariants } from '@/components/ui/button';

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[email][$eq]=${email}`,
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` } }
      );
      const data = await res.json();
      return data.length > 0 ? { exists: true, confirmed: data[0].confirmed } : { exists: false };
    } catch {
      return { exists: false };
    }
  };

  return (
    <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Iniciar sesión 👋
      </h2>

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@ejemplo.com"
            required
            className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Contraseña
            </label>
            <Link
              href="/forgot-password"
              className={buttonVariants({ variant: 'link', size: 'md' })}
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="block w-full rounded-md border-0 py-1.5 pr-10 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spin className="mr-2" /> Cargando
            </>
          ) : (
            'Ingresa'
          )}
        </Button>
      </form>

      <SignSocial />

      <p className="mt-10 text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{' '}
        <Link href="/register" className={buttonVariants({ variant: 'link', size: 'md' })}>
          Regístrate ahora
        </Link>
      </p>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};
