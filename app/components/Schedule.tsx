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
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Programação do Congresso
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {program.map((item) => (
            <div
              key={item.day}
              className="bg-white rounded-2xl shadow-lg p-6 flex-1 hover:scale-105 transition-transform"
            >
              <div className="text-[#353929] font-bold text-xl mb-2">
                {item.day}
              </div>
              <div className="text-gray-700 mb-2 text-xl font-bold">
                {item.date}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.activity}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
