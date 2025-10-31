import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export function useFindInscrito() {
  const [inscritos, setInscritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function buscar(valor: string) {
    if (!valor || valor.trim() === "") {
      limpar();
      return;
    }

    setLoading(true);
    try {
      const inscricoesRef = collection(db, "inscricoes");

      const qCodigo = query(inscricoesRef, where("codigo", "==", valor));

      const qNome = query(
        inscricoesRef,
        where("nome", ">=", valor),
        where("nome", "<=", valor + "\uf8ff")
      );

      const [snapshotCodigo, snapshotNome] = await Promise.all([
        getDocs(qCodigo),
        getDocs(qNome),
      ]);

      const resultadosMap = new Map<string, any>();

      snapshotCodigo.docs.forEach((doc) => {
        resultadosMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      snapshotNome.docs.forEach((doc) => {
        resultadosMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      const resultados = Array.from(resultadosMap.values());

      setInscritos(resultados);
    } catch (err) {
      console.error("Erro ao buscar inscritos:", err);
      setInscritos([]);
    }

    setLoading(false);
  }

  function limpar() {
    setInscritos([]);
  }

  return { inscritos, buscar, loading, limpar };
}
