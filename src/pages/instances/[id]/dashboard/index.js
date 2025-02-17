import { useRouter } from 'next/router';
import Layout from '@/components/layout/dashboard';
import LayoutInstance from '@/pages/instances/Dashboard';
import LayoutGeneral from '../../layoutGeneral';


const InstancePage = () => {
  const router = useRouter();
  const { id } = router.query; // Obtén el id de la ruta

  return (
    <Layout>
      <LayoutGeneral>

        <div className="rounded-lg bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>

        <LayoutInstance instanceId={id} />
      </LayoutGeneral>
    </Layout>
  );
};

export default InstancePage;
