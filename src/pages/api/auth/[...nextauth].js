import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { signIn } from '../../../services/auth';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    
    CredentialsProvider({
      name: 'Sign in with Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const { user, jwt } = await signIn({
            email: credentials.email,
            password: credentials.password,
          });
          return { ...user, jwt };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google' || account.provider === 'github') {
        try {
          console.log(`🔍 Verificando usuario en Strapi con ${account.provider}:`, profile.email);

          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[email][$eq]=${profile.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const users = await res.json();
          if (!res.ok || !Array.isArray(users)) return false;
          
          if (users.length > 0) {
            const existingUser = users[0];
            if (existingUser.provider === 'local') return false;
          }

          const authRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const authData = await authRes.json();
          if (!authData.jwt) return false;
          return true;
        } catch (error) {
          console.error(`❌ Error en signIn con ${account.provider}:`, error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Si es un login inicial con OAuth
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const authRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });

          const authData = await authRes.json();
          if (!authData.jwt) throw new Error('Error al autenticar con Strapi');
          
          // Decodificar el JWT manualmente
          const payload = authData.jwt.split('.')[1];
          const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
          
          token.id = authData.user.id;
          token.jwt = authData.jwt;
          token.name = authData.user.username || authData.user.email;
          token.email = authData.user.email;
          // Guardar la fecha de expiración
          token.exp = decodedPayload.exp;
        } catch (error) {
          console.error('❌ Error autenticando con Strapi:', error);
        }
      } else if (user) {
        // Si es un login con credenciales
        token.id = user.id;
        token.jwt = user.jwt;
        token.name = user.name;
        token.email = user.email;
        
        // Decodificar el JWT manualmente para obtener la fecha de expiración
        if (user.jwt) {
          try {
            const parts = user.jwt.split('.');
            if (parts.length === 3) {
              const payload = parts[1];
              const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
              token.exp = decodedPayload.exp;
            }
          } catch (error) {
            console.error('❌ Error decodificando JWT:', error);
          }
        }
      }
      
      // Verificar si el token ha expirado en cada solicitud
      const now = Math.floor(Date.now() / 1000);
      if (token.exp && now >= token.exp) {
        // El token ha expirado
        token.error = "TokenExpired";
      }
      
      return token;
    },

    async session({ session, token }) {
      session.id = token.id;
      session.jwt = token.jwt;
      session.user.name = token.name;
      session.user.email = token.email;
      
      // Pasar el estado de error a la sesión si el token ha expirado
      if (token.error === "TokenExpired") {
        session.error = "TokenExpired";
      }
      
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
  
  // Añadir un JWT secreto para operaciones de NextAuth
  secret: process.env.NEXTAUTH_SECRET,
  
  // Establecer una duración de sesión para mantener la coherencia con Strapi
  session: {
    strategy: "jwt",
    // Este tiempo debe ser menor que el tiempo de expiración de Strapi
    maxAge: 7 * 24 * 60 * 60, // 30 días
  },
});