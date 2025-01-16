import { useRouter } from 'next/router';
import Layout from '../../components/layout/dashboard';
import LayoutInstance from './LayoutInstance';


const InstancePage = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id de la ruta

  return (
    <Layout>
      <LayoutInstance instanceId={id} />
    </Layout>
    //<LayoutInstance instanceId={id} />
  );
};

export default InstancePage;
