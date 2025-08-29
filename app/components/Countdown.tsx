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
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Contagem regressiva!
        </h2>

        <div className="inline-flex flex-wrap justify-center bg-[#353929] text-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {["Dias", "Horas", "Minutos", "Segundos"].map((label, i) => {
            const value = [
              timeLeft.days,
              timeLeft.hours,
              timeLeft.minutes,
              timeLeft.seconds,
            ][i];
            return (
              <div
                key={label}
                className="flex flex-col items-center px-6 py-4 sm:px-8 sm:py-6 border-gray-700
                       border-b sm:border-b-0 sm:border-r last:border-r-0"
              >
                <div className="text-4xl sm:text-5xl font-bold">{value}</div>
                <div className="uppercase text-sm">{label}</div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-gray-700 text-lg px-2 sm:px-0">
          Prepare o seu coração para um evento inesquecível!
        </p>
      </div>
    </section>
  );
};

export default Countdown;
