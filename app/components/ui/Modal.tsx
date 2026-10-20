"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
}) => {
  // Trava o scroll da página e fecha com Esc enquanto o modal está aberto
  useEffect(() => {
    if (!isOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary-950/60 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // fechar ao clicar no fundo
        >
          {/* No celular abre como "bottom sheet"; no desktop, centralizado */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex w-full max-w-lg flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white text-neutral-900 shadow-elevated"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()} // impedir fechamento ao clicar dentro
          >
            {/* Faixa da marca */}
            <div className="h-1.5 shrink-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-400" />

            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-6 pt-5 pb-4">
              <div>
                {title && (
                  <h2 className="font-display text-xl font-bold leading-tight text-secondary-900">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
                )}
              </div>

              {/* Botão de Fechar */}
              <button
                type="button"
                aria-label="Fechar"
                className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="overflow-y-auto overscroll-contain px-6 py-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
