"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import {
  Autoplay,
  EffectCoverflow,
  Keyboard,
  Mousewheel,
  Pagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";

type Character = {
  id: number;
  name: string;
  image: string;
};

const characters: Character[] = [
  {
    id: 1,
    name: "Self Servis Kafeler",
    image: "/cafe/self.jpeg",
  },
  {
    id: 2,
    name: "Butik Kafeler",
    image: "/cafe/butik.jpg",
  },
  {
    id: 3,
    name: "Nostaljik Kafeler",
    image: "/cafe/nostaljik.png",
  },
  {
    id: 4,
    name: "Kitap Kafeler",
    image: "/cafe/kitap.png",
  },
  {
    id: 5,
    name: "Canlı Müzikli Kafeler",
    image: "/cafe/canlimuzik.jpg",
  },
  {
    id: 6,
    name: "Sanat Kafe",
    image: "/cafe/sanat.jpeg",
  },
  {
    id: 7,
    name: "Açık Hava Kafeleri",
    image: "/cafe/acikhava.png",
  },
  {
    id: 8,
    name: "Vegan ve Sağlıklı Yaşam Kafeleri",
    image: "/cafe/vegan.png",
  },
  {
    id: 9,
    name: "Konsept Kafeler",
    image: "/cafe/konsept.jpeg",
  },
];

const swiperParams: SwiperOptions = {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  spaceBetween: 10,
  speed: 700,
  initialSlide: 4,
  loop: true,
  watchSlidesProgress: true,
  preventInteractionOnTransition: false,
  loopPreventsSliding: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    waitForTransition: true,
  },
  mousewheel: {
    forceToAxis: true,
    sensitivity: 1,
    releaseOnEdges: true,
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false,
  },
  pagination: {
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 3,
    bulletClass:
      "swiper-pagination-bullet !w-4 !h-4 !bg-white transition-all duration-600",
    bulletActiveClass: "swiper-pagination-bullet-active",
  },
};

const CafeCategorySlider = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full">
        {Array.from({ length: 180 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-4/5 z-10">
        <Swiper
          {...swiperParams}
          modules={[
            Autoplay,
            EffectCoverflow,
            Keyboard,
            Mousewheel,
            Pagination,
          ]}
          className="w-full py-12 [&_.swiper-slide-shadow-left]:opacity-0 [&_.swiper-slide-shadow-right]:opacity-0"
        >
          {[...characters, ...characters].map((character, index) => (
            <SwiperSlide
              key={`${character.id}-${index}`}
              className="!w-[400px] !h-[400px] rounded-xl overflow-hidden transition-all duration-1000 group relative"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-stone-100 via-[#cdbfac] to-stone-200

                        mix-blend-multiply z-10 group-[.swiper-slide-active]:bg-gray-500/40"
              />
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-[.swiper-slide-active]:scale-130"
              />
              <p className="absolute left-5 bottom-3 text-white text-xl font-semibold italic tracking-wider z-20 opacity-0 scale-0 rotate-360 transition-all duration-800 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:scale-100 group-[.swiper-slide-active]:rotate-0">
                {character.name}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CafeCategorySlider;
