
import { useSession } from 'next-auth/react'; // Importa el hook de NextAuth

export default function Example() {
    const { data: session } = useSession(); // Obtén la sesión
    const email = session?.user?.email || ''; // Accede al email de la sesión, si está disponible
  
    const checkoutUrl = `https://wazend.net/checkouts/checkout/?aero-add-to-checkout=9390&aero-qty=1&billing_email=${encodeURIComponent(email)}`;

    return (
        <div className="py-20">
            <div className="mx-auto">

                {/* <h2 className="text-left text-base/7 font-semibold text-indigo-600">¡Nuevo!</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-950 mb-12">
                    Wazend tiene novedades para ti
                </p> */}

                <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">

                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">

                            {/* <div>
                                <img
                                    className="size-full object-cover object-top"
                                    src="https://tailwindui.com/plus/img/component-images/bento-01-performance.png"
                                    alt=""
                                />
                            </div> */}

                            <div className="p-10">
                                <p className="text-lg font-medium tracking-tight text-gray-950">
                                    🎉 Activa tus 30 dias gratis
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 mb-6">
                                    ¿Fuiste parte del Master de Inteligencia Artificial? Activa tu prueba gratis en el boton de abajo.
                                </p>

                                <a
                                    href={checkoutUrl}
                                    className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                >
                                    Activar prueba gratis
                                </a>

                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem]"></div>
                    </div>

                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">

                            {/* <div>
                                <img
                                    className="size-full object-cover object-top"
                                    src="https://tailwindui.com/plus/img/component-images/bento-01-performance.png"
                                    alt=""
                                />
                            </div> */}

                            <div className="p-10">
                                <p className="text-lg font-medium tracking-tight text-gray-950">
                                    🛟 ¿Necesitas inspiración?
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 mb-6">
                                    Hemos creado un canal de Youtube en donde creamos contenido de automatización gratuito para que le saques el juego a Wazend.
                                </p>

                                <a
                                    href={checkoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Ir al canal de YouTube
                                </a>

                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                    </div>


                </div>

            </div>
        </div>
    )
}
