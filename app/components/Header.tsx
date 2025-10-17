"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useInscricoesStatus } from "../hooks/useInscricoesStatus";

export default function Header({ onOpenModal }: { onOpenModal: () => void }) {
  const { coralAtivo, loading } = useInscricoesStatus();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#hero" },
    { label: "Sobre", href: "#about" },
    { label: "Programação", href: "#schedule" },
    { label: "Local", href: "#location" },
  ];

  if (loading) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md transition-colors">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Nome do Evento */}
        <a
          href="#hero"
          className="text-2xl md:text-3xl font-extrabold text-green-700 hover:text-green-600 transition-colors"
        >
          CJ/2025
        </a>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-green-800 font-medium hover:text-green-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Botões Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => (window.location.href = "/adm")}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-full shadow-lg cursor-pointer"
          >
            Área Administrativa
          </button>

          {coralAtivo && (
            <button
              onClick={onOpenModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer"
            >
              Inscreva-se
            </button>
          )}
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-green-800 focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg animate-slideDown">
          <nav className="flex flex-col items-center py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-green-800 font-medium hover:text-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Botão Área Administrativa */}
            <button
              onClick={() => {
                window.location.href = "/adm";
                setIsOpen(false);
              }}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-full shadow-lg cursor-pointer"
            >
              Área Administrativa
            </button>

            {/* Botão Inscreva-se */}
            <button
              onClick={() => {
                onOpenModal();
                setIsOpen(false);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer"
            >
              Inscreva-se
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
