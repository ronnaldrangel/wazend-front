import Layout from '../../components/layout/dashboard';
import Billing from './billing';
import SubscriptionsTableSoporte from './woo';

export default function Index() {

    return (
        <Layout title="Facturación">



            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                    <SubscriptionsTableSoporte />
                </div>
                <div className="w-full md:w-1/3">
                    <Billing />
                </div>
            </div>

        </Layout>
    );
}
