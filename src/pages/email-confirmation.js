import Head from 'next/head';
import Link from 'next/link';

export default function EmailSuccess() {
    return (
        <>
            <Head>
                <title>Wazend</title>
            </Head>
            <div className="h-screen bg-cover bg-center" style={{ backgroundImage: 'url("https://app.whaticket.com/assets/backgroundSuccess-DOAtfqXm.png")' }}>
                <main className="grid min-h-full place-items-center bg-white bg-opacity-0 px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                        <img
                            className="h-10 w-auto mx-auto mb-10"
                            src="https://res.cloudinary.com/dyhpggkre/image/upload/v1711698081/logo_35fc05b51f.svg"
                            alt="Wazend Logo"
                        />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">¡Excelente! 🎉</h1>
                        <p className="mt-6 text-2xl leading-7 text-gray-600">¡Ya casi terminas! Verifica tu correo electrónico para activar tu cuenta en Wazend.</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/login"
                                className="rounded-md bg-emerald-600 px-4 py-3 text-large font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
