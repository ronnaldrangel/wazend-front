import User from './User';
import Layout from '../../components/layout/dashboard';

import Data from './Data';

function Index() {
  return (
    <>
    <Layout title='Perfil' NoTab={true}>
      <User />
    </Layout>
    </>
  );
}

export default Index;
