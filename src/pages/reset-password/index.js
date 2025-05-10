import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import Spin from '../../components/loaders/spin';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ResetPassword() {
  const router = useRouter();
  const { code } = router.query;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${strapiUrl}/api/auth/reset-password`,
        { code, password, passwordConfirmation },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Contraseña restablecida con éxito.');
      router.replace('/login');
    } catch {
      toast.error('Ha ocurrido un error.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShow = () => setShowPassword((v) => !v);

  return (
    <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Restablecer contraseña
      </h2>

      <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Contraseña
          </label>
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
              onClick={toggleShow}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
            Confirmar contraseña
          </label>
          <div className="relative mt-2">
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              minLength={6}
              required
              className="block w-full rounded-md border-0 py-1.5 pr-10 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              onClick={toggleShow}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Botón */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Spin className="mr-2" /> Cargando
            </>
          ) : (
            'Restablecer contraseña'
          )}
        </Button>
      </form>

      {/* Volver al login */}
      <p className="mt-10 text-center text-sm text-gray-500">
        <Link href="/login" className={buttonVariants({ variant: 'link', size: 'md' })}>
          Volver al inicio de sesión
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
