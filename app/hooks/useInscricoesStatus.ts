"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export function useInscricoesStatus() {
  const [status, setStatus] = useState({
    coralAtivo: false,
    vestibularAtivo: false,
    jogralAtivo: false,
    loading: true,
  });

  useEffect(() => {
    const coralRef = doc(db, "abertas", "coral");
    const vestibularRef = doc(db, "abertas", "vestibular");
    const jogralRef = doc(db, "abertas", "jogral");

    const unsubCoral = onSnapshot(coralRef, (docSnap) => {
      setStatus((prev) => ({
        ...prev,
        coralAtivo: docSnap.exists() ? docSnap.data().ativo : false,
      }));
    });

    const unsubVestibular = onSnapshot(vestibularRef, (docSnap) => {
      setStatus((prev) => ({
        ...prev,
        vestibularAtivo: docSnap.exists() ? docSnap.data().ativo : false,
      }));
    });

    const unsubJogral = onSnapshot(jogralRef, (docSnap) => {
      setStatus((prev) => ({
        ...prev,
        jogralAtivo: docSnap.exists() ? docSnap.data().ativo : false,
        loading: false,
      }));
    });

    return () => {
      unsubCoral();
      unsubVestibular();
      unsubJogral();
    };
  }, []);

  return status;
}
