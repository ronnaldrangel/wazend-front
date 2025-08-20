import useSWR from "swr";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import FormInput from "@/components/ui/form-input";
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Preload from "@/components/loaders/skeleton";
import { Button } from "@/components/ui/button";

const API_KEY = process.env.NEXT_PUBLIC_WAZEND_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_WAZEND_API_URL;

// Fetcher para SWR con manejo de errores
const fetcher = async (url) => {
  try {
    // console.log(`🔍 Fetching data from: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("❌ Error al obtener los datos");
    }

    const data = await response.json();
    // console.log("✅ Data recibida:", data);

    return data || null;
  } catch (error) {
    // console.error("❌ Fetch error:", error);
    return null;
  }
};

const ProxySettings = ({ instanceId, serverUrl }) => {
  // console.log(`🆕 Componente montado con name: ${name}`);

  // Cargar datos con SWR
  const { data, error } = useSWR(`${serverUrl}/proxy/find/${instanceId}`, fetcher);

  // Estado inicial con valores predeterminados
  const [proxyData, setProxyData] = useState({
    enabled: false,
    host: "",
    port: "",
    protocol: "http", // Siempre inicia con "http"
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Actualizar estado cuando la API responde
  useEffect(() => {
    if (data !== undefined) {
      // console.log("🔄 Actualizando estado con datos de API...");
      setProxyData({
        enabled: data?.enabled ?? false,
        host: data?.host ?? "",
        port: data?.port ?? "",
        protocol: data?.protocol && data?.protocol !== "" ? data.protocol : "http", // Si es vacío, usar "http"
        username: data?.username ?? "",
        password: data?.password ?? "",
      });
    }
  }, [data]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(`✏️ Cambiando ${name}: ${value}`);
    setProxyData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el switch
  const toggleEnabled = () => {
    // console.log("🔘 Toggle Enabled:", !proxyData.enabled);
    setProxyData((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  // Guardar configuración con POST en `/proxy/set/`
  const saveSettings = async () => {
    // Asegurar que siempre se envíe "http" si `protocol` está vacío
    const payload = {
      ...proxyData,
      protocol: proxyData.protocol && proxyData.protocol !== "" ? proxyData.protocol : "http",
    };

    // console.log("💾 Enviando datos a /proxy/set/:", payload);
    setIsLoading(true);

    try {
      const response = await fetch(`${serverUrl}/proxy/set/${instanceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      // console.log("📨 Respuesta del servidor:", result);

      if (response.ok) {
        toast.success("Configuración guardada correctamente");
      } else {
        toast.error("Error: invalid proxy");
      }
    } catch (error) {
      // console.error("❌ Error al conectar con el servidor:", error);
      toast.error("❌ Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    // console.error("❌ Error en SWR:", error);
    return <div>Error al cargar configuraciones.</div>;
  }

  if (!data && data !== null) return <Preload />;

  return (
    <Card shadow="custom" padding="md" className="border border-border shadow-[0_0_5px_rgba(0,0,0,0.1)]">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Enabled</h2>
          <p className="text-sm text-muted-foreground">Enable or disable the proxy</p>
        </div>
        <Switch
          checked={proxyData.enabled}
          onCheckedChange={toggleEnabled}
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-foreground mb-3">Protocol</label>
=======
          <label className="block text-sm font-medium text-foreground mb-1">Protocol</label>
>>>>>>> 1fa977596a23946df09689c9b93cfb4cf27a71bc
          <Select
            value={proxyData.protocol}
            onValueChange={(value) => setProxyData((prev) => ({ ...prev, protocol: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="http">http</SelectItem>
              <SelectItem value="https">https</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <FormInput
            type="text"
            name="host"
            label="Host"
            value={proxyData.host}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <FormInput
            type="number"
            name="port"
            label="Port"
            value={proxyData.port}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-4">
        <div>
          <FormInput
            type="text"
            name="username"
            label="Username"
            value={proxyData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormInput
            type="text"
            name="password"
            label="Password"
            value={proxyData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={saveSettings}
        disabled={isLoading}
        variant="default"
        className="mt-4"
      >
        {isLoading ? "Guardar..." : "Guardar"}
      </Button>
    </Card>
  );
};

export default ProxySettings;
