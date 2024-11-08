import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

import { EyeIcon, EyeSlashIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { UserIcon, ChatBubbleLeftEllipsisIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

import { toast } from 'sonner';

import ImagenQr from './ImagenQr';
import ButtonControl from './ButtonControl';

const LayoutInstance = ({ instanceId }) => {
  const [instanceData, setInstanceData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isTokenVisible, setIsTokenVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(instance.token);
    toast.success('Copiado exitosamente.');
  };

  //qr button
  const [showQr, setShowQr] = useState(false);

  const handleShowQr = () => {
    setShowQr(true);
  };


  useEffect(() => {
    const fetchData = async () => {
      if (instanceId) {
        try {
          const response = await axios.get(
            'https://api.wazend.net/instance/fetchInstances',
            {
              headers: {
                apiKey: 'UkVKATZZMZqZgtxMscKhfhbxORHDH41K',
              },
              params: {
                instanceId: instanceId,
              },
            }
          );
          setInstanceData(response.data);
        } catch (err) {
          console.error('Error al obtener los datos:', err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [instanceId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!instanceData || instanceData.length === 0) return <p>No instance data available</p>;

  const instance = instanceData[0];

  return (
    <>
      <div className='space-y-8'>

        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex flex-col md:flex-row'>

            {/* Primera columna */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>

                <div className='flex align-center justify-between'>
                  <div className='mb-8 md:mb-11'>
                    <h3 className='text-sm font-base'>Nombre de instancia</h3>
                    <p className='text-lg font-medium text-green-600'>{instance.name}</p>
                  </div>

                  <div className='text-sm font-medium pt-5'>
                    <p
                      className={`rounded-full px-2.5 py-0.5 ${instance.connectionStatus === 'close'
                        ? 'bg-red-500 text-white'
                        : instance.connectionStatus === 'connecting'
                          ? 'bg-amber-500 text-white'
                          : instance.connectionStatus === 'open'
                            ? 'bg-green-500 text-white'
                            : 'bg-cyan-100'
                        }`}
                    >
                      {instance.connectionStatus === 'close'
                        ? 'Desconectado'
                        : instance.connectionStatus === 'connecting'
                          ? 'Conectando'
                          : instance.connectionStatus === 'open'
                            ? 'Conectado'
                            : instance.connectionStatus}
                    </p>
                  </div>

                </div>

                <div>
                  <h3 className='text-sm font-base'>Última conexión</h3>
                  <p className='text-lg font-semibold text-green-600'>
                    {new Date(instance.updatedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} ({new Date(instance.updatedAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })})
                  </p>
                </div>

              </div>
            </div>

            {/* Segunda columna */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>

                <div className='mb-8 md:mb-11'>
                  <h3 className='text-sm font-base'>Token</h3>
                  <div className="flex items-center space-x-2">
                    <p className='text-lg font-medium text-green-600'>
                      {isTokenVisible ? instance.token : '••••••••••'}
                    </p>
                    <button
                      onClick={() => setIsTokenVisible(!isTokenVisible)}
                      className="focus:outline-none"
                    >
                      {isTokenVisible ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-900" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-800" />
                      )}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="focus:outline-none"
                    >
                      <ClipboardIcon className="h-5 w-5 text-gray-800" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-base'>Creado el</h3>
                  <p className='text-lg font-semibold text-green-600'>
                    {new Date(instance.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} ({new Date(instance.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })})
                  </p>
                </div>


              </div>
            </div>

            {/* Final columna */}

          </div>
        </section>

        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex flex-col md:flex-row'>

            {/* Contactos */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>
                <div className="flex items-center space-x-1">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  <h3 className='text-sm font-base'>Contactos</h3>
                </div>
                <p className='mt-2 text-lg font-semibold text-blue-500'>{instance._count.Contact}</p>
              </div>
            </div>

            {/* Chats */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>
                <div className="flex items-center space-x-2">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-500" />
                  <h3 className='text-sm font-base'>Chats</h3>
                </div>
                <p className='mt-2 text-lg font-semibold text-blue-500'>{instance._count.Chat}</p>
              </div>
            </div>

            {/* Mensajes */}
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0'>
              <div className='flex-1 flex-col p-4'>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                  <h3 className='text-sm font-base'>Mensajes</h3>
                </div>
                <p className='mt-2 text-lg font-semibold text-blue-500'>{instance._count.Message}</p>
              </div>
            </div>

          </div>
        </section>


        {/* Seccion de conexion*/}

        {instance.connectionStatus === 'open' && (
          <section className='rounded-lg bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
            <h2 className='mb-4 text-xl font-semibold'>Tu número de WhatsApp conectado</h2>
            <div className="group block flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-12 w-12 rounded-full"
                    src={instance.profilePicUrl}
                    alt={instance.profileName}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-md font-semibold text-black">{instance.profileName}</p>
                  <p className="text-sm font-base text-gray-500">{instance.ownerJid}</p>
                </div>
              </div>
            </div>

            <ButtonControl />
          </section>
        )}

        {instance.connectionStatus !== 'open' && (
          <section className='rounded-lg bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
            <h2 className='mb-4 text-xl font-semibold'>Conecta tu WhatsApp</h2>
            <p className='mb-1'>Escanee el código QR para conectar su número de teléfono de WhatsApp con esta instancia.</p>
            <p className='mb-8'>Después de eso, podrá enviar y recibir mensajes de WhatsApp.</p>
            <div className='flex flex-col md:flex-row md:space-x-4'>


              <div>
                <button
                  onClick={handleShowQr}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Mostrar QR
                </button>

                {showQr && (
                  <div className="mt-4">
                    <ImagenQr instanceName={instance.name} />
                  </div>
                )}
              </div>

              <div className='w-1/3'>
                <div className='border-2 border-gray-200 p-2 rounded-lg overflow-hidden h-52'>
                  <Image
                    src='/images/scan-wa.gif'
                    alt='Hand holding a phone with WhatsApp'
                    width={200}
                    height={50}
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Seccion de ajustes*/}
        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex justify-start p-4 mb-4 border-b-2'>
            <h2 className='text-xl font-semibold'>Ajustes de instancia</h2>
          </div>
          <div className='mt-2 mb-2 p-4'>
            <h3 className='text-sm font-semibold text-gray-500 mb-2'>Webhook URL</h3>
            <input
              type='text'
              placeholder='https://your-domain.com/instance/22735/webhook'
              className='w-full rounded-md border border-gray-300 p-2'
            />
          </div>
          <div className='p-4'>
            <h3 className='text-sm font-semibold text-gray-500 mb-4'>Webhook Events</h3>
            <div className='grid grid-cols-3 gap-4'>
              {[
                'message',
                'authenticated',
                'disconnected',
                'message_revoke_me',
                'media_uploaded',
                'group_update',
                'loading_screen',
                'auth_failure',
                'message_create',
                'message_ack',
                'group_join',
                'change_state',
                'qr',
                'ready',
                'message_revoke_everyone',
                'message_reaction',
                'group_leave',
                'call',
              ].map((event) => (
                <div key={event} className='flex items-center'>
                  <input
                    type='checkbox'
                    id={event}
                    className='mr-2 h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-600'
                  />
                  <label htmlFor={event} className='text-sm font-semibold text-gray-600 flex items-center'>
                    {event}{' '}
                    <span className='ml-2 h-3 w-3 border border-gray-600 rounded-full text-gray-600 text-[0.5rem] font-semibold flex items-center justify-center'>
                      &#105;
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className='py-2 px-4'>
            <p className='text-sm text-gray-500 mb-1'>
              As soon as one of these events occur, the webhook URL above will be called with the event data.
            </p>
            <p className='text-sm text-blue-500 mb-6'>
              <Link href='#'>Check out Docs</Link> for further information on webhooks.
            </p>
          </div>
          <div className='px-4 pb-4'>
            <button className='rounded-md bg-green-500 text-white px-4 py-2 hover:bg-blue-500'>Guardar</button>
          </div>
        </section>


      </div>
    </>
  );
};

export default LayoutInstance;
