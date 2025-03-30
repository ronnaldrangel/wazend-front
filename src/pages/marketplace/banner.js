
import Link from 'next/link';

const Banner = () => {
    return (
     
        <div>

            {/* Banner para invitar a ser parte del marketplace */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-16 px-6 text-center mt-16 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Conviértete en creador hoy</h2>
                <p className="text-lg mb-6">
                    Envía una plantilla o complemento, hazte destacar y gana dinero, todo en solo unos clics.
                </p>
                <Link href="https://wa.link/5se5ao" passHref>
                    <button className="bg-white text-emerald-600 py-4 px-10 rounded-full shadow-lg hover:bg-emerald-100 transition duration-300 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-300">
                        Únete ahora
                    </button>
                </Link>
            </div>



        </div>
    );
};

export default Banner;
