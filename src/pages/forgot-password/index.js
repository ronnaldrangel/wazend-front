import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/auth';
import { getSession } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Spin from '../../components/loaders/spin';
import { PageTitle } from '@/hooks/use-page-title';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ForgotPassword() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error(t('securityVerification'));
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken }),
      });

      if (response.ok) {
        toast.success(t('emailSent'));
        router.replace('/login');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || t('emailError'));
      }
    } catch {
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title={t('forgotPasswordTitle')} />
      <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-foreground">
        {t('forgotPasswordTitle')}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {t('forgotPasswordDescription')}
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="email"
          name="email"
          type="email"
          label={t('email')}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

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

        <Button type="submit" className="w-full" disabled={isSubmitting || !turnstileToken}>
          {isSubmitting ? (
            <>
              <Spin className="mr-2" /> {t('loading')}
            </>
          ) : (
            t('sendResetLink')
          )}
        </Button>
      </form>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        {t('haveAccount')}{' '}
        <Link href="/login" className={buttonVariants({ variant: 'link', size: 'md' })}>
          {t('signIn')}
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
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
};
