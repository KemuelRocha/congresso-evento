"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { useInscricoesCount } from "../hooks/useInscricoesCount";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

interface HeroProps {
  onOpenModal: () => void;
  onOpenVestibularModal: () => void;
}

const Hero: FunctionComponent<HeroProps> = ({
  onOpenModal,
  onOpenVestibularModal,
}) => {
  const count = useInscricoesCount();
  const [totalVagas, setTotalVagas] = useState<number | null>(null);

  const dataInicio = new Date("2025-09-20T11:59:59");
  const hoje = new Date();
  const inscricoesAbertas = hoje > dataInicio;

  useEffect(() => {
    const fetchTotal = async () => {
      const ref = doc(db, "vagas", "total");
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setTotalVagas(data.valor);
      }
    };

    fetchTotal();
  }, []);
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
          Inscrições abertas de <strong>03/09/2025 a 20/09/2025</strong>.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6 animate-fadeInUp delay-150">
          {/* Inscrições confirmadas */}
          <div className="flex items-center gap-2 bg-gray-800 text-white font-semibold px-4 py-2 rounded-full shadow-md text-sm md:text-base">
            <span>✅</span>
            {count !== null
              ? `${count} ${
                  count === 1 ? "inscrição" : "inscrições"
                } confirmada${count === 1 ? "" : "s"}`
              : "Carregando..."}
          </div>

          {/* Vagas restantes */}
          <div className="flex items-center gap-2 bg-gray-700 text-white font-semibold px-4 py-2 rounded-full shadow-md text-sm md:text-base">
            <span>⏳</span>
            Restam{" "}
            {totalVagas !== null
              ? totalVagas - (count || 0)
              : "Carregando..."}{" "}
            vagas
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            onClick={onOpenModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full shadow-2xl transform hover:-translate-y-1 transition-all animate-fadeInUp delay-200 cursor-pointer"
          >
            Inscreva-se no Grande Coral
          </button>
          {inscricoesAbertas && (
            <button
              onClick={onOpenVestibularModal}
              className="bg-gray-700 hover:bg-gray-900 text-white font-semibold px-8 py-4 rounded-full shadow-2xl transform hover:-translate-y-1 transition-all animate-fadeInUp delay-300 cursor-pointer"
            >
              Inscreva-se no Vestibular Bíblico
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
