"use client";
import { FunctionComponent } from "react";

const Footer: FunctionComponent = () => {
  return (
    <footer className="py-12 bg-gradient-to-t from-green-900 via-green-800 to-green-900 text-gray-200 relative overflow-hidden">
      {/* Overlay leve */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      <div className="container mx-auto text-center px-6 relative z-10">
        <p className="mb-3 text-lg md:text-xl animate-fadeInUp">
          &copy; {new Date().getFullYear()} Congresso Jovens 2025 - IEADPE
          Petrolina
        </p>
        <p className="text-sm md:text-base text-gray-300 animate-fadeInUp delay-100">
          Praça Pr. José Ferreira da Silva - Vila Moco, Petrolina - PE,
          56306-390
        </p>

        <div className="mt-6 flex justify-center space-x-6 animate-fadeInUp delay-200">
          {/* Ícones sociais (opcional) */}
          <a
            href="#"
            className="text-gray-200 hover:text-green-400 transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            className="text-gray-200 hover:text-green-400 transition-colors"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-gray-200 hover:text-green-400 transition-colors"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
