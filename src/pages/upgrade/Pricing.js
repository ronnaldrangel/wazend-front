import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Importa el hook de NextAuth
import { CheckIcon } from '@heroicons/react/20/solid';
import CheckoutRedirect from './CheckoutRedirect';

const tiers = [
    {
        name: 'Paquete mensual',
        id: '657082',
        price: '$15.9/mes',
        description: 'Facturación cada 30 días',
        features: [
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        featured: false,
    },
    {
        name: 'Paquete anual',
        id: '657087',
        price: '$159/año',
        description: 'Facturación cada 365 días',
        features: [
            'Mensajes enviados ilimitados',
            'Recibir mensajes ilimitados',
            'Enviar medios / documentos',
            'Soporte de webhook',
            'Atención al cliente vía WhatsApp',
        ],
        featured: true,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Example() {
    const { data: session } = useSession(); // Obtén la sesión
    const email = session?.user?.email || ''; // Accede al email de la sesión, si está disponible

    return (
        <div>
            <div className="mx-auto max-w-4xl text-center">
                <p className="font-semibold tracking-tight text-gray-900 sm:text-4xl text-4xl">Elige un plan</p>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-center text-md leading-8 text-gray-600">
                Encuentra el plan adecuado para ti
            </p>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            tier.featured ? 'bg-gradient-to-b from-emerald-100 to-white via-white' : 'bg-white',
                            'rounded-lg p-8 ring-1 ring-gray-200 xl:p-10'
                        )}
                    >
                        <h3
                            id={tier.id}
                            className={classNames(
                                'text-gray-900',
                                'text-xl font-semibold leading-8'
                            )}
                        >
                            {tier.name}
                        </h3>
                        <p className="mt-6 flex items-baseline gap-x-1">
                            <span
                                className={classNames(
                                    'text-gray-900',
                                    'text-4xl font-bold tracking-tight'
                                )}
                            >
                                {tier.price}
                            </span>
                        </p>
                        <p className={classNames('text-gray-600', 'mt-4 text-sm leading-6')}>
                            {tier.description}
                        </p>
                        {/* Pasa el email dinámicamente a CheckoutRedirect */}
                        <CheckoutRedirect email={email} variantId={tier.id} />
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-black">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                    <CheckIcon className="text-emerald-700 h-6 w-6 flex-none rounded-full bg-emerald-50 p-1" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}