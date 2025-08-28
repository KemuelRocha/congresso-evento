"use client";
import { FunctionComponent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface AboutProps {}

const About: FunctionComponent<AboutProps> = () => {
  const images = [
    "/assets/congresso1.jpg",
    "/assets/congresso2.jpg",
    "/assets/congresso3.jpg",
    "/assets/congresso4.jpg",
    "/assets/congresso5.jpg",
    "/assets/congresso6.jpg",
  ];

  return (
    <section className="py-16 bg-[#353929]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Sobre o Congresso
        </h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12">
          O Congresso de Jovens da Assembleia de Deus em Petrolina e Lagoa
          Grande é um momento único de adoração, aprendizado e comunhão. Durante
          esses dias, a juventude tem a oportunidade de fortalecer a fé, se
          conectar com outros jovens e participar do{" "}
          <strong>Grande Coral de Jovens</strong>, louvando a Deus com alegria e
          dedicação.
        </p>

        {/* Slider de fotos */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={2}
          loop
          className="max-w-4xl mx-auto"
          autoplay={{ delay: 3000 }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Foto do congresso ${index + 1}`}
                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default About;
