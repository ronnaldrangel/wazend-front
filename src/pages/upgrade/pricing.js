import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

const frequencies = [
  { value: 'monthly', label: 'Mensual', priceSuffix: '/mes' },
  { value: 'annually', label: 'Anual', priceSuffix: '/año' },
]
const tiers = [
  {
    name: 'Basico',
    id: 'tier-basic',
    href: 'https://wazend.lemonsqueezy.com/buy/b111c589-613b-4c2f-b6f7-6d293871178f',
    price: { monthly: '$10', annually: '$110' },
    description: 'Para equipos pequeños',
    features: ['1 Cuenta de WhatsApp', '3 Usuarios/Agentes', 'Automatizaciones y Macros', 'Acceso a comunidad VIP' ,'Soporte por WhatsApp'],
    featured: false,
    cta: 'Suscribirme',
  },
  {
    name: 'Avanzado',
    id: 'tier-advanced',
    href: 'https://wazend.lemonsqueezy.com/buy/f6ea2b5b-7813-427c-89a8-e79e1b340337',
    price: { monthly: '$15', annually: '$165' },
    description: 'Para equipos medianos o en expansión',
    features: [
      '1 Cuentas de WhatsApp',
      '5 Usuarios/Agentes',
      'Automatizaciones y Macros',
      'Acceso a comunidad VIP',
      'Soporte por WhatsApp',
    ],
    featured: false,
    cta: 'Suscribirme',
  },
  {
    name: 'Personalizado',
    id: 'tier-enterprise',
    href: 'https://api.whatsapp.com/send?phone=51924079147&text=Hola%2C%20estoy%20interesado%20en%20cotizar%20un%20plan%20a%20medida%20de%20Wazend.',
    price: 'Cotizar',
    description: 'Para grandes equipos y empresas',
    features: [
      'Cuenta ilimitadas',
      'Usuarios/Agentes ilimitados',
      'Integraciones a medida',
      'On-boarding',
      'Soporte prioritario',
    ],
    featured: true,
    cta: 'Contactar con ventas',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Comienza ahora
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Elige un plan a tu medida • Cancela cuando quieras.
        </p>
        <div className="mt-10 flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  classNames(
                    checked ? 'bg-emerald-700 text-white' : 'text-gray-500',
                    'cursor-pointer rounded-full px-2.5 py-1'
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? 'bg-gray-900 ring-gray-900' : 'ring-gray-200',
                'rounded-3xl p-8 ring-1 xl:p-10'
              )}
            >
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-lg font-semibold leading-8'
                )}
              >
                {tier.name}
              </h3>
              <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-4 text-sm leading-6')}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={classNames(
                    tier.featured ? 'text-white' : 'text-gray-900',
                    'text-4xl font-bold tracking-tight'
                  )}
                >
                  {typeof tier.price === 'string' ? tier.price : tier.price[frequency.value]}
                </span>
                {typeof tier.price !== 'string' ? (
                  <span
                    className={classNames(
                      tier.featured ? 'text-gray-300' : 'text-gray-600',
                      'text-sm font-semibold leading-6'
                    )}
                  >
                    {frequency.priceSuffix}
                  </span>
                ) : null}
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white'
                    : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-600 focus-visible:outline-emerald-700',
                  'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
              >
                {tier.cta}
              </a>
              <ul
                role="list"
                className={classNames(
                  tier.featured ? 'text-gray-300' : 'text-gray-600',
                  'mt-8 space-y-3 text-sm leading-6 xl:mt-10'
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={classNames(tier.featured ? 'text-white' : 'text-emerald-700', 'h-6 w-5 flex-none')}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
