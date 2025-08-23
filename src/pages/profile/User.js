import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import OrderSkeleton from '@/components/loaders/skeleton';
import LogoGravatar from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { Card } from '@/components/ui/card';
import Alerta from '@/components/alerts/main';
import { PageTitle } from '@/hooks/use-page-title';

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
  if (error) return <Alerta message={error}/>;
  if (!data) return <OrderSkeleton />;
  if (!session || !session.user) return <OrderSkeleton />;

  return (
    <>
      <PageTitle title="Perfil" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna izquierda - Perfil de usuario */}
      <div className="lg:col-span-1">
        <Card shadow="md" padding="md" className="border border-border">
          <div className="flex items-center space-x-4">
            <LogoGravatar
              email={session.user.email}
              className="w-12 h-12 bg-muted rounded-full flex items-center justify-center"
            />
            <div>
              <p className="text-base font-bold text-foreground">
                {data.name || 'Nombre no disponible'}
              </p>
              <p className="text-foreground text-sm">
                {data.email || 'Email no disponible'}
              </p>
              <p className="text-foreground text-sm">
                Registrado con {data.provider === 'local' ? 'Email' : data.provider.charAt(0).toUpperCase() + data.provider.slice(1)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Columna derecha - Formularios */}
      <div className="lg:col-span-2 space-y-6">
        <Card shadow="md" padding="md" className="border border-border">
          <p className="text-xl font-semibold text-foreground mb-2">Información del perfil</p>
          <p className="text-muted-foreground text-sm mb-8">
            Actualice la información del perfil y la dirección de correo electrónico de su cuenta.
          </p>

          <form className="space-y-6" onSubmit={handleProfileUpdate}>
            <div className="w-full space-y-6">
              <FormInput
                id="name"
                name="name"
                label="Nombre"
                placeholder="Ingrese su nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <FormInput
                id="phone"
                name="phone"
                type="tel"
                label="Teléfono"
                placeholder="Ingrese su teléfono"
                value={phone}
                onChange={(e) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value === '' || regex.test(e.target.value)) {
                    setPhone(e.target.value);
                  }
                }}
                pattern="[0-9]*"
                inputMode="numeric"
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <Card shadow="md" padding="md" className="border border-border">
          <p className="text-xl font-semibold text-foreground mb-2">Actualizar contraseña</p>
          <p className="text-muted-foreground text-sm mb-8">
            Asegúrese de que su cuenta utilice una contraseña larga y aleatoria para mantenerla segura.
          </p>

          <form className="space-y-6" onSubmit={handlePasswordUpdate}>
            <div className="w-full space-y-6">
              <FormInput
                id="current-password"
                name="currentPassword"
                type="password"
                label="Contraseña actual"
                placeholder="Ingresa tu contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <FormInput
                id="new-password"
                name="newPassword"
                type="password"
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <FormInput
                id="confirm-password"
                name="confirmPassword"
                type="password"
                label="Confirmar contraseña"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmittingPassword}>
                  {isSubmittingPassword ? 'Guardando...' : 'Actualizar contraseña'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
      </div>
    </>
  );
}
