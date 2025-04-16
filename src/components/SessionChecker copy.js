// components/SessionChecker.js
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function SessionChecker() {
  const { data: session, status } = useSession();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Limpiar cualquier intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Solo configurar verificación si hay una sesión activa
    if (status === "authenticated" && session) {
      // Verificar inmediatamente si hay un error de token expirado
      if (session.error === "TokenExpired") {
        console.log("Token expirado detectado, cerrando sesión...");
        signOut({ callbackUrl: "/login" });
        return;
      }

      // Configurar verificación periódica (cada 1 minuto)
      intervalRef.current = setInterval(async () => {
        try {
          // Forzar actualización de la sesión para verificar el estado del token
          const response = await fetch("/api/auth/session");
          const updatedSession = await response.json();
          
          if (updatedSession.error === "TokenExpired") {
            console.log("Token expirado detectado en verificación periódica, cerrando sesión...");
            signOut({ callbackUrl: "/login" });
          }
        } catch (error) {
          console.error("Error verificando sesión:", error);
        }
      }, 60000); // 1 minuto
    }

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session, status]);

  // Verificar si el JWT es válido haciendo una solicitud al endpoint /api/users/me de Strapi
  useEffect(() => {
    if (status === "authenticated" && session?.jwt) {
      const checkJwtValidity = async () => {
        try {
          // Hacemos una solicitud a la API de Strapi para verificar si el token sigue siendo válido
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${session.jwt}`,
            },
          });
          
          // Si la respuesta es 401 o 403, significa que el token ha expirado o es inválido
          if (response.status === 401 || response.status === 403) {
            console.log("Token inválido o expirado en verificación con Strapi, cerrando sesión...");
            signOut({ callbackUrl: "/login" });
            return;
          }

          // Verificamos el contenido de la respuesta
          const data = await response.json();
          
          // Si no hay datos o hay un error, también cerramos sesión
          if (!data || data.error) {
            console.log("Error en respuesta de Strapi, cerrando sesión...");
            signOut({ callbackUrl: "/login" });
          }
        } catch (error) {
          console.error("Error verificando JWT con Strapi:", error);
          // Si hay un error de conexión, no cerramos sesión automáticamente
          // ya que podría ser un problema de red temporal
        }
      };
      
      // Verificar validez del JWT al cargar el componente
      checkJwtValidity();
      
      // También configuramos una verificación periódica con Strapi
      const strapiCheckInterval = setInterval(checkJwtValidity, 5 * 60 * 1000); // Cada 5 minutos
      
      return () => {
        clearInterval(strapiCheckInterval);
      };
    }
  }, [session, status]);

  return null; // Este componente no renderiza nada
}