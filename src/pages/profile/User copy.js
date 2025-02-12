import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import OrderSkeleton from '../../components/loaders/OrderSkeleton';
import LogoGravatar from '../../components/LogoGravatar';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'authenticated' && session?.jwt) {
          const response = await fetch(`${strapiUrl}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${session.jwt}`,
            },
          });

          if (!response.ok) {
            throw new Error('Error al obtener datos');
          }

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
    setIsSubmitting(true);

    try {
      const response = await fetch(`${strapiUrl}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message || 'Error al actualizar perfil');
      }

      toast.success('Perfil actualizado con éxito');
      setData(result);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`${strapiUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message || 'Error al actualizar la contraseña');
      }

      toast.success('Contraseña actualizada con éxito');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || loading) return <OrderSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <OrderSkeleton />;

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mb-6">
        <p className="text-2xl font-semibold">Mi perfil</p>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col p-10">
          <p className="text-lg font-semibold text-black mb-2">Información del perfil</p>
          <form className="space-y-6" onSubmit={handleProfileUpdate}>
            <div>
              <label className="block text-sm font-medium text-black">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Ingrese su nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Ingrese su teléfono"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-6">
        <div className="flex flex-col p-10">
          <p className="text-lg font-semibold text-black mb-2">Actualizar contraseña</p>
          <form className="space-y-6" onSubmit={handlePasswordUpdate}>
            <div>
              <label className="block text-sm font-medium text-black">Contraseña actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Ingrese su contraseña actual"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Ingrese su nueva contraseña"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Confirme su nueva contraseña"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
