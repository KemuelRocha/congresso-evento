"use client";
import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

export function QRScanner({ onScan }: { onScan: (value: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    (async () => {
      try {
        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, err, controlsParam) => {
            if (result) {
              onScan(result.getText());
              controlsParam.stop(); // para o scanner após o primeiro resultado
            }
          }
        );
        controlsRef.current = controls;
      } catch (err) {
        console.error("Erro ao iniciar scanner:", err);
      }
    })();

    return () => {
      if (controlsRef.current) {
        try {
          controlsRef.current.stop();
        } catch {}
      }
    };
  }, [onScan]);

  return (
    <video
      ref={videoRef}
      className="w-72 h-72 border-2 border-green-500 rounded-lg shadow-lg"
    />
  );
}
