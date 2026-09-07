"use client";

import { FunctionComponent } from "react";
import { useInscricoesStatus } from "../hooks/useInscricoesStatus";
import { Button } from "./ui/Button";

interface HeroProps {
  onOpenModal: () => void;
  onOpenVestibularModal: () => void;
  onOpenJogralModal: () => void;
}

const Hero: FunctionComponent<HeroProps> = ({
  onOpenModal,
  onOpenVestibularModal,
  onOpenJogralModal,
}) => {
  const { coralAtivo, vestibularAtivo, jogralAtivo } = useInscricoesStatus();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/congresso-2026-01.jpg')" }}
    >
      {/* Overlay em tom da marca, com vinheta radial para dar profundidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/75 to-primary-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(23,37,84,0.55)_100%)]" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center">
        <span className="animate-fadeInUp inline-flex items-center gap-2 rounded-full border border-accent-400/40 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs md:text-sm font-semibold tracking-widest text-accent-300 uppercase mb-6">
          27 a 29 de novembro · Petrolina-PE
        </span>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 animate-fadeInUp delay-100 tracking-tight">
          Congresso de <span className="text-primary-400">Jovens</span> 2026
        </h1>

        <p className="text-base md:text-lg lg:text-xl text-neutral-200 mb-8 max-w-3xl mx-auto animate-fadeInUp delay-200">
          Seja bem-vindo ao Site Oficial do{" "}
          <strong className="text-white">Congresso de Jovens 2026</strong>!
          Participe do{" "}
          <strong className="text-white">Grande Coral de Jovens</strong> e
          louve a Deus junto com jovens da nossa filial.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          {coralAtivo && (
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenModal}
              className="animate-fadeInUp delay-300"
            >
              Inscreva-se no Grande Coral
            </Button>
          )}
          {vestibularAtivo && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onOpenVestibularModal}
              className="animate-fadeInUp delay-300 !border-white/40 !text-white hover:!bg-white/10"
            >
              Inscreva-se no Vestibular Bíblico
            </Button>
          )}
          {jogralAtivo && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onOpenJogralModal}
              className="animate-fadeInUp delay-300 !border-white/40 !text-white hover:!bg-white/10"
            >
              Inscreva-se no Jogral
            </Button>
          )}
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fadeIn delay-300 hidden sm:flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs uppercase tracking-widest">Role para saber mais</span>
        <div className="h-9 w-5 rounded-full border border-white/40 flex items-start justify-center p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
