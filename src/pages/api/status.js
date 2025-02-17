export default function handler(req, res) {
    res.status(200).json({
      status: "active",
      timestamp: new Date().toISOString(),
      message: "El servicio está funcionando correctamente.",
    });
  }
  