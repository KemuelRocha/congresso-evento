"use client";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Countdown from "./components/Countdown";
import About from "./components/About";
import Schedule from "./components/Schedule";
import Location from "./components/Location";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";
import { useState } from "react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-gray-50 text-gray-900">
      <Header onOpenModal={() => setModalOpen(true)} />
      <Hero onOpenModal={() => setModalOpen(true)} />
      <Countdown />
      <About />
      <Schedule />
      <Location />
      <Footer />

      {/* Modal de Inscrição */}
      <RegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
