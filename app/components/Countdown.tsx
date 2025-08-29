"use client";
import { FunctionComponent, useEffect, useState } from "react";

interface CountdownProps {}

const Countdown: FunctionComponent<CountdownProps> = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  // Data do início do congresso
  const eventDate = new Date("2025-11-28T18:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    setMounted(true);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Contagem regressiva!
        </h2>

        <div className="inline-flex bg-[#353929] text-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="px-8 py-6 border-r border-gray-700">
            <div className="text-5xl font-bold">{timeLeft.days}</div>
            <div className="uppercase text-sm">Dias</div>
          </div>
          <div className="px-8 py-6 border-r border-gray-700">
            <div className="text-5xl font-bold">{timeLeft.hours}</div>
            <div className="uppercase text-sm">Horas</div>
          </div>
          <div className="px-8 py-6 border-r border-gray-700">
            <div className="text-5xl font-bold">{timeLeft.minutes}</div>
            <div className="uppercase text-sm">Minutos</div>
          </div>
          <div className="px-8 py-6">
            <div className="text-5xl font-bold">{timeLeft.seconds}</div>
            <div className="uppercase text-sm">Segundos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
