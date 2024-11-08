import { useRouter } from 'next/router';
import Layout from '../../layout/dashboard';
import LayoutInstance from '../../components/instances/LayoutInstance'; // Asegúrate de que la ruta sea correcta


const InstancePage = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id de la ruta

  return (
    <Layout title='Mi Instancia'>
    {/* <Layout title={`Mi Instancia ${id ? `(${id})` : ''}`}> */}
    {/* Pasa el id como prop a LayoutInstance */}
    <LayoutInstance instanceId={id} />
    </Layout>
  );
};

export default InstancePage;
