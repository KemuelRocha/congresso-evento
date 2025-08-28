import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // fechar ao clicar no fundo
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full relative max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // impedir fechamento ao clicar dentro
          >
            {/* Botão de Fechar */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={onClose}
            >
              ✕
            </button>

            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

            {/* Conteúdo scrollável */}
            <div className="overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
