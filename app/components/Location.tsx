"use client";
import { FunctionComponent } from "react";

const Location: FunctionComponent = () => {
  return (
    <section
      id="location"
      className="py-20 bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden"
    >
      {/* Overlay leve para contraste */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-green-400 drop-shadow-lg mb-6 animate-fadeInUp">
          Local do Evento
        </h2>
        <p className="text-gray-200 mb-12 text-lg md:text-xl max-w-3xl mx-auto animate-fadeInUp delay-100">
          Assembleia de Deus – IEADPE Petrolina (Templo Matriz)
          <br />
          Praça Pr. José Ferreira da Silva - Vila Moco, Petrolina - PE,
          56306-390
        </p>

        <div className="w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-green-500 animate-fadeInUp delay-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31492.507946088783!2d-40.53934379224601!3d-9.371838905030424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x773706363fc17c3%3A0xfed0394adc5793!2sIEADPE%20PETROLINA%20(Templo%20Matriz)!5e0!3m2!1spt-BR!2sbr!4v1756269277582!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Location;
