import User from './User';
import Layout from '../../components/layout/dashboard';

function Index() {
  return (
    <>
      <Layout>
        <div className="w-full max-w-3xl mx-auto">
          <User />
        </div>
      </Layout>
    </>
  );
}

export default Index;
