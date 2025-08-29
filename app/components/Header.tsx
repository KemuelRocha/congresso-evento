// components/Header.tsx
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header({ onOpenModal }: { onOpenModal: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#hero" },
    { label: "Sobre", href: "#about" },
    { label: "Programação", href: "#schedule" },
    { label: "Local", href: "#location" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Nome do Evento */}
        <a href="#hero" className="text-xl font-bold text-[#353929]">
          Congresso Jovens 2025
        </a>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[#353929] hover:text-[#716353] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Botão de Inscrição */}
        <button
          onClick={onOpenModal}
          className="hidden md:inline-block bg-[#716353] text-white px-5 py-2 rounded-2xl shadow hover:bg-[#353929] transition cursor-pointer"
        >
          Inscreva-se
        </button>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#353929] focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-inner">
          <nav className="flex flex-col items-center py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#353929] hover:text-[#716353] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                onOpenModal();
                setIsOpen(false);
              }}
              className="bg-[#716353] text-white px-5 py-2 rounded-2xl shadow hover:bg-[#353929] transition cursor-pointer"
            >
              Inscreva-se
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
