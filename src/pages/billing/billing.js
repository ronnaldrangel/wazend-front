import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import CheckoutButton from './checkout';


export default function Billing() {

    return (
        <div className="w-full">
            <Card shadow="md" padding="md" className="border border-border">
                <div className="flex flex-col space-y-4">
                    <CreditCardIcon
                        className="h-12 w-12 text-muted-foreground"
                        aria-hidden="true"
                    />

                    <h2 className="text-lg font-medium text-foreground">
                        ¿Quieres gestionar tus suscripciones?
                    </h2>

                    <p className="text-muted-foreground max-w-md mx-auto text-sm">
                        Accede al panel de suscripciones para gestionar tus métodos de pago y
                        mantener todo bajo control de manera sencilla y eficiente.
                    </p>

                    <CheckoutButton />
                </div>
            </Card>

        </div>
    );
}
