import Layout from '../../components/layout/dashboard';
import Billing from './billing';
import SubscriptionsTable from './subscriptions';
import { PageTitle } from '@/hooks/use-page-title';

export default function Index() {
    return (
        <>
            <PageTitle title="Facturación" />
            <Layout title="Facturación">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Column for tabs */}
                    <div className="w-full md:w-2/3">
                        <SubscriptionsTable />
                    </div>

                    {/* Billing column */}
                    <div className="w-full md:w-1/3">
                        <Billing />
                    </div>
                </div>
            </Layout>
        </>
    );
}