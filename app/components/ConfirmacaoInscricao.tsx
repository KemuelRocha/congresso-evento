"use client";

import { QRCodeSVG as QRCode } from "qrcode.react";
import { Modal } from "./ui/Modal";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

export function ConfirmacaoInscricao({
  codigo,
  onClose,
}: {
  codigo: string;
  onClose: () => void;
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
        <h2 className="text-2xl font-bold text-blue-700">
          Inscrição Realizada!
        </h2>
        <p className="text-gray-700">
          Obrigado por se inscrever, sua participação está garantida.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p className="text-lg">Seu código de inscrição:</p>
          <p className="font-bold text-2xl text-blue-600 tracking-wider">
            {codigo}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-3 border rounded-lg shadow-md bg-white">
            <QRCode value={codigo} size={180} />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Guarde este código ou apresente o QRCode nos ensaios para confirmar
          presença.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition cursor-pointer flex items-center justify-center gap-2"
        >
          📄 Baixar PDF
        </button>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition cursor-pointer"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
