import Layout from '../components/layout/dashboard';
import ListInstances from './dashboard/instanceList';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Featured from './dashboard/Featured';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Dashboard" showButton={true}>

      <ListInstances />
      <Featured/>

    </Layout>
  );
};

