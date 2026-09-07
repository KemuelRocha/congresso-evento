"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Countdown from "./Countdown";
import About from "./About";
import Schedule from "./Schedule";
import Location from "./Location";
import Footer from "./Footer";
import RegisterModal from "./RegisterModal";
import RegisterVestibularModal from "./RegisterVestibularModal";
import RegisterJogralModal from "./RegisterJogralModal";

interface LandingPageProps {
  /** Abre um dos modais de inscrição automaticamente ao carregar a página. */
  autoOpen?: "coral" | "vestibular" | "jogral";
}

export default function LandingPage({ autoOpen }: LandingPageProps) {
  const [modalOpen, setModalOpen] = useState(autoOpen === "coral");
  const [vestibularModalOpen, setVestibularModalOpen] = useState(
    autoOpen === "vestibular"
  );
  const [jogralModalOpen, setJogralModalOpen] = useState(
    autoOpen === "jogral"
  );

  // Garante a abertura mesmo se o componente já estiver montado (ex: navegação client-side)
  useEffect(() => {
    if (autoOpen === "coral") setModalOpen(true);
    if (autoOpen === "vestibular") setVestibularModalOpen(true);
    if (autoOpen === "jogral") setJogralModalOpen(true);
  }, [autoOpen]);

  return (
    <div className="bg-neutral-50 text-neutral-900">
      <Header onOpenModal={() => setModalOpen(true)} />
      <Hero
        onOpenModal={() => setModalOpen(true)}
        onOpenVestibularModal={() => setVestibularModalOpen(true)}
        onOpenJogralModal={() => setJogralModalOpen(true)}
      />
      <Countdown />
      <About />
      <Schedule />
      <Location />
      <Footer />

      {/* Modal de Inscrição */}
      <RegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Modal de Inscrição no Vestibular Bíblico */}
      <RegisterVestibularModal
        isOpen={vestibularModalOpen}
        onClose={() => setVestibularModalOpen(false)}
      />

      {/* Modal de Inscrição no Jogral */}
      <RegisterJogralModal
        isOpen={jogralModalOpen}
        onClose={() => setJogralModalOpen(false)}
      />
    </div>
  );
}
