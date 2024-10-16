import Link from 'next/link';
import Image from 'next/image';

const LayoutInstance = ({ instanceData }) => {

  // Imprimir los datos en la consola para verificar que llegan
  //console.log('Datos recibidos en LayoytInstance:', instanceData);

  // Verificar que instanceData es un arreglo y no está vacío
  if (!instanceData || instanceData.length === 0) {
    return <p>No instance data available</p>; // En caso de que no haya datos
  }

  // Acceder al primer objeto del arreglo
  const instance = instanceData[0];

  const qrBase64 = "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tdb6xMNaa61PPKy11vrEn3/+xYWQOelKboTMja5kCpmTruQkZKau5I2Q+UldyRshc6MrOQmZqSu5ETInXckUMv9LupIpZKau5DeFzNSV/KSQmbqSKWR+U1cyhczUlUwhM3UlU8j8pq7kxsNaa61PPKy11vrEw1prrU/8+edfXAiZqSs5CZmTruRGyExdyUnInHQlU8icdCVTyExdyRQyJ13JSchMXckbIfNGV/JGyExdyW8KmakrOQmZqSu5ETInXckUMlNXMoXM1JXcCJmTruQkZKauZAqZqSuZQmbqSm6EzElXMoXM1JVMITN1JV96WGut9YmHtdZan3hYa631ib9c6kqmkDnpSk5C5qQrmbqSKWRudCVTyJx0JVPInITMjZCZupKTkDnpSqaQOelK3giZG13JjZD5SSHzRsicdCVvhMxJyNzoSt7oSk66kjdCZupK/kshc6MrufGw1lrrEw9rrbU+8bDWWusTf/75FxdC5qQrOQmZqSv5TSFz0pXcCJmTrmQKmakreSNkTrqSKWTe6Ep+U8jc6EqmkDnpSt4ImZOu5CRkpq7kJGSmrmQKmakrmUJm6kqmkHmjK3kjZKau5EbInHQlPylkpq7kjYe11lqfeFhrrfWJh7XWWp/4y38sZE66kilkpq7kRlfyRldyEjJTV3IjZE66kpOQudGVnITMja5kCpmpK5m6khshM3UlU8hMITN1JVPInHQlU8jc6EpudCVvdCU/qSuZQmbqSqaQmbqSqSu5ETJTV3IjZE66ki89rLXW+sTDWmutTzystdb6xF8udSVvdCU/KWSmrmTqSqaQOelKppCZupL/JSHzk0Jm6kp+Usj8pJD5L4XM1JWchMzUlUwhc9KVnITM1JWcdCVTyJx0JVPITF3JScjc6EqmkPlSV/KTHtZaa33iYa211ice1lprfeLPP//iB4XM1JWchMyNruRGyPyXupIpZH5SVzKFzElXciNkbnQlN0Jm6kqmkLnRlUwhc6MrmUJm6kpOQuZGVzKFzElX8kbI3OhKppA56UqmkJm6kp8UMje6kilkTrqSKWSmruTGw1prrU88rLXW+sTDWmutT/zlpZCZupIpZKau5KQrmUJmCpkbXclJyJx0JVPITF3JFDJTyExdyUnI3AiZnxQyJ13JSchMXckUMich86WuZAqZn9SVTCFzoyuZQmbqSr7UlZyE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6EpuhMxJyJx0JTdC5qQreSNkTrqSKWSmkJm6kilkpq5kCpn/S0LmjZCZupIpZE5C5iRkflJX8qWHtdZan3hYa631iYe11lqf+PPPv/hBIXOjK7kRMlNXchIyU1dyEjI/qSuZQuakK7kRMlNXMoXMSVdyI2SmruSNkDnpSqaQmbqSKWTe6EreCJk3upKTkDnpSqaQudGVTCFz0pWchMzUlUwhM3UlU8icdCU3QuakK5lC5qQrufGw1lrrEw9rrbU+8bDWWusTf7kUMje6kilkppA56UqmrmQKmakruREyJ13JFDJTV3ISMlNXMoXMFDJTV/JGVzKFzBQyU1cyhcyXupIpZKau5I2u5CeFzI2u5CRkpq7kpCuZQmbqSm6EzNSVTCHzpa7kRsj8pK7kJz2stdb6xMNaa61PPKy11vrEX35ZyExdyY2QOelKboTMSVcyhczUlZyEzNSVTCHzk7qSN7qSG13JFDInXclJVzKFzNSVTCEzdSVTVzKFzEnInHQlU8hMXclJyJyEzNSVnHQlJ13JjZC50ZW8ETJTV3ISMlNXcqMruREyU1cyhczUldx4WGut9YmHtdZan3hYa631iT///IsXQuZGV3ISMje6kilkbnQlJyFz0pVMIfNGVzKFzNSVTCEzdSUnITN1JTdCZupKTkLmpCv5SSFz0pVMIfOTupIpZKau5CRkbnQlJyEzdSUnIXOjK7kRMiddyRQyX+pKppCZupI3HtZaa33iYa211ice1lprfeIvP6wruREyU1fym7qSKWROupIpZKaQOelKppCZupKTruRGyJx0JVPITF3JT+pKTkJm6kqmkJm6khtdyRQyU1dyEjInXclJV/KlkJm6kpOQmbqSGyEzdSU3upIpZKau5EbInHQlb4TM1JXceFhrrfWJh7XWWp94WGut9Yk///yLF0LmRldyEjInXckUMiddyRsh80ZXchIy/5d1JVPI3OhKppCZupIpZKau5DeFzG/qSk5C5qQr+UkhM3UlU8i80ZVMITN1JSch85O6khshM3UlNx7WWmt94mGttdYnHtZaa33izz//4v+QkDnpSk5CZupKTkLmRlcyhczUlUwh80ZXciNkTrqSKWSmruRGyJx0JTdCZupKboTMja5kCpmpK7kRMm90JSchM3UlJyEzdSVvhMzUlUwhM3UlU8hMXckUMlNXciNkTrqS3/Sw1lrrEw9rrbU+8bDWWusTf7kUMl/q/6df9IgAAANTSURBVK89OLixA4eBKPgsTBCMi1EwJEbBuJiF10eeBAj6o7EXXVXBTlcwmSc7XcFknux0BSfMk6kruNEVTObJjnkydQU7XcEJ82TqCna6ghPmyU5XsGOe/CTzZOoKbnQFO+bJ1BX8pK7gJ5knU1ew0xXsmCdTV3BjISIiTyxEROSJhYiIPPHFpa7gk8yTG13Bia7gO5knN8yTE13BCfNk6go+yTw50RWcME9udAWTeTKZJye6ghNdwWSe7JgnO+bJDfNk6gpOmCc7XcFknkxdwY2u4G+2EBGRJxYiIvLEQkREnvjiw8yTE13BDfNk6gom82SnK7hhnkxdwQnzZOoKJvNkxzy50RXcME92uoLJPJm6gh3zZOoKpq5gxzyZuoLJPNnpCibzZDJPPqkrmMyTqSuYzJOdrmAyT6au4IZ5MnUFk3nyncyTTzJPdsyTqSs4sRARkScWIiLyxEJERJ744h/TFUzmyQ3zZOoKbpgnU1cwmScnuoLJPJm6gh3z5EZXMJknO13BTlcwmSdTV7BjnkxdwU5XMJknN7qCE+bJjnkydQVTVzCZJ1NXsGOeTF3BZJ7sdAWTeTJ1BTtdwWSeTF3Bia7ghHkydQWTefLSQkREnliIiMgTCxEReeKL/7muYDJPdsyTl7qCyTx5yTzZ6QqmrmAyTybzZOoKJvNkxzyZuoLJPJnMkxNdwQnzZOoKPqkrmMyTqSs4YZ7smCdTVzCZJ5N5MnUFk3nyN+sKJvNkpyv4TgsREXliISIiTyxEROSJLz6sK/ibmCc3uoIb5smJruCTuoIb5slOVzCZJ5N58kldwWSeTF3BZJ5M5snUFXySeXKjK5jMk6kr2OkKJvPkJ3UFk3myY55MXcEN82SnK3hpISIiTyxEROSJhYiIPPHr9x8cME9e6gpOmCcnuoId82TqCk6YJ5/UFZwwT6au4DuZJztdwWSe3OgKJvNkpyvYMU92uoLJPJm6gsk8mbqCHfPkRFcwmSdTVzCZJztdwY55stMVTObJia5gMk8+qSu4YZ5MXcGJhYiIPLEQEZEnFiIi8sSv338gIiLfbiEiIk8sRETkiYWIiDyxEBGRJxYiIvLEQkREnliIiMgTCxEReWIhIiJPLERE5ImFiIg88R/lSnLanvIuBQAAAABJRU5ErkJggg==";


  return (
    // <div className='min-h-screen bg-slate-100 p-8'>
    <>
      {/* <pre>{JSON.stringify(instanceData, null, 2)}</pre> */}
      <div className='space-y-8'>
        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex flex-col md:flex-row'>
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4'>
                <div className='mb-8 md:mb-11'>
                  <h3 className='text-sm font-base'>
                    Instancia ID
                  </h3>
                  <p className='text-lg font-semibold text-green-600'>{instance.name}</p>
                </div>
                <div>
                  <h3 className='text-sm font-base'>Tipo</h3>
                  <p className='text-lg font-semibold text-blue-500'>
                    Trial Instance
                  </p>
                </div>
              </div>
            </div>
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0 md:border-r'>
              <div className='flex-1 flex-col p-4 '>
                <div className='flex align-center justify-between'>
                  <div className='mb-8 md:mb-11'>
                    <h3 className='text-sm font-base'>
                     Estado actual
                    </h3>
                    <p className='text-2xl font-medium text-green-600'>{instance.connectionStatus}</p>
                  </div>
                  <div className='text-sm font-medium pt-5'>
                    <p className='bg-cyan-100 rounded-full px-1'>
                      <span className='text-green-500 text-lg'>&#10003;</span>{' '}
                      Success
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className='text-sm font-base'>
                    Caduda en
                  </h3>
                  <p className='text-lg font-semibold text-blue-500'>
                    66 hour(s)
                  </p>
                </div>
              </div>
            </div>
            <div className='flex-1 border-b border-gray-200 p-4 md:border-b-0'>
              <div className='flex-1 flex-col p-4'>
                <div className='mb-8 md:mb-11'>
                  <h3 className='text-sm font-base'>
                    Errores de Webhook (hoy)
                  </h3>
                  <p className='text-sm font-base'>
                    <span className='text-2xl font-medium text-green-600'>
                      0
                    </span>{' '}
                    de 0 en total
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-base'>
                    Caduca el
                  </h3>
                  <p className='text-lg font-semibold text-blue-500'>
                    2024-10-09 18:01:06 UTC
                  </p>
                </div>
              </div>
            </div>
            <div className='relative flex-1 p-4 before:absolute before:left-0 before:top-0 before:h-1/2 before:w-[1px] before:bg-gray-200'>
              <div className='flex-1 flex-col p-4'>
                <div className='mb-8 md:mb-11'>
                  <h3 className='text-sm font-base'>
                    Creado el
                  </h3>
                  <p className='text-lg font-semibold text-green-600'>
                    {instance.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='rounded-lg bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <h2 className='mb-4 text-xl font-semibold'>Conecta tu WhatsApp</h2>
          <p className='mb-1'>
            Escanee el código QR para conectar su número de teléfono de WhatsApp con esta instancia.
          </p>
          <p className='mb-8'>
            Después de eso, podrá enviar y recibir mensajes de WhatsApp.
          </p>
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='mb-4 md:mb-0 flex-shrink-0'>
              <div className='inline-block border-2 border-gray-200 p-2 rounded-lg overflow-hidden h-52'>
                <Image
                  src={`data:image/png;base64,${qrBase64}`}  // Usa la cadena base64 como src
                  alt='QR Code'
                  width={200}
                  height={200}
                  className='rounded-md w-full h-full object-cover'
                />
              </div>
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
        <section className='rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)]'>
          <div className='flex justify-start p-4 mb-4 border-b-2'>
            <h2 className='text-xl font-semibold'>Ajustes de instancia</h2>
          </div>
          {/* <hr className='border-t-2 border-gray-200 mt-2 mb-6' /> */}
          <div className='mt-2 mb-2 p-4'>
            <h3 className='text-sm font-semibold text-gray-500 mb-2'>
              Webhook URL
            </h3>
            <input
              type='text'
              placeholder='https://your-domain.com/instance/22735/webhook'
              className='w-full rounded-md border border-gray-300 p-2'
            />
          </div>
          <div className='p-4'>
            <h3 className='text-sm font-semibold text-gray-500 mb-4'>
              Webhook Events
            </h3>
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
                  <label
                    htmlFor={event}
                    className='text-sm font-semibold text-gray-600 flex items-center'
                  >
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
              As soon as one of these events occur, the webhook URL above will
              be called with the event data.
            </p>
            <p className='text-sm text-blue-500 mb-6'>
              <Link href='#'>Check out Docs</Link> for further information on
              webhooks.
            </p>
          </div>
          <div className='px-4 pb-4'>
            <button className='rounded-md bg-green-500 text-white px-4 py-2 hover:bg-blue-500'>
              Guardar
            </button>
          </div>
        </section>
      </div>

      <div className='mt-6 flex justify-end space-x-4'>
        <Link
          href='#'
          className='rounded-md bg-red-100 px-4 py-2 text-red-600 hover:bg-red-300'
        >
          Destroy Instance
        </Link>
        <Link
          href='#'
          className='rounded-md bg-cyan-100 px-4 py-2 text-blue-700 hover:bg-blue-300'
        >
          Reboot Instance
        </Link>
        <Link
          href='#'
          className='rounded-md bg-red-100 px-4 py-2 text-red-600 hover:bg-red-300'
        >
          Delete
        </Link>
      </div>
    </>
  );
}

export default LayoutInstance;
