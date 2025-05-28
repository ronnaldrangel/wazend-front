import Layout from '../../components/layout/dashboard';
import Billing from './billing';
import OrdersTableSoporte from './orders';
import SubscriptionsTable from './subscriptions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Index() {
    return (
        <Layout title="Facturación">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Column for tabs */}
                <div className="w-full md:w-2/3">
                    <Tabs defaultValue="subscriptions" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
                            <TabsTrigger value="orders">Órdenes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="subscriptions">
                            <SubscriptionsTable />
                        </TabsContent>
                        <TabsContent value="orders">
                            <OrdersTableSoporte />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Billing column */}
                <div className="w-full md:w-1/3 md:pt-14">
                    <Billing />
                </div>
            </div>
        </Layout>
    );
}