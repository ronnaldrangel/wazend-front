// pages/referral-program.js
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import CheckoutButton from '../billing/checkout';

export default function ReferralProgram() {
  return (
    <div>
        {/* Steps Container */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Step 1 */}
            <div className="flex-1 min-w-[250px] text-center p-4">
              {/* Imagen arriba - Usando Next.js Image */}
              <div className="w-32 h-32 mx-auto mb-5 relative">
                <Image
                  src="/images/affiliate/step-1.png"
                  alt="Invita a un amigo"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              {/* Número abajo */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600 mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-700">
                Invita a tu audiencia
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Comparte tu enlace de referencia único y deja que tus amigos o audiencia se unan al mundo y confiabilidad de {process.env.NEXT_PUBLIC_APP_NAME || 'My App'}.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 min-w-[250px] text-center p-4">
              {/* Imagen arriba - Usando Next.js Image */}
              <div className="w-32 h-32 mx-auto mb-5 relative">
                <Image
                  src="/images/affiliate/step-2.png"
                  alt="Tus amigos aceptan"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              {/* Número abajo */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600 mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-700">
                Tus amigos/audiencia aceptan
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ellos se registran, comienzan a usar {process.env.NEXT_PUBLIC_APP_NAME || 'My App'} y experimentan nuestra magia.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 min-w-[250px] text-center p-4">
              {/* Imagen arriba - Usando Next.js Image */}
              <div className="w-32 h-32 mx-auto mb-5 relative">
                <Image
                  src="/images/affiliate/step-3.png"
                  alt="Recibe tu pago"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              {/* Número abajo */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600 mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-700">
                Recibe tu pago
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cuando realizan un pago verificado, ganas 30% fácil y rápido.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}