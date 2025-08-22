import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Spin from '../../components/loaders/spin';
import { PageTitle } from '@/hooks/use-page-title';

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
    <>
      <PageTitle title="Restablecer contraseña" />
      <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Restablecer contraseña
      </h2>

      <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
        {/* Contraseña */}
        <FormInput
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
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
              onClick={toggleShow}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </Button>
          }
        />

        {/* Confirmar contraseña */}
        <FormInput
          id="passwordConfirmation"
          name="passwordConfirmation"
          type={showPassword ? 'text' : 'password'}
          label="Confirmar contraseña"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          minLength={6}
          required
          className="pr-10"
          rightElement={
            <Button
              type="button"
              variant="iconOnly"
              size="auto"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={toggleShow}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </Button>
          }
        />

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
