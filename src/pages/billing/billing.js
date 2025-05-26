import { CreditCardIcon } from '@heroicons/react/24/outline';
import CheckoutButton from './checkout';


export default function Billing() {

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col space-y-4">
                    <CreditCardIcon
                        className="h-12 w-12 text-gray-400"
                        aria-hidden="true"
                    />

                    <h2 className="text-lg font-medium text-gray-900">
                        ¿Quieres gestionar tus suscripciones?
                    </h2>

                    <p className="text-gray-500 max-w-md mx-auto text-sm">
                        Accede al panel de suscripciones para gestionar tus métodos de pago y
                        mantener todo bajo control de manera sencilla y eficiente.
                    </p>

                    <CheckoutButton />
                </div>
            </div>

        </div>
    );
}
