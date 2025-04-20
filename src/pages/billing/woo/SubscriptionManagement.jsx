// pages/my-account/subscriptions.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  CreditCardIcon, 
  ClockIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useWooSubscriptions, useWooPaymentMethods } from '../../../hooks/useWooCommerce';

// Componente principal de gestión de suscripciones con WooCommerce
export default function SubscriptionManagement() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  // Redirigir si no hay sesión
  if (status === 'unauthenticated') {
    return (
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Acceso restringido</h2>
          <p className="mt-2 text-gray-600">Debes iniciar sesión para acceder a esta página</p>
          <div className="mt-6">
            <Link href="/api/auth/signin">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Iniciar sesión
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-16 bg-gray-200 rounded w-full"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const email = session?.user?.email || '';
  
  // Utilizamos nuestros hooks personalizados para WooCommerce
  const { 
    subscriptions, 
    loading: subscriptionsLoading, 
    error: subscriptionsError, 
    cancelSubscription 
  } = useWooSubscriptions(email);
  
  const { 
    paymentMethods, 
    loading: paymentMethodsLoading, 
    customerId,
    setDefaultPaymentMethod, 
    removePaymentMethod,
    addPaymentMethod
  } = useWooPaymentMethods(email);

  const handleCancelSubscription = async (subscriptionId) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta suscripción?')) {
      await cancelSubscription(subscriptionId);
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    await setDefaultPaymentMethod(paymentMethodId);
  };

  const handleRemovePaymentMethod = async (paymentMethodId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      await removePaymentMethod(paymentMethodId);
    }
  };
  
  const handleAddPaymentMethod = async (cardData) => {
    const success = await addPaymentMethod({
      payment_method: 'woocommerce_payments',
      payment_method_title: 'Tarjeta de crédito/débito',
      card_number: cardData.cardNumber.replace(/\s+/g, ''),
      card_expiry: cardData.expiry,
      card_cvc: cardData.cvc,
      card_holder_name: cardData.name
    });
    
    if (success) {
      setShowAddCardModal(false);
    }
  };
  
  // Fecha formateada para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Renderizar icono según el estado de la suscripción
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'trialing':
      case 'trial':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
      case 'canceled':
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
      case 'past_due':
      case 'failed':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Renderizar icono según el tipo de tarjeta
  const renderCardIcon = (cardBrand) => {
    // Este método se podría expandir para mostrar iconos específicos por marca de tarjeta
    return <CreditCardIcon className="h-8 w-8 text-gray-600" />;
  };

  // Renderizar estado de suscripción en español
  const getStatusLabel = (status) => {
    const statusMap = {
      'active': 'Activa',
      'trialing': 'Periodo de prueba',
      'trial': 'Periodo de prueba',
      'cancelled': 'Cancelada',
      'canceled': 'Cancelada',
      'past_due': 'Pago pendiente',
      'failed': 'Fallida',
      'on-hold': 'En pausa',
      'completed': 'Completada',
      'pending': 'Pendiente'
    };
    
    return statusMap[status] || status;
  };

  // Componente para mostrar cuando no hay datos
  const EmptyState = ({ type, onAction }) => (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-100 rounded-full">
        {type === 'subscriptions' ? (
          <ClockIcon className="h-6 w-6" />
        ) : (
          <CreditCardIcon className="h-6 w-6" />
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {type === 'subscriptions' ? 'No tienes suscripciones activas' : 'No tienes métodos de pago guardados'}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {type === 'subscriptions' 
          ? 'Comienza a utilizar nuestros servicios contratando una suscripción.' 
          : 'Añade un método de pago para gestionar tus suscripciones.'}
      </p>
      <div className="mt-6">
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {type === 'subscriptions' ? 'Contratar suscripción' : 'Añadir método de pago'}
        </button>
      </div>
    </div>
  );

  // Componente modal para añadir una tarjeta
  const AddCardModal = ({ onClose, onSubmit }) => {
    const [cardData, setCardData] = useState({
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: ''
    });
    
    const handleChange = (e) => {
      const { id, value } = e.target;
      setCardData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(cardData);
    };
    
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Añadir método de pago</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Número de tarjeta</label>
              <input
                type="text"
                id="cardNumber"
                value={cardData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
                <input
                  type="text"
                  id="expiry"
                  value={cardData.expiry}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                <input
                  type="text"
                  id="cvc"
                  value={cardData.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre en la tarjeta</label>
              <input
                type="text"
                id="name"
                value={cardData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi cuenta</h1>
      
      {/* Tabs de navegación */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'subscriptions'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Suscripciones
          </button>
          <button
            onClick={() => setActiveTab('payment-methods')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'payment-methods'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Métodos de pago
          </button>
        </nav>
      </div>
      
      {/* Contenido según la pestaña activa */}
      {activeTab === 'subscriptions' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Tus suscripciones</h2>
            <Link href="/pricing">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Ver planes
              </button>
            </Link>
          </div>
          
          {subscriptionsLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-16 bg-gray-200 rounded w-full"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ) : subscriptionsError ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error al cargar las suscripciones</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{subscriptionsError}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-md">
              <ul className="divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <li key={subscription.id} className="p-4 sm:p-6">
                    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                      <div className="flex items-center">
                        {renderStatusIcon(subscription.status)}
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{subscription.plan_name}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                              {getStatusLabel(subscription.status)}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {subscription.status === 'trialing' || subscription.status === 'trial' 
                                ? `La prueba termina el ${formatDate(subscription.current_period_end)}` 
                                : `Próximo cobro el ${formatDate(subscription.current_period_end)}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex items-center">
                        <div className="text-right mr-6">
                          <p className="text-lg font-medium text-gray-900">
                            {subscription.amount === 0 
                              ? 'Gratis' 
                              : `${subscription.amount} ${subscription.currency}`}
                          </p>
                          <p className="text-sm text-gray-500">{subscription.payment_method}</p>
                        </div>
                        
                        {(subscription.status !== 'cancelled' && subscription.status !== 'canceled') && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState 
              type="subscriptions" 
              onAction={() => window.location.href = '/pricing'} 
            />
          )}
        </div>
      )}
      
      {activeTab === 'payment-methods' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Tus métodos de pago</h2>
            <button 
              onClick={() => setShowAddCardModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Añadir método de pago
            </button>
          </div>
          
          {paymentMethodsLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-16 bg-gray-200 rounded w-full"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-md">
              <ul className="divide-y divide-gray-200">
                {paymentMethods.map((method) => (
                  <li key={method.id} className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {renderCardIcon(method.card_brand)}
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)} terminada en {method.last4}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expira: {method.exp_month}/{method.exp_year}
                            {method.is_default && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Predeterminada
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!method.is_default && (
                          <button
                            onClick={() => handleSetDefaultPaymentMethod(method.id)}
                            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          >
                            <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Establecer como predeterminada</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleRemovePaymentMethod(method.id)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState 
              type="payment-methods" 
              onAction={() => setShowAddCardModal(true)} 
            />
          )}
        </div>
      )}
      
      {/* Modal para añadir método de pago */}
      {showAddCardModal && (
        <AddCardModal 
          onClose={() => setShowAddCardModal(false)} 
          onSubmit={handleAddPaymentMethod}
        />
      )}
    </div>
  );
}