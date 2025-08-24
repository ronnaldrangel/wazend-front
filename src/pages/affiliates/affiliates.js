// pages/referral-program.js
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import CheckoutButton from '../billing/checkout';

export default function ReferralProgram() {
  return (
    <div>
        {/* Steps Container */}
        <Card shadow="md" padding="md" className="mb-6 border border-border">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Step 1 */}
            <div className="flex-1 min-w-[250px] text-center p-4">
              {/* Imagen arriba - Usando Next.js Image */}
              <div className="w-32 h-32 mx-auto mb-5 relative">
                <Image
                  src="/images/affiliate/step-1.webp"
                  alt="Invita a un amigo"
                  width={128}
                  height={128}
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              {/* Número abajo */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-muted rounded-full text-muted-foreground mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">
                Invita a tu audiencia
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comparte tu enlace de referencia único y deja que tus amigos o audiencia se unan al mundo y confiabilidad de {process.env.NEXT_PUBLIC_APP_NAME || 'My App'}.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 min-w-[250px] text-center p-4">
              {/* Imagen arriba - Usando Next.js Image */}
              <div className="w-32 h-32 mx-auto mb-5 relative">
                <Image
                  src="/images/affiliate/step-2.webp"
                  alt="Tus amigos aceptan"
                  width={128}
                  height={128}
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              {/* Número abajo */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-muted rounded-full text-muted-foreground mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">
                Tus amigos/audiencia aceptan
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ellos se registran, comienzan a usar {process.env.NEXT_PUBLIC_APP_NAME || 'My App'} y experimentan nuestra magia.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 min-w-[250px] text-center p-4">
              {/* Imagen arriba - Usando Next.js Image */}
              <div className="w-32 h-32 mx-auto mb-5 relative">
                <Image
                  src="/images/affiliate/step-3.webp"
                  alt="Recibe tu pago"
                  width={128}
                  height={128}
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              {/* Número abajo */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-muted rounded-full text-muted-foreground mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">
                Recibe tu pago
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cuando realizan un pago verificado, ganas 30% fácil y rápido.
              </p>
            </div>
          </div>
        </Card>
    </div>
  );
}