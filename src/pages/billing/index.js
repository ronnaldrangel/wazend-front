import { useState } from 'react';
import Layout from '../../components/layout/dashboard';
import MyAccount from './billing';

export default function Index() {

    return (
        <Layout title="Facturación">
            <MyAccount/>
        </Layout>
    );
}
