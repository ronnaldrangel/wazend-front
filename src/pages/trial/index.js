import Layout from '../../components/layout/dashboard';
import Instances from './instances';
import { PageTitle } from '@/hooks/use-page-title';

export default function Index() {

  return (
    <>
      <PageTitle title="Prueba gratis" />
      <Layout title="Prueba gratis">
        <Instances/>
      </Layout>
    </>
  );
}

