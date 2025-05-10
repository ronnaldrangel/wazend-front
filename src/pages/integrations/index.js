import Layout from '../../components/layout/dashboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Store from './integrations';

export default function Index() {

    return (
        <Layout title="Integraciónes">
            <Store />
        </Layout>
    );
}
