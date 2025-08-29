"use client";
import { FunctionComponent } from "react";

interface ScheduleProps {}

const Schedule: FunctionComponent<ScheduleProps> = () => {
  const program = [
    {
      day: "Primeiro Dia",
      date: "28.11",
      title: "Abertura",
      activity: "Processional de Abertura",
    },
    {
      day: "Segundo Dia",
      date: "29.11",
      title: "Noite Missionária",
      activity: "Processional de Missões",
    },
    {
      day: "Terceiro Dia",
      date: "30.11",
      title: "Encerramento",
      activity: "Jogral",
    },
  ];

  return (
    <section
      id="schedule"
      className="py-20 bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden"
    >
      {/* Overlay suave */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-green-400 drop-shadow-lg mb-12 animate-fadeInUp">
          Programação do Congresso
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center animate-fadeInUp delay-100">
          {program.map((item, index) => (
            <div
              key={item.day}
              className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-3xl shadow-2xl p-6 flex-1 transform hover:scale-105 transition-all duration-500 cursor-pointer"
            >
              <div className="font-bold text-xl md:text-2xl mb-2">
                {item.day}
              </div>
              <div className="font-extrabold text-2xl md:text-3xl mb-2">
                {item.date}
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-lg md:text-xl">{item.activity}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
