import Layout from '../../components/layout/dashboard';
import React from 'react';
import { useRouter } from 'next/router';
import SubsList from './subsList';
import Bulletin from './bulletin';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Index() {
  const router = useRouter();


  return (
    <Layout title="Tus instancias">


      <div className="flex flex-col space-y-10">
        <SubsList />
        <Bulletin />
      </div>


    </Layout>
  );
};

