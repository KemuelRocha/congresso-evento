"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { PageSection } from "./ui/PageSection";

const Countdown: FunctionComponent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  // Data do início do congresso
  const eventDate = new Date("2026-11-27T18:00:00");

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
    <PageSection tone="light" className="text-center">
      <span className="inline-block text-xs md:text-sm font-semibold tracking-widest text-primary-600 uppercase mb-3 animate-fadeIn">
        Falta pouco
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-10 text-primary-800 animate-fadeIn">
        Contagem regressiva!
      </h2>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 animate-fadeInUp">
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
              className="flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white border border-primary-100 shadow-elevated"
            >
              <div className="font-display text-3xl sm:text-5xl font-extrabold text-primary-700 tabular-nums">
                {String(value).padStart(2, "0")}
              </div>
              <div className="uppercase text-[10px] sm:text-xs text-neutral-500 tracking-wider mt-1">
                {label}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-primary-800 text-lg px-2 sm:px-0 animate-fadeIn delay-100">
        Prepare o seu coração para um evento inesquecível!
      </p>
    </PageSection>
  );
};

export default Countdown;
