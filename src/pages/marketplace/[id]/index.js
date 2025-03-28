import { useRouter } from 'next/router';
import Layout from '@/components/layout/dashboard';
import Product from './product';

export default function Marketplace() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            {id && <Product documentId={id} />}
        </Layout>
    );
}
