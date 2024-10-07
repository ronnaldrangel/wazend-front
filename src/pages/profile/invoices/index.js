import React from 'react';
import { useSession } from 'next-auth/react';

import ProfileLayout from '../ProfileLayout';


export default function General() {

    return (
        <>
        <ProfileLayout>
            <p>Invoices</p>
        </ProfileLayout>
        </>
    );
};
