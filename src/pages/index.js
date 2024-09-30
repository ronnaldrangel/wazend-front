import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Layout from '../layout/dashboard';


export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session == null) return;
    console.log('session.jwt:', session.jwt);

  }, [session]);

  //console.log(session)

  return (
    <Layout title="Hola, estimado 👋">
        Index
    </Layout>
  );
}
