"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useInscricoesStatus } from "../hooks/useInscricoesStatus";
import { Button } from "./ui/Button";

export default function Header({ onOpenModal }: { onOpenModal: () => void }) {
  const { coralAtivo } = useInscricoesStatus();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#hero" },
    { label: "Sobre", href: "#about" },
    { label: "Programação", href: "#schedule" },
    { label: "Local", href: "#location" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/75 backdrop-blur-md border-b border-neutral-900/5 shadow-sm transition-colors">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Wordmark do Evento */}
        <a
          href="#hero"
          className="flex items-baseline gap-1 font-display text-2xl md:text-3xl font-extrabold text-primary-700 hover:text-primary-600 transition-colors"
        >
          CJ<span className="text-accent-500">/</span>2026
        </a>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-primary-800 font-medium hover:text-primary-600 transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Botões Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (window.location.href = "/adm")}
          >
            Área Administrativa
          </Button>

          {coralAtivo && (
            <Button variant="primary" size="md" onClick={onOpenModal}>
              Inscreva-se
            </Button>
          )}
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-800 focus:outline-none"
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
                className="text-primary-800 font-medium hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Botão Área Administrativa */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                window.location.href = "/adm";
                setIsOpen(false);
              }}
            >
              Área Administrativa
            </Button>

            {/* Botão Inscreva-se */}
            {coralAtivo && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onOpenModal();
                  setIsOpen(false);
                }}
              >
                Inscreva-se
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
