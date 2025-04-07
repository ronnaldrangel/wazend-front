import Layout from '../../components/layout/dashboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Store from './store';

export default function Index() {

    return (
        <Layout title="Marketplace">


            {/* Título */}
            {/* <h1 className="text-4xl font-bold text-center mb-4">
                Marketplace
            </h1> */}

            <p className="text-md mb-20">
                Explora las mejores plantillas, plugins e integraciones para Wazend.
            </p>

            <Store />
        </Layout>
    );
}
