import { useState } from 'react';
import Layout from '../../components/layout/dashboard';
import MyAccount from './myaccount';

export default function Index() {

    return (
        <Layout>
            <MyAccount/>
        </Layout>
    );
}
