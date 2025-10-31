import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export function useFindInscrito() {
  const [inscritos, setInscritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function buscar(valor: string) {
    setLoading(true);

    try {
      const inscricoesRef = collection(db, "inscricoes");

      let q = query(inscricoesRef, where("codigo", "==", valor));
      let snapshot = await getDocs(q);

      let resultados: any[] = [];

      if (!snapshot.empty) {
        resultados = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        snapshot = await getDocs(inscricoesRef);
        resultados = snapshot.docs
          .map((doc) => ({ id: doc.id, nome: doc.data().nome, ...doc.data() }))
          .filter((doc) =>
            doc.nome.toLowerCase().includes(valor.toLowerCase())
          );
      }
      setInscritos(resultados);
    } catch (err) {
      console.error(err);
      setInscritos([]);
    }

    setLoading(false);
  }

  function limpar() {
    setInscritos([]);
  }

  return { inscritos, buscar, loading, limpar };
}
