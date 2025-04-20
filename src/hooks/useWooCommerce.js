// hooks/useWooCommerce.js
// Este archivo proporciona hooks de React para utilizar la API de WooCommerce

import { useState, useEffect, useCallback } from 'react';
import { WooCommerceService } from '../services/wooCommerceApi';
import { toast } from 'sonner';

/**
 * Hook para obtener y gestionar las suscripciones de WooCommerce
 */
export function useWooSubscriptions(email) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const wooService = new WooCommerceService();
  
  // Obtener suscripciones
  const fetchSubscriptions = useCallback(async () => {
    if (!email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await wooService.getUserSubscriptions(email);
      
      // Transformar los datos al formato que necesitamos
      const transformedData = data.map(subscription => ({
        id: subscription.id.toString(),
        status: subscription.status,
        plan_name: subscription.line_items[0]?.name || 'Plan desconocido',
        amount: parseFloat(subscription.total),
        currency: subscription.currency,
        current_period_end: subscription.next_payment_date || subscription.date_completed,
        payment_method: subscription.payment_method_title,
        created_at: subscription.date_created
      }));
      
      setSubscriptions(transformedData);
    } catch (err) {
      console.error('Error al obtener suscripciones:', err);
      setError(err.message);
      toast.error('No se pudieron cargar las suscripciones');
    } finally {
      setLoading(false);
    }
  }, [email]);
  
  // Cancelar una suscripción
  const cancelSubscription = useCallback(async (subscriptionId) => {
    setLoading(true);
    
    try {
      await wooService.cancelSubscription(subscriptionId);
      
      // Actualizar el estado local
      setSubscriptions(prevSubs => 
        prevSubs.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: 'cancelled' } : sub
        )
      );
      
      toast.success('Suscripción cancelada correctamente');
      return true;
    } catch (err) {
      console.error('Error al cancelar la suscripción:', err);
      toast.error('No se pudo cancelar la suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Cargar suscripciones al iniciar
  useEffect(() => {
    if (email) {
      fetchSubscriptions();
    }
  }, [email, fetchSubscriptions]);
  
  return {
    subscriptions,
    loading,
    error,
    refreshSubscriptions: fetchSubscriptions,
    cancelSubscription
  };
}

/**
 * Hook para obtener y gestionar los métodos de pago de WooCommerce
 */
export function useWooPaymentMethods(email) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  
  const wooService = new WooCommerceService();
  
  // Obtener métodos de pago
  const fetchPaymentMethods = useCallback(async () => {
    if (!email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Primero necesitamos obtener el ID de cliente
      const customers = await wooService.fetchFromWooCommerce(`/customers?email=${encodeURIComponent(email)}`);
      
      if (!customers || customers.length === 0) {
        throw new Error('Cliente no encontrado');
      }
      
      const userId = customers[0].id;
      setCustomerId(userId);
      
      // Luego obtenemos los métodos de pago
      try {
        const methods = await wooService.getUserPaymentMethods(email);
        
        // Transformamos los datos al formato que necesitamos
        const transformedMethods = methods.map(method => ({
          id: method.id.toString(),
          type: method.method_type || 'card',
          card_brand: method.card_type || 'unknown',
          last4: method.last4 || '****',
          exp_month: method.expiry_month || '',
          exp_year: method.expiry_year || '',
          is_default: method.is_default || false
        }));
        
        setPaymentMethods(transformedMethods);
      } catch (methodError) {
        console.error('Error al obtener métodos de pago, posible endpoint incorrecto:', methodError);
        // Si falla, mostramos un error pero no rompemos la experiencia
        setPaymentMethods([]);
      }
    } catch (err) {
      console.error('Error al obtener información del cliente:', err);
      setError(err.message);
      toast.error('No se pudieron cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  }, [email]);
  
  // Establecer método de pago predeterminado
  const setDefaultPaymentMethod = useCallback(async (paymentMethodId) => {
    if (!customerId) return false;
    
    setLoading(true);
    
    try {
      await wooService.setDefaultPaymentMethod(customerId, paymentMethodId);
      
      // Actualizar el estado local
      setPaymentMethods(prevMethods => 
        prevMethods.map(method => ({
          ...method,
          is_default: method.id === paymentMethodId
        }))
      );
      
      toast.success('Método de pago predeterminado actualizado');
      return true;
    } catch (err) {
      console.error('Error al establecer método de pago predeterminado:', err);
      toast.error('No se pudo actualizar el método de pago predeterminado');
      return false;
    } finally {
      setLoading(false);
    }
  }, [customerId]);
  
  // Eliminar método de pago
  const removePaymentMethod = useCallback(async (paymentMethodId) => {
    if (!customerId) return false;
    
    setLoading(true);
    
    try {
      await wooService.deletePaymentMethod(customerId, paymentMethodId);
      
      // Actualizar el estado local
      setPaymentMethods(prevMethods => 
        prevMethods.filter(method => method.id !== paymentMethodId)
      );
      
      toast.success('Método de pago eliminado correctamente');
      return true;
    } catch (err) {
      console.error('Error al eliminar método de pago:', err);
      toast.error('No se pudo eliminar el método de pago');
      return false;
    } finally {
      setLoading(false);
    }
  }, [customerId]);
  
  // Añadir método de pago
  const addPaymentMethod = useCallback(async (paymentData) => {
    if (!customerId) return false;
    
    setLoading(true);
    
    try {
      const newPaymentMethod = await wooService.addPaymentMethod(customerId, paymentData);
      
      // Añadir el nuevo método al estado
      setPaymentMethods(prevMethods => [
        ...prevMethods,
        {
          id: newPaymentMethod.id.toString(),
          type: newPaymentMethod.method_type || 'card',
          card_brand: newPaymentMethod.card_type || 'unknown',
          last4: newPaymentMethod.last4 || '****',
          exp_month: newPaymentMethod.expiry_month || '',
          exp_year: newPaymentMethod.expiry_year || '',
          is_default: newPaymentMethod.is_default || false
        }
      ]);
      
      toast.success('Método de pago añadido correctamente');
      return true;
    } catch (err) {
      console.error('Error al añadir método de pago:', err);
      toast.error('No se pudo añadir el método de pago');
      return false;
    } finally {
      setLoading(false);
    }
  }, [customerId]);
  
  // Cargar métodos de pago al iniciar
  useEffect(() => {
    if (email) {
      fetchPaymentMethods();
    }
  }, [email, fetchPaymentMethods]);
  
  return {
    paymentMethods,
    loading,
    error,
    customerId,
    refreshPaymentMethods: fetchPaymentMethods,
    setDefaultPaymentMethod,
    removePaymentMethod,
    addPaymentMethod
  };
}