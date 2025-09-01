"use client";
import { FunctionComponent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const About: FunctionComponent = () => {
  const images = [
    "/assets/congresso1.jpg",
    "/assets/congresso2.jpg",
    "/assets/congresso3.jpg",
    "/assets/congresso4.jpg",
    "/assets/congresso5.jpg",
    "/assets/congresso6.jpg",
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden"
    >
      {/* Overlay suave para destaque das imagens */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-green-400 drop-shadow-lg mb-6 animate-fadeInUp">
          Sobre o Congresso
        </h2>

        <p className="text-gray-100 text-lg md:text-xl max-w-3xl mx-auto mb-12 animate-fadeInUp delay-100">
          O Congresso de Jovens da Assembleia de Deus em Petrolina e Lagoa
          Grande é um momento único de{" "}
          <strong>adoração, aprendizado e comunhão</strong>. Durante esses dias,
          a juventude tem a oportunidade de fortalecer a fé, se conectar com
          outros jovens e participar do <strong>Grande Coral de Jovens</strong>,
          louvando a Deus com alegria e dedicação.
        </p>

        {/* Slider de fotos */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={20}
          slidesPerView={2}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="max-w-5xl mx-auto"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src={img}
                  alt={`Foto do congresso ${index + 1}`}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default About;
