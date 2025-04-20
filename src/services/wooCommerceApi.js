// services/wooCommerceApi.js
// Este archivo maneja la conexión con la API de WooCommerce

/**
 * Clase para manejar las llamadas a la API de WooCommerce
 */
export class WooCommerceService {
  constructor() {
    // Usar las variables de entorno con los nombres correctos
    this.apiUrl = process.env.WC_STORE_URL ? `${process.env.WC_STORE_URL}/wp-json/wc/v3` : 'https://wazend.net/wp-json/wc/v3';
    this.consumerKey = process.env.WC_CONSUMER_KEY || 'ck_019606c4600dc03ee990821c3ab5871174018898';
    this.consumerSecret = process.env.WC_CONSUMER_SECRET || 'cs_2423b394a302f2679e628d31a39a99bfcb541aaa';
  }

  /**
   * Obtiene el token de autenticación básica para WooCommerce
   */
  getAuthHeaders() {
    const credentials = `${this.consumerKey}:${this.consumerSecret}`;
    const encodedCredentials = typeof window !== 'undefined' 
      ? btoa(credentials) 
      : Buffer.from(credentials).toString('base64');

    return {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Realiza una solicitud a la API de WooCommerce
   */
  async fetchFromWooCommerce(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    
    const requestOptions = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la llamada a WooCommerce API:', error);
      throw error;
    }
  }

  /**
   * Obtiene las suscripciones de un usuario por email
   */
  async getUserSubscriptions(email) {
    // Para las suscripciones, usamos la API de WooCommerce Subscriptions
    return this.fetchFromWooCommerce(`/subscriptions?customer_email=${encodeURIComponent(email)}`);
  }

  /**
   * Obtiene los métodos de pago de un usuario por email
   */
  async getUserPaymentMethods(email) {
    // Para WooCommerce, primero necesitamos obtener el ID de cliente
    const customers = await this.fetchFromWooCommerce(`/customers?email=${encodeURIComponent(email)}`);
    
    if (!customers || customers.length === 0) {
      throw new Error('Cliente no encontrado');
    }
    
    const customerId = customers[0].id;
    
    // Luego obtener los métodos de pago usando WooCommerce Payment Gateway API
    // Nota: este endpoint puede variar según tu configuración de WooCommerce
    return this.fetchFromWooCommerce(`/payment-methods?customer=${customerId}`);
  }

  /**
   * Cancela una suscripción
   */
  async cancelSubscription(subscriptionId) {
    return this.fetchFromWooCommerce(`/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'cancelled'
      })
    });
  }

  /**
   * Actualiza una suscripción
   */
  async updateSubscription(subscriptionId, data) {
    return this.fetchFromWooCommerce(`/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Establece un método de pago predeterminado
   */
  async setDefaultPaymentMethod(customerId, paymentMethodId) {
    return this.fetchFromWooCommerce(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify({
        default_payment_method: paymentMethodId
      })
    });
  }

  /**
   * Elimina un método de pago
   */
  async deletePaymentMethod(customerId, paymentMethodId) {
    // Este endpoint puede variar según tu configuración
    return this.fetchFromWooCommerce(`/payment-methods/${paymentMethodId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Añade un método de pago nuevo
   * Nota: Esta función dependerá de cómo hayas configurado el procesamiento de pagos en WooCommerce
   */
  async addPaymentMethod(customerId, paymentData) {
    return this.fetchFromWooCommerce(`/payment-methods`, {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        ...paymentData
      })
    });
  }
}