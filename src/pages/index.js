import Layout from '../components/layout/dashboard';
import UserPanel from '../components/UserPanel';
import React from 'react';


export default function Index(){
  return (
    <Layout title="Dashboard" showButton={true}>
      <UserPanel />
    </Layout>
  );
};

