import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/loaders/skeleton";
import { useStrapiData } from "@/services/strapiService";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function Index() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const { data: stores = [], error, isLoading } = useStrapiData(
    "bulletins?populate=*"
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1, spacing: 10 },
      mode: "snap",
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-600 dark:text-red-400">
        Error al cargar los datos: {error.message}
      </div>
    );

  return (
    <div className="overflow-hidden relative">
      <div ref={sliderRef} className="keen-slider">
        {stores.map((store) => {
          const link =
            store.isCheckout && email
              ? `${store.button}&billing_email=${encodeURIComponent(email)}`
              : store.button;

          return (
            <div
              key={store.id}
              className="keen-slider__slide flex justify-center w-full"
            >
              <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
                {store.img?.url && (
                  <img
                    src={store.img.url}
                    alt={store.title}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                )}

                <p className="text-xl font-semibold tracking-tight text-gray-950">
                  {store.title}
                </p>
                <p className="flex-grow text-base text-gray-600">
                  {store.description}
                </p>

                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full rounded-lg p-3 text-center text-base font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600"
                >
                  Ver más
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots clicables */}
      {instanceRef.current && (
        <div className="flex justify-center gap-2 mt-4">
          {stores.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => instanceRef.current.moveToIdx(idx)}
              className={`h-3 w-3 rounded-full ${
                currentSlide === idx ? "bg-emerald-600" : "bg-gray-300"
              }`}
              aria-label={`Ir a la diapositiva ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
