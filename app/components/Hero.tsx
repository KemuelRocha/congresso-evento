"use client";

import { FunctionComponent } from "react";

interface Inscricao {
  id: string;
  codigo?: string;
  nome: string;
  sexo: string;
  idade: number;
  area: number;
  congregacao: string;
  lideranca: string;
  whatsapp: string;
  fardamentoCiente: boolean;
  cartaoMembro: string;
  createdAt?: any; // Timestamp do Firestore
}

interface HeroProps {
  onOpenModal: () => void;
  onOpenVestibularModal: () => void;
}

const Hero: FunctionComponent<HeroProps> = ({
  onOpenModal,
  onOpenVestibularModal,
}) => {
  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/hero-bg.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40"></div>

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-green-400 mb-4 animate-fadeInUp">
          Congresso de Jovens 2025
        </h1>

        <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-6 max-w-3xl mx-auto animate-fadeInUp delay-100">
          Seja bem-vindo ao Site Oficial do{" "}
          <strong>Congresso de Jovens 2025</strong>! Participe do{" "}
          <strong>Grande Coral de Jovens</strong> e louve a Deus junto com
          jovens da nossa filial.
          <br />
          Inscrições abertas de <strong>03/09/2025 a 30/09/2025</strong>.
        </p>

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            onClick={onOpenModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full shadow-2xl transform hover:-translate-y-1 transition-all animate-fadeInUp delay-200 cursor-pointer"
          >
            Inscreva-se no Grande Coral
          </button>
          {/* <button
            onClick={onOpenVestibularModal}
            className="bg-gray-700 hover:bg-gray-900 text-white font-semibold px-8 py-4 rounded-full shadow-2xl transform hover:-translate-y-1 transition-all animate-fadeInUp delay-300 cursor-pointer"
          >
            Inscreva-se no Vestibular Bíblico
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
