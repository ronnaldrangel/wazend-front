import Layout from '../../components/layout/dashboard';
import Billing from './billing';
import Subscription from './subscriptions';


export default function Index() {
    return (
        <Layout>
            <Subscription />
            <div className='mt-8'>
            <Billing />
            </div>
        </Layout>
    );
}
