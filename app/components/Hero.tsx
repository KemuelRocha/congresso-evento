"use client";
import { FunctionComponent } from "react";

interface HeroProps {
  onOpenModal: () => void;
}

const Hero: FunctionComponent<HeroProps> = ({ onOpenModal }) => {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/hero-bg.png')" }}
    >
      {/* Overlay escuro para contraste do texto */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 container mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Congresso de Jovens 2025
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Seja bem-vindo ao Site Oficial do Congresso de Jovens 2025! Participe
          do <strong>Grande Coral de Jovens</strong> e louve a Deus junto com
          jovens da nossa filial. As inscrições estão abertas de{" "}
          <strong>01/01/2025 a 31/01/2025</strong>.
          <strong>Não perca essa oportunidade</strong> de fazer parte desse
          momento inesquecível!
        </p>

        <button
          onClick={onOpenModal}
          className="inline-block bg-[#716353] text-white px-8 py-3 rounded-2xl shadow hover:bg-[#353929] transition"
        >
          Inscreva-se no Coral
        </button>
      </div>
    </section>
  );
};

export default Hero;
