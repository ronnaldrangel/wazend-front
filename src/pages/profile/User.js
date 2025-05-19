import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import OrderSkeleton from '@/components/loaders/skeleton';
import LogoGravatar from '@/components/layout/logo';
import { Button } from '@/components/ui/button';

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function User() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'authenticated' && session?.jwt) {
          const response = await fetch(`${strapiUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${session.jwt}` }
          });
          if (!response.ok) throw new Error('Error al obtener datos');
          const result = await response.json();
          setData(result);
          setName(result.name || '');
          setPhone(result.phone || '');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status, session]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    try {
      const response = await fetch(`${strapiUrl}/api/users/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        body: JSON.stringify({ name, phone })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'Error al actualizar perfil');
      toast.success('Perfil actualizado con éxito');
      setData(result);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setIsSubmittingPassword(true);
    try {
      const response = await fetch(`${strapiUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'Error al actualizar la contraseña');
      toast.success('Contraseña actualizada con éxito');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (status === 'loading' || loading) return <OrderSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <OrderSkeleton />;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <LogoGravatar
            email={session.user.email}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
          />
          <div>
            <p className="text-base font-bold text-gray-800">
              {data.name || 'Nombre no disponible'}
            </p>
            <p className="text-gray-800 text-sm">
              {data.email || 'Email no disponible'}
            </p>
            <p className="text-gray-800 text-sm">
              Sesión con: {data.provider === 'local' ? 'Email' : data.provider.charAt(0).toUpperCase() + data.provider.slice(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <p className="text-lg font-semibold text-black mb-2">Información del perfil</p>
        <p className="text-gray-500 text-sm mb-8">
          Actualice la información del perfil y la dirección de correo electrónico de su cuenta.
        </p>

        <form className="space-y-6" onSubmit={handleProfileUpdate}>
          <div className="w-full space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese su nombre"
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value === '' || regex.test(e.target.value)) {
                    setPhone(e.target.value);
                  }
                }}
                placeholder="Ingrese su teléfono"
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmittingProfile}>
                {isSubmittingProfile ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <p className="text-lg font-semibold text-black mb-2">Actualizar contraseña</p>
        <p className="text-gray-500 text-sm mb-8">
          Asegúrese de que su cuenta utilice una contraseña larga y aleatoria para mantenerla segura.
        </p>

        <form className="space-y-6" onSubmit={handlePasswordUpdate}>
          <div className="w-full space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-black">
                Contraseña actual
              </label>
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-black">
                Nueva contraseña
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-black">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? 'Guardando...' : 'Actualizar contraseña'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
