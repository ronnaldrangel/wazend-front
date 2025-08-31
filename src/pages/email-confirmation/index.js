import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Turnstile } from '@marsidev/react-turnstile';
import Layout from '@/components/layout/auth';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import Spin from '@/components/loaders/spin';
import { PageTitle } from '@/hooks/use-page-title';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function EmailConfirm() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error(t('securityVerification'));
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/strapi/auth/send-email-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken }),
      });

      if (response.ok) {
        setMessage(t('confirmationEmailSent'));
        toast.success(t('confirmationEmailSuccess'));
        setEmail('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || t('requestError'));
        toast.error(errorData.message || t('error'));
      }
    } catch (error) {
      setMessage(t('requestError'));
      toast.error(t('error'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title={t('email')} />
      <Layout>

      <div className="mt-8 flex flex-col">
        <CheckCircleIcon
          className="h-auto w-10 text-green-400 dark:text-green-500 mb-4"
        />
          <p className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {t('registrationSuccess')}
          </p>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('emailConfirmationInstructions')}
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
              t('resendConfirmationEmail')
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
            {t('backToHome')}
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
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
};
