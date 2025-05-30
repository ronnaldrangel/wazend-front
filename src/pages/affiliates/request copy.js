// pages/referral-program.js
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import CheckoutButton from '../billing/checkout';

export default function ReferralProgram() {
  return (
    <div>
        {/* Affiliate Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium text-gray-800 mt-0 mb-4">
            Tu enlace de afiliado
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            Necesitas activar el afiliado para obtener tu enlace de referencia único, que te permite invitar a nuevos usuarios y ganar recompensas.
          </p>

          <CheckoutButton
            buttonText="Activar Afiliado"
            redirectUrl="/affiliate-portal/"
          />
        </div>
    </div>
  );
}