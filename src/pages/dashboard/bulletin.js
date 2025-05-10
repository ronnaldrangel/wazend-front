import { useSession } from 'next-auth/react';
import Loader from '@/components/loaders/skeleton';
import { useStrapiData } from '@/services/strapiService';
import { useEffect, useRef } from 'react';

const Index = () => {
    const { data: session } = useSession();
    const email = session?.user?.email;
    const sliderRef = useRef(null);

    const { data: stores, error, isLoading } = useStrapiData('bulletins?populate=*');

    useEffect(() => {
        const slider = sliderRef.current;
        let isDown = false;
        let startX;
        let scrollLeft;

        const handleMouseDown = (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
            slider.classList.remove('active');
        };

        const handleMouseUp = () => {
            isDown = false;
            slider.classList.remove('active');
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        };

        if (slider) {
            slider.addEventListener('mousedown', handleMouseDown);
            slider.addEventListener('mouseleave', handleMouseLeave);
            slider.addEventListener('mouseup', handleMouseUp);
            slider.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (slider) {
                slider.removeEventListener('mousedown', handleMouseDown);
                slider.removeEventListener('mouseleave', handleMouseLeave);
                slider.removeEventListener('mouseup', handleMouseUp);
                slider.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="text-red-600 dark:text-red-400">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    return (
        <>
            <div>
                <p className="text-xl font-semibold mb-4">Enlaces importantes</p>
                <div ref={sliderRef} className="slider-container">
                    <div className="slider-content">
                        {stores.map((store) => {
                            let link = store.button;
                            if (store.isCheckout && email) {
                                link = `${store.button}&billing_email=${encodeURIComponent(email)}`;
                            }

                            return (
                                <div key={store.id} className="slider-item">
                                    <div className="flex flex-col bg-white rounded-lg shadow-md p-6 gap-4">
                                        {store.img.url && (
                                            <img
                                                src={store.img.url}
                                                alt={store.title}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                        )}

                                        <p className="text-xl font-semibold tracking-tight text-gray-950">{store.title}</p>
                                        <p className="text-base text-gray-600 flex-grow">{store.description}</p>
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 w-full text-center rounded-lg p-3 text-base font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600"
                                        >
                                            Ver más
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
