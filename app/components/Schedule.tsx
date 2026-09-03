"use client";
import { FunctionComponent } from "react";
import { PageSection } from "./ui/PageSection";

const Schedule: FunctionComponent = () => {
  const program = [
    {
      day: "Primeiro Dia",
      date: "27.11",
      title: "Abertura",
      activity: "Processional de Abertura",
    },
    {
      day: "Segundo Dia",
      date: "28.11",
      title: "Noite Missionária",
      activity: "Processional de Missões",
    },
    {
      day: "Terceiro Dia",
      date: "29.11",
      title: "Encerramento",
      activity: "Jogral",
    },
  ];

  return (
    <PageSection id="schedule" tone="light" className="text-center">
      <span className="inline-block text-xs md:text-sm font-semibold tracking-widest text-primary-600 uppercase mb-3 animate-fadeInUp">
        Três dias
      </span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-800 mb-12 animate-fadeInUp">
        Programação do Congresso
      </h2>

      <div className="flex flex-col md:flex-row gap-6 justify-center animate-fadeInUp delay-100">
        {program.map((item) => (
          <div
            key={item.day}
            className="relative bg-white text-neutral-900 rounded-3xl shadow-card hover:shadow-elevated p-8 flex-1 border border-primary-100 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="font-semibold text-sm uppercase tracking-wider text-neutral-500 mb-2">
              {item.day}
            </div>
            <div className="font-display font-extrabold text-4xl md:text-5xl mb-3 text-primary-600">
              {item.date}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-1">
              {item.title}
            </h3>
            <p className="text-base md:text-lg text-neutral-600">
              {item.activity}
            </p>
          </div>
        ))}
      </div>
    </PageSection>
  );
};

export default Schedule;
