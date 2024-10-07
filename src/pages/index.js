import Layout from '../layout/dashboard';
import UserPanel from '../components/UserPanel';
import React from 'react';


export default function Index(){
  return (
    <Layout title="Mis servicios" showButton={true}>
      <UserPanel />
    </Layout>
  );
};

