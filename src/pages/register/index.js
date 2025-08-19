import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/layout/auth';
import Spin from '../../components/loaders/spin';
import SignSocial from '../login/SignSocial';
import PhoneInput from '../../components/ui/phone-input';
import { Button, buttonVariants } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false
  });
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePasswordConditions(value);
  };
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value || '' });
  };
  const generateUsername = (email) =>
    email.replace(/[^a-zA-Z0-9]/g, '');
  const validatePasswordConditions = (password) => {
    setPasswordConditions({
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      length: password.length >= 6
    });
  };
  const isPasswordValid = () =>
    Object.values(passwordConditions).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const username = generateUsername(formData.email);
      await axios.post(
        `${strapiUrl}/api/auth/local/register`,
        {
          username,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Registro exitoso.');
      await axios.post(
        process.env.NEXT_PUBLIC_REGISTER,
        { username, name: formData.name, email: formData.email, phone: formData.phone }
      );
      router.replace('/email-confirmation');
    } catch {
      toast.error('Ya existe esa cuenta en nuestro sistema.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePasswordFocus = () => setShowPasswordConditions(true);

  return (
    <Layout>
      <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-foreground">
        🎉 Regístrate y obtén tu prueba gratis
      </h2>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Nombre */}
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Nombre completo"
          placeholder="Tu nombre completo"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        {/* Email */}
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        {/* WhatsApp */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium leading-6 text-foreground"
          >
            WhatsApp (opcional)
          </label>
          <PhoneInput
            id="phone"
            name="phone"
            placeholder="Ingresa tu número"
            defaultCountry="ES"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="mt-2 w-full"
          />
          <p className="mt-2 text-xs text-muted-foreground">Solo para contacto y soporte</p>
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-foreground"
          >
            Contraseña
          </label>
          <div className="relative mt-2">
            <FormInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onFocus={handlePasswordFocus}
              required
              className="pr-10"
              rightElement={
                <Button
                  type="button"
                  variant="iconOnly"
                  size="auto"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </Button>
              }
            />
          </div>
        </div>

        {/* Condiciones de contraseña */}
        {showPasswordConditions && (
          <ul className="mt-2 space-y-1 text-sm">
            {[
              ['uppercase', 'Una letra mayúscula'],
              ['lowercase', 'Una letra minúscula'],
              ['number', 'Un número'],
              ['specialChar', 'Un carácter especial'],
              ['length', 'Al menos 6 caracteres'],
            ].map(([key, label]) => (
              <li
                key={key}
                className={`flex items-center space-x-2 ${passwordConditions[key] ? 'text-primary' : 'text-gray-500'
                  }`}
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Botón de registro */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isPasswordValid()}
        >
          {isSubmitting ? (
            <>
              <Spin className="mr-2" /> Cargando
            </>
          ) : (
            'Regístrate'
          )}
        </Button>
      </form>

      {/* <SignSocial /> */}

      <p className="mt-10 text-center text-sm text-muted-foreground">
        ¿Tienes una cuenta?{' '}
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
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};