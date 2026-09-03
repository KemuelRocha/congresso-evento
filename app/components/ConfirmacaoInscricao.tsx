"use client";

import { QRCodeSVG as QRCode } from "qrcode.react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

export function ConfirmacaoInscricao({
  codigo,
  onClose,
  isVestibular = false,
}: {
  codigo: string;
  onClose: () => void;
  isVestibular?: boolean;
}) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      // Gera a imagem em alta qualidade
      const dataUrl = await htmlToImage.toPng(pdfRef.current, {
        pixelRatio: 3,
      });

      // Cria PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 20, pdfWidth, pdfHeight);
      pdf.save(`Confirmacao-${codigo}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="✅ Inscrição Confirmada">
      <div
        ref={pdfRef}
        className="text-center space-y-5 p-4 bg-white rounded-lg"
      >
        <h2 className="font-display text-2xl font-bold text-primary-700">
          Inscrição Realizada!
        </h2>
        <p className="text-neutral-700">
          Obrigado por se inscrever, sua participação está garantida.
        </p>

        <div className="bg-neutral-100 p-4 rounded-lg shadow-sm">
          <p className="text-lg">Seu código de inscrição:</p>
          <p className="font-bold text-2xl text-primary-600 tracking-wider">
            {codigo}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-3 border rounded-lg shadow-card bg-white">
            <QRCode value={codigo} size={180} />
          </div>
        </div>

        <p className="text-sm text-neutral-500">
          Guarde este código ou apresente o QRCode{" "}
          {isVestibular
            ? "no dia da prova para confirmar sua inscrição."
            : "nos ensaios para confirmar sua presença."}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
          📄 Baixar PDF
        </Button>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
