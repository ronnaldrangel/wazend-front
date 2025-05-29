import Layout from '../../components/layout/dashboard';
import Affiliates from './affiliates';
import Request from './request';

export default function Index() {

    return (
        <Layout title="Recomienda & Gana">

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                    <Affiliates />
                </div>
                <div className="w-full md:w-1/3">
                    <Request />
                </div>
            </div>

        </Layout>
    );
}
