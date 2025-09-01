"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";

// Tipagem básica
interface Inscricao {
  id: string;
  nome: string;
  sexo: string;
  idade: number;
  area: number;
  congregacao: string;
  lideranca: string;
  whatsapp: string;
  fardamentoCiente: boolean;
  cartaoMembro: string;
}

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [totalVagas, setTotalVagas] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotal = async () => {
      const ref = doc(db, "vagas", "total");
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setTotalVagas(data.valor);
      }
    };

    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "inscricoes"),
        orderBy("area"),
        orderBy("nome")
      );
      const snapshot = await getDocs(q);
      const data: Inscricao[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Inscricao[];
      setInscricoes(data);
    };

    fetchData();
  }, []);

  // --- Agrupamentos ---
  const porArea = Object.values(
    inscricoes.reduce((acc: any, i) => {
      acc[i.area] = acc[i.area] || { area: i.area, total: 0 };
      acc[i.area].total++;
      return acc;
    }, {})
  );

  const porCongregacao = Object.values(
    inscricoes.reduce((acc: any, i) => {
      acc[i.congregacao] = acc[i.congregacao] || {
        congregacao: i.congregacao,
        total: 0,
      };
      acc[i.congregacao].total++;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b.total - a.total);

  const porSexo = Object.values(
    inscricoes.reduce((acc: any, i) => {
      acc[i.sexo] = acc[i.sexo] || { sexo: i.sexo, total: 0 };
      acc[i.sexo].total++;
      return acc;
    }, {})
  );

  const sexoColors: Record<string, string> = {
    M: "#3b82f6", // azul para masculino
    F: "#ec4899", // rosa para feminino
  };

  const porIdade = Object.values(
    inscricoes.reduce((acc: any, i) => {
      const faixa =
        i.idade < 18
          ? "Menores de 18"
          : i.idade <= 25
          ? "18-25"
          : i.idade <= 35
          ? "26-35"
          : "36+";
      acc[faixa] = acc[faixa] || { faixa, total: 0 };
      acc[faixa].total++;
      return acc;
    }, {})
  );

  const porLideranca = Object.values(
    inscricoes.reduce((acc: any, i) => {
      const tipo = i.lideranca === "jovem" ? "Jovens" : "Lideranças";
      acc[tipo] = acc[tipo] || { tipo, total: 0 };
      acc[tipo].total++;
      return acc;
    }, {})
  );

  // --- Exportar CSV ---
  const exportCSV = () => {
    let csv = "Area,Nome,Sexo,Idade,Congregacao,Lideranca,Whatsapp\n";
    inscricoes.forEach((i) => {
      csv += `${i.area},"${i.nome}",${i.sexo},${i.idade},${i.congregacao},${i.lideranca},${i.whatsapp}\n`;
    });

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "inscricoes.csv");
  };

  const handleLogin = () => {
    if (
      user === process.env.NEXT_PUBLIC_ADMIN_USER &&
      pass === process.env.NEXT_PUBLIC_ADMIN_PASS
    ) {
      setLoggedIn(true);
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">Login Administrativo</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border rounded p-2 mb-2"
        />
        <input
          type="password"
          placeholder="Senha"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="border rounded p-2 mb-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard de Inscrições</h1>

      {/* Botão de Exportar */}
      <button
        onClick={exportCSV}
        className="mb-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg cursor-pointer"
      >
        Exportar Lista
      </button>

      {/* KPIs - Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Vagas */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            Total de Vagas
          </h3>
          <p className="text-3xl font-bold text-green-500">{totalVagas}</p>
        </div>

        {/* Total de Inscrições */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Inscrições</h3>
          <p className="text-3xl font-bold text-blue-500">
            {inscricoes.length}
          </p>
        </div>

        {/* Vagas Restantes */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            Vagas Restantes
          </h3>
          <p className="text-3xl font-bold text-yellow-500">
            {totalVagas !== null
              ? totalVagas - inscricoes.length
              : "Carregando..."}
          </p>
        </div>

        {/* Ocupação (%) */}
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">% de Ocupação</h3>
          <p className="text-3xl font-bold text-purple-500">
            {totalVagas !== null
              ? ((inscricoes.length / totalVagas) * 100).toFixed(1) + "%"
              : "Carregando..."}
          </p>
        </div>
      </div>

      {/* Gráfico por Área */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Inscritos por Área</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={porArea}>
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por Congregação */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Inscritos por Congregação</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={porCongregacao}>
            <XAxis dataKey="congregacao" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos Sexo + Liderança lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gráfico por Sexo */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Inscritos por Sexo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={porSexo}
                dataKey="total"
                nameKey="sexo"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {porSexo.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={sexoColors[entry.sexo] || "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Jovens vs Lideranças */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Jovens x Lideranças</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={porLideranca}
                dataKey="total"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {porLideranca.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#22c55e" : "#9333ea"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico por Idade */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Inscritos por Faixa Etária</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={porIdade}>
            <XAxis dataKey="faixa" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
