"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export function useInscricoesCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const counterRef = doc(db, "counters", "inscricoes");

    const unsubscribe = onSnapshot(counterRef, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().lastCodigo);
      } else {
        setCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return count;
}
