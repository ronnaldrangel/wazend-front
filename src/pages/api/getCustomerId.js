import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

export default async function handler(req, res) {
  // 🔹 Verificar si la solicitud viene del propio servidor
  const referer = req.headers.referer || "";
  if (!referer.includes(process.env.NEXTAUTH_URL)) {
    return res.status(403).json({ error: "Acceso no permitido" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "El correo electrónico es requerido" });
  }

  try {
    const response = await api.get("customers", { email, role: "all" });
    const customers = response.data;

    if (customers.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(200).json({ customerId: customers[0].id });
  } catch (error) {
    console.error("Error al obtener el cliente:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
}
