import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function BuscarCliente() {
  const email = "dario_ferrero@yahoo.com"; // 🔹 Email fijo
  const [customerId, setCustomerId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Estado de carga

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/getCustomerData?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        console.log("🔹 Datos recibidos de la API:", data)

        if (response.ok) {
          setCustomerId(data.customerId);
          setOrders(data.orders);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Error al realizar la solicitud.");
      }
      setLoading(false); // 🔹 Se terminó de cargar
    };

    fetchOrders();
  }, []);

  // 🔹 Función para formatear la fecha con `date-fns`
  const formatFecha = (fecha) => {
    return format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pedidos de {email}</h1>

      {loading ? (
        <p className="text-gray-700">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {customerId && <p className="text-gray-700 mb-4">ID del Cliente: <strong>{customerId}</strong></p>}

          {orders.length > 0 ? (
            <Table className="w-full border rounded-lg shadow">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>ID</TableHead>
                  <TableHead>Producto(s)</TableHead> {/* Nueva columna */}
                  <TableHead>Fecha de factura</TableHead>
                  <TableHead>Fecha de pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-b">
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {order.line_items.map((item) => item.name).join(", ")}
                    </TableCell> {/* Muestra los nombres de los productos */}
                    <TableCell>{formatFecha(order.date_created)}</TableCell>
                    <TableCell>{order.date_paid ? formatFecha(order.date_paid) : '-'}</TableCell>
                    <TableCell>{order.total} {order.currency}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 mt-4">No se encontraron pedidos.</p>
          )}
        </>
      )}
    </div>
  );
}
