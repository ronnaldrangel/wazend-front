
import Layout from '../../layout/dashboard';
import React from 'react';

import PanelAPI from './LayoutInstance';

import FetchInstance from './FetchInstance';


export default function Index(){
  return (
    <Layout title="Instancia #128">
      <FetchInstance/>
    </Layout>
  );
};

