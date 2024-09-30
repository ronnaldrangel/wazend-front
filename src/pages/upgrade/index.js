
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import useSWR from 'swr';

import Pricing from '../upgrade/pricing';
import Navbar from '../../components/navbar';

import SpinLoader from '../../components/spiner'

const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Payment = () => {
    const { data: session, status } = useSession(); // Obtener la sesión actual
    const [jwt, setJwt] = useState(null); // Estado para almacenar el token JWT
    const router = useRouter();

    // Fetcher para obtener los datos del usuario
    const fetcher = async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching user data');
        }

        return response.json();
    };

    // Obtener el token JWT desde la sesión cuando esté disponible
    useEffect(() => {
        const getToken = async () => {
            const session = await getSession(); // Obtener sesión actual
            if (session) {
                setJwt(session.jwt); // Guardar el token JWT en el estado
            }
        };

        getToken();
    }, []);

    // Usar SWR para obtener la información del usuario
    const { data, error, isLoading } = useSWR(jwt ? `${strapiUrl}/api/users/me` : null, fetcher);

    // Redirigir al dashboard si el usuario ya tiene un plan activo
    useEffect(() => {
        if (data && data.planPagado) {
            router.push('/'); // Redirige al dashboard si el plan está pagado
        }
    }, [data, router]);

    // Mostrar loading mientras se obtienen los datos del usuario
    if (isLoading || status === 'loading') return <><SpinLoader/></>;
    if (error) return <p>Ha ocurrido un error</p>;

    return (
        <>
            <Navbar />
            <Pricing />
        </>
    );
};

export default Payment;
