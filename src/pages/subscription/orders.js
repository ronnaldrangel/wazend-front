// components/SubscriptionList.js

import { useEffect, useState } from "react";
import { getAllSubscriptions } from "../../services/getAllOrders";

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const allSubscriptions = await getAllSubscriptions();
        const filteredSubscriptions = allSubscriptions.filter(subscription =>
          subscription.billing.email === "ronald@rangel.pro"
        );
        setSubscriptions(filteredSubscriptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Lista de Suscripciones</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <strong>ID: {subscription.id}</strong>
              <p>Fecha de Creación: {new Date(subscription.date_created).toLocaleString()}</p>
              <ul>
                {subscription.line_items.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
              <p>Fecha de factura: {new Date(subscription.date_created).toLocaleString()}</p>
              <p>Fecha de vencimiento: {new Date(subscription.next_payment_date_gmt).toLocaleString()}</p>
              <p>Ultimo pago: {new Date(subscription.last_payment_date_gmt).toLocaleString()}</p>
              <p>Estado: {subscription.status}</p>
              <p>Cliente: {subscription.billing.email}</p>
              {/* Agrega más detalles de la suscripción según lo necesites */}
            </li>
          ))}
        </ul>
      ) : (
        <div>No hay datos</div>
      )}
    </div>
  );
};

export default SubscriptionList;
