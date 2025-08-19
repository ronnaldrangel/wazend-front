import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';           // 👈 nuevo import
import Spin from '@/components/loaders/spin';

/**
 * Componente para eliminar una instancia con confirmación modal
 * @param {Object} props
 * @param {string} props.documentId
 * @param {string} props.instanceName
 * @param {Function} props.onDelete
 */
const DeleteButton = ({ documentId, instanceName, onDelete, isTrial }) => {
  const { data: session } = useSession();
  const router = useRouter();                     // 👈 instancia del router
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const DELETE_WEBHOOK_URL = process.env.NEXT_PUBLIC_DELETE_INSTANCE;

  /* Maneja la eliminación de la instancia */
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(DELETE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          instanceName,
          email: session?.user?.email,
          isTrial,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resultado de la API:', result.message);

        toast.success('Instancia eliminada correctamente');

        // 👇 Recargar la página para reflejar los cambios
        router.reload();

        // Callback opcional
        if (typeof onDelete === 'function') onDelete(documentId);
      } else {
        const errorData = await response.text();
        console.error('Error al eliminar la instancia:', errorData);
        toast.error('Error al eliminar la instancia', {
          description: 'Por favor, inténtelo de nuevo más tarde.',
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      toast.error('Error de conexión', {
        description: 'Compruebe su conexión a internet.',
      });
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) setOpen(false);
  };

  return (
    <>
      <button
        className="hover:shadow-lg transition-shadow duration-300 bg-red-500 text-white px-4 py-2 rounded-lg text-base font-semibold shadow-md w-full md:w-auto"
        onClick={() => setOpen(true)}
        disabled={isSubmitting}
        aria-label="Eliminar"
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-card border border-border px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-card text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      <span className="sr-only">Cerrar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-destructive" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-foreground">
                        ¿Estás seguro?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          ¿Realmente deseas eliminar la instancia <strong>{instanceName}</strong>? Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spin className="mr-2" />
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:mt-0 sm:w-auto"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default DeleteButton;