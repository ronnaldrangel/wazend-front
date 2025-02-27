import Layout from '../../components/layout/dashboard';
import InstanceList from './instanceList';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Dashboard">
      <InstanceList />
    </Layout>
  );
};

