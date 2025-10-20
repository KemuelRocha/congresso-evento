"use client";

import { useEffect, useMemo, useState } from "react";
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
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";

// Tipagem básica
interface Inscricao {
  id: string;
  codigo?: string;
  nome: string;
  sexo: string;
  idade: number;
  area: number;
  congregacao: string;
  lideranca: string;
  whatsapp: string;
  fardamentoCiente: boolean;
  cartaoMembro: string;
  createdAt?: any; // Timestamp do Firestore
}

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [totalVagas, setTotalVagas] = useState<number | null>(null);

  const [vestibular, setVestibular] = useState<any[]>([]);

  // filtros e paginação
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<number | "all">("all");
  const [congregFilter, setCongregFilter] = useState<string | "all">("all");
  const [sexoFilter, setSexoFilter] = useState<string | "all">("all");
  const [liderFilter, setLiderFilter] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // filtros vestibular
  const [searchVest, setSearchVest] = useState("");
  const [areaVest, setAreaVest] = useState<number | "all">("all");
  const [congregVest, setCongregVest] = useState<string | "all">("all");
  const [pageVest, setPageVest] = useState(1);
  const [pageSizeVest, setPageSizeVest] = useState(10);

  const router = useRouter();

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

  useEffect(() => {
    const fetchVestibular = async () => {
      const q = query(
        collection(db, "vestibular"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVestibular(data);
    };

    fetchVestibular();
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
  ).sort((a: any, b: any) => {
    const ordem = ["Menores de 18", "18-25", "26-35", "36+"];
    return ordem.indexOf(a.faixa) - ordem.indexOf(b.faixa);
  });

  const porLideranca = Object.values(
    inscricoes.reduce((acc: any, i) => {
      const tipo = i.lideranca === "jovem" ? "Jovens" : "Lideranças";
      acc[tipo] = acc[tipo] || { tipo, total: 0 };
      acc[tipo].total++;
      return acc;
    }, {})
  );

  // --- helpers para filtros ---
  const uniqueAreas = useMemo(() => {
    const setAreas = new Set<number>();
    inscricoes.forEach((i) => i.area && setAreas.add(i.area));
    return Array.from(setAreas).sort((a, b) => a - b);
  }, [inscricoes]);

  const congregacoesForArea = useMemo(() => {
    if (areaFilter === "all") {
      const setCong = new Set<string>();
      inscricoes.forEach((i) => i.congregacao && setCong.add(i.congregacao));
      return Array.from(setCong).sort();
    }
    const setCong = new Set<string>();
    inscricoes
      .filter((i) => i.area === areaFilter)
      .forEach((i) => i.congregacao && setCong.add(i.congregacao));
    return Array.from(setCong).sort();
  }, [inscricoes, areaFilter]);

  const congregacoesForAreaVest = useMemo(() => {
    if (areaVest === "all") {
      const setCong = new Set<string>();
      vestibular.forEach((i) => i.congregacao && setCong.add(i.congregacao));
      return Array.from(setCong).sort();
    }
    const setCong = new Set<string>();
    vestibular
      .filter((i) => i.area === areaVest)
      .forEach((i) => i.congregacao && setCong.add(i.congregacao));
    return Array.from(setCong).sort();
  }, [vestibular, areaVest]);

  // converte createdAt (Timestamp) para Date
  const toDate = (val: any): Date | null => {
    if (!val) return null;
    if (val?.toDate && typeof val.toDate === "function") return val.toDate();
    if (val instanceof Date) return val;
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // filtro principal
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return inscricoes.filter((i) => {
      // search: nome, codigo, cartao, whatsapp
      if (s) {
        const haystack = `${i.nome ?? ""} ${i.codigo ?? ""} ${
          i.cartaoMembro ?? ""
        } ${i.whatsapp ?? ""}`.toLowerCase();
        if (!haystack.includes(s)) return false;
      }

      if (areaFilter !== "all" && i.area !== areaFilter) return false;
      if (congregFilter !== "all" && i.congregacao !== congregFilter)
        return false;
      if (
        sexoFilter !== "all" &&
        (i.sexo ?? "").toLowerCase() !== sexoFilter.toLowerCase()
      )
        return false;
      if (
        liderFilter !== "all" &&
        (i.lideranca ?? "").toLowerCase() !== liderFilter.toLowerCase()
      )
        return false;

      return true;
    });
  }, [inscricoes, search, areaFilter, congregFilter, sexoFilter, liderFilter]);

  // --- paginação ---
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // --- export CSV (apenas filtrados) ---
  const exportFilteredCSV = () => {
    const header =
      "Codigo,Area,Congregacao,Nome,Sexo,Lideranca,Whatsapp,VESTIDO/GRAVATA,Pagamento 1,Pagamento 2\n";

    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const rows = filtered.map((i) => {
      const date = toDate(i.createdAt);
      const dateStr = date ? date.toISOString() : "";

      // ajuste os nomes dos campos abaixo se sua coleção usar outros nomes
      const vestidoGravata = (i as any).vestidoGravata ?? "";
      const pagamento1 = (i as any).pagamento1 ?? "";
      const pagamento2 = (i as any).pagamento2 ?? "";

      return [
        i.codigo ?? "",
        i.area ?? "",
        i.congregacao ?? "",
        i.nome ?? "",
        i.sexo ?? "",
        i.lideranca ?? "",
        i.whatsapp ?? "",
        vestidoGravata,
        pagamento1,
        pagamento2,
      ]
        .map(esc)
        .join(",");
    });

    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `inscricoes_filtradas_${new Date().toISOString()}.csv`);
  };

  const filteredVest = useMemo(() => {
    const s = searchVest.trim().toLowerCase();
    return vestibular.filter((v) => {
      if (s) {
        const haystack = `${v.nome ?? ""} ${v.codigo ?? ""} ${
          v.cartaoMembro ?? ""
        } ${v.whatsapp ?? ""}`.toLowerCase();
        if (!haystack.includes(s)) return false;
      }
      if (areaVest !== "all" && v.area !== areaVest) return false;
      if (congregVest !== "all" && v.congregacao !== congregVest) return false;
      return true;
    });
  }, [vestibular, searchVest, areaVest, congregVest]);

  const totalPagesVest = Math.max(
    1,
    Math.ceil(filteredVest.length / pageSizeVest)
  );
  useEffect(() => {
    if (pageVest > totalPagesVest) setPageVest(1);
  }, [totalPagesVest, pageVest]);

  const paginatedVest = useMemo(() => {
    const start = (pageVest - 1) * pageSizeVest;
    return filteredVest.slice(start, start + pageSizeVest);
  }, [filteredVest, pageVest, pageSizeVest]);

  const exportVestCSV = () => {
    const header = "Codigo,Nome,Idade,Cartao,WhatsApp,Area,Congregacao,Data\n";
    const rows = filteredVest.map((v) => {
      const date = v.createdAt?.toDate
        ? v.createdAt.toDate()
        : new Date(v.createdAt);
      return `"${v.codigo ?? ""}","${(v.nome ?? "").replace(/"/g, '""')}",${
        v.idade ?? ""
      },"${v.cartaoMembro ?? ""}",${v.whatsapp ?? ""},${v.area ?? ""},"${(
        v.congregacao ?? ""
      ).replace(/"/g, '""')}",${date.toISOString()}`;
    });
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `vestibular_filtrados_${new Date().toISOString()}.csv`);
  };

  // Contar inscrições por área
  const inscricoesPorArea = uniqueAreas.map((area) => ({
    area,
    total: vestibular.filter((v) => v.area === area).length,
  }));

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
      {/* Botão voltar */}
      <button
        onClick={() => router.push("/")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow cursor-pointer"
      >
        ← Voltar para a tela inicial
      </button>

      <h1 className="text-3xl font-bold mb-6 mt-4">
        📊 Dashboard de Inscrições
      </h1>

      <div className="flex flex-col md:flex-wrap md:flex-row md:items-center md:justify-start gap-4 mb-6">
        {/* Linha de busca e área/congregação */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="🔎 Buscar por nome / código / cartão / whatsapp..."
            className="px-4 py-2 border rounded-lg w-full sm:w-80"
          />

          <select
            value={areaFilter}
            onChange={(e) => {
              setAreaFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              );
              setCongregFilter("all");
              setPage(1);
            }}
            className="border rounded p-2 w-full sm:w-48"
          >
            <option value="all">Todas as Áreas</option>
            {uniqueAreas.map((a) => (
              <option key={a} value={a}>
                Área {a}
              </option>
            ))}
          </select>

          <select
            value={congregFilter}
            onChange={(e) => {
              setCongregFilter(e.target.value as any);
              setPage(1);
            }}
            className="border rounded p-2 w-full sm:w-48"
          >
            <option value="all">Todas as Congregações</option>
            {congregacoesForArea.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Linha de sexo e liderança */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <select
            value={sexoFilter}
            onChange={(e) => {
              setSexoFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded p-2 w-full sm:w-40"
          >
            <option value="all">Sexo: Todos</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>

          <select
            value={liderFilter}
            onChange={(e) => {
              setLiderFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded p-2 w-full sm:w-40"
          >
            <option value="all">Jovens / Lideranças</option>
            <option value="jovem">Jovens</option>
            <option value="lider">Lideranças</option>
          </select>
        </div>
      </div>

      {/* ações */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <button
            onClick={exportFilteredCSV}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            📥 Exportar filtrados
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Itens por página:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded p-2"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* tabela */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Cartão</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Sexo</th>
              <th className="px-4 py-3">Idade</th>
              <th className="px-4 py-3">Área</th>
              <th className="px-4 py-3">Congregação</th>
              <th className="px-4 py-3">Liderança</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Nenhuma inscrição encontrada.
                </td>
              </tr>
            ) : (
              paginated.map((i) => {
                const date = toDate(i.createdAt);
                return (
                  <tr key={i.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">{i.codigo ?? "-"}</td>
                    <td className="px-4 py-3">{i.nome}</td>
                    <td className="px-4 py-3">{i.cartaoMembro ?? "-"}</td>
                    <td className="px-4 py-3">{i.whatsapp ?? "-"}</td>
                    <td className="px-4 py-3">{i.sexo ?? "-"}</td>
                    <td className="px-4 py-3">{i.idade ?? "-"}</td>
                    <td className="px-4 py-3">{i.area ?? "-"}</td>
                    <td className="px-4 py-3">{i.congregacao ?? "-"}</td>
                    <td className="px-4 py-3">{i.lideranca ?? "-"}</td>
                    <td className="px-4 py-3">
                      {date ? date.toLocaleString() : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* paginação */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Mostrando {paginated.length} de {filtered.length} resultados
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
          >
            {"<"}
          </button>
          <span className="px-3 py-1 border rounded bg-white">
            Página {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* KPIs - Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
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
            <Legend />
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
            <Legend />
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
              <Legend />
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
              <Legend />
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
            <Legend />
            <Bar dataKey="total" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* === Seção Vestibular === */}
      <div className="bg-white p-6 rounded-2xl shadow mt-10">
        <h2 className="text-xl font-bold mb-6">📚 Vestibular</h2>

        {/* Cards resumo */}
        <div className="grid gap-6 mb-6 w-full">
          <div className="bg-gray-50 p-4 rounded-xl text-center shadow w-full">
            <h3 className="text-sm font-medium text-gray-600">
              Total inscritos
            </h3>
            <p className="text-2xl font-bold text-blue-500">
              {vestibular.length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-wrap md:flex-row md:items-center md:justify-start gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <input
              value={searchVest}
              onChange={(e) => {
                setSearchVest(e.target.value);
                setPageVest(1);
              }}
              placeholder="🔎 Buscar por nome / código / cartão / whatsapp..."
              className="px-4 py-2 border rounded-lg w-full sm:w-80"
            />
            <select
              value={areaVest}
              onChange={(e) => {
                setAreaVest(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                );
                setCongregVest("all");
                setPageVest(1);
              }}
              className="border rounded p-2 w-full sm:w-48"
            >
              <option value="all">Todas as Áreas</option>
              {uniqueAreas.map((a) => (
                <option key={a} value={a}>
                  Área {a}
                </option>
              ))}
            </select>
            <select
              value={congregVest}
              onChange={(e) => {
                setCongregVest(e.target.value);
                setPageVest(1);
              }}
              className="border rounded p-2 w-full sm:w-48"
            >
              <option value="all">Todas as Congregações</option>
              {congregacoesForAreaVest.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between w-full">
            <div>
              <button
                onClick={exportVestCSV}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow cursor-pointer"
              >
                📥 Exportar filtrados
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Itens por página:</label>
              <select
                value={pageSizeVest}
                onChange={(e) => {
                  setPageSizeVest(Number(e.target.value));
                  setPageVest(1);
                }}
                className="border rounded p-2"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Idade</th>
                <th className="px-4 py-3">Cartão de membro</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Área</th>
                <th className="px-4 py-3">Congregação</th>
                <th className="px-4 py-3">Comprovante</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVest.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Nenhuma inscrição do vestibular encontrada.
                  </td>
                </tr>
              ) : (
                paginatedVest.map((v) => {
                  const date = v.createdAt?.toDate
                    ? v.createdAt.toDate()
                    : new Date(v.createdAt);

                  const comprovanteUrl =
                    v.comprovante &&
                    v.comprovante.toLowerCase().endsWith(".pdf")
                      ? v.comprovante
                          .replace("/image/upload/", "/image/upload/pg_1/")
                          .replace(/\.pdf$/i, ".jpg")
                      : v.comprovante;
                  return (
                    <tr key={v.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3">{v.codigo ?? "-"}</td>
                      <td className="px-4 py-3">{v.nome ?? "-"}</td>
                      <td className="px-4 py-3">{v.idade ?? "-"}</td>
                      <td className="px-4 py-3">{v.cartaoMembro ?? "-"}</td>
                      <td className="px-4 py-3">{v.whatsapp ?? "-"}</td>
                      <td className="px-4 py-3">{v.area ?? "-"}</td>
                      <td className="px-4 py-3">{v.congregacao ?? "-"}</td>
                      <td className="px-4 py-3">
                        {comprovanteUrl ? (
                          <a
                            href={comprovanteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Ver Comprovante
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {date ? date.toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Mostrando {paginatedVest.length} de {filteredVest.length} resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageVest((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={pageVest === 1}
            >
              {"<"}
            </button>
            <span className="px-3 py-1 border rounded bg-white">
              Página {pageVest} / {totalPagesVest}
            </span>
            <button
              onClick={() =>
                setPageVest((p) => Math.min(totalPagesVest, p + 1))
              }
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={pageVest === totalPagesVest}
            >
              {">"}
            </button>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid w-full gap-6 mt-6">
          {/* Inscrições por Área */}
          <div className="bg-gray-50 p-4 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Inscrições por Área
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inscricoesPorArea}>
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
