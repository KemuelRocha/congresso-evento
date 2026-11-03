"use client";

import { useEffect, useMemo, useState } from "react";
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
  CartesianGrid,
} from "recharts";
import { saveAs } from "file-saver";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Inscricao } from "../../types/inscricao";
import { dataLocalISO, formatDataBR, parseDataISO } from "../../utils/datas";
import { montarRelatorioEnsaio } from "../../utils/relatorioEnsaio";
import { RelatorioWhatsApp } from "./RelatorioWhatsApp";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { SegmentedControl } from "../ui/SegmentedControl";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../ui/Table";

// Cores dos gráficos (espelham os tokens de app/globals.css)
const CORES = {
  presentes: "#2563eb", // primary-600
  ausentes: "#cbd5e1", // secondary-300
  selecionado: "#d97706", // accent-600
  grade: "#e5e5e5", // neutral-200
  eixo: "#525252", // neutral-600
};

const sexoColors: Record<string, string> = {
  Masculino: "#3b82f6",
  Feminino: "#ec4899",
};

const liderancaColors: Record<string, string> = {
  Jovens: "#2563eb",
  Lideranças: "#d97706",
};

const FAIXAS = ["Menores de 18", "18-25", "26-35", "36+"];

const faixaEtaria = (idade: number) =>
  idade < 18 ? "Menores de 18" : idade <= 25 ? "18-25" : idade <= 35 ? "26-35" : "36+";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const sexoLabel = (s: string) =>
  s === "M" ? "Masculino" : s === "F" ? "Feminino" : s || "-";

const liderancaLabel = (l: string) =>
  l === "jovem" ? "Jovem" : l === "lider" ? "Liderança" : l || "-";

const pct = (parte: number, total: number) => (total ? (parte / total) * 100 : 0);
const fmtPct = (v: number) => `${v.toFixed(1).replace(".", ",")}%`;

const toDate = (val: any): Date | null => {
  if (!val) return null;
  if (val?.toDate && typeof val.toDate === "function") return val.toDate();
  if (val instanceof Date) return val;
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? null : parsed;
};

// CSV com ";" e BOM para o Excel em pt-BR abrir em colunas e com acentos
const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const salvarCSV = (linhas: any[][], nome: string) => {
  const csv = linhas.map((l) => l.map(esc).join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, nome);
};

type Status = "presentes" | "ausentes" | "todos";
type SortKey = "nome" | "area" | "congregacao" | "idade" | "frequencia";

interface Registro extends Inscricao {
  presente: boolean;
  frequencia: number;
  primeiraVez: boolean;
}

interface Grupo {
  chave: string;
  presentes: number;
  ausentes: number;
  inscritos: number;
  taxa: number;
}

function agrupar(lista: Registro[], chave: (r: Registro) => string): Grupo[] {
  const map = new Map<string, Grupo>();
  lista.forEach((r) => {
    const k = chave(r);
    const g = map.get(k) ?? { chave: k, presentes: 0, ausentes: 0, inscritos: 0, taxa: 0 };
    g.inscritos++;
    if (r.presente) g.presentes++;
    else g.ausentes++;
    map.set(k, g);
  });
  return Array.from(map.values()).map((g) => ({ ...g, taxa: pct(g.presentes, g.inscritos) }));
}

function TooltipPresenca({ active, payload, label, prefixo = "" }: any) {
  if (!active || !payload?.length) return null;
  const d: Grupo = payload[0].payload;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-card">
      <p className="mb-1 font-semibold text-neutral-900">
        {prefixo}
        {label}
      </p>
      <p className="flex items-center gap-1.5 text-neutral-700">
        <span className="inline-block size-2.5 rounded-sm" style={{ background: CORES.presentes }} />
        Presentes: <b>{d.presentes}</b>
      </p>
      <p className="flex items-center gap-1.5 text-neutral-700">
        <span className="inline-block size-2.5 rounded-sm" style={{ background: CORES.ausentes }} />
        Ausentes: <b>{d.ausentes}</b>
      </p>
      <p className="mt-1 text-neutral-500">
        Taxa de presença: <b className="text-neutral-800">{fmtPct(d.taxa)}</b>
      </p>
    </div>
  );
}

function KpiCard({
  titulo,
  valor,
  detalhe,
  destaque = "text-neutral-900",
}: {
  titulo: string;
  valor: React.ReactNode;
  detalhe?: React.ReactNode;
  destaque?: string;
}) {
  return (
    <Card padding="sm" className="flex flex-col gap-1">
      <h3 className="text-sm font-medium text-neutral-600">{titulo}</h3>
      <p className={`font-display text-3xl font-bold ${destaque}`}>{valor}</p>
      {detalhe && <div className="text-xs text-neutral-500">{detalhe}</div>}
    </Card>
  );
}

function ChartCard({
  titulo,
  subtitulo,
  children,
  className = "",
}: {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`min-w-0 ${className}`}>
      <h2 className="text-lg font-bold text-secondary-900">{titulo}</h2>
      {subtitulo && <p className="mb-4 text-sm text-neutral-500">{subtitulo}</p>}
      {!subtitulo && <div className="mb-4" />}
      {children}
    </Card>
  );
}

const eixoProps = {
  tick: { fill: CORES.eixo, fontSize: 12 },
  axisLine: { stroke: CORES.grade },
  tickLine: false,
};

export function PresencasTab({ inscricoes }: { inscricoes: Inscricao[] }) {
  const [dataSel, setDataSel] = useState("");

  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<number | "all">("all");
  const [congregFilter, setCongregFilter] = useState<string>("all");
  const [sexoFilter, setSexoFilter] = useState("all");
  const [liderFilter, setLiderFilter] = useState("all");
  const [faixaFilter, setFaixaFilter] = useState("all");
  const [freqFilter, setFreqFilter] = useState("all");
  const [status, setStatus] = useState<Status>("presentes");

  const [sortKey, setSortKey] = useState<SortKey>("area");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [verTodasCongreg, setVerTodasCongreg] = useState(false);

  // --- datas com presença registrada (mais recente primeiro) ---
  const datas = useMemo(() => {
    const cont = new Map<string, number>();
    inscricoes.forEach((i) =>
      Object.entries(i.presencas ?? {}).forEach(([d, v]) => {
        if (v) cont.set(d, (cont.get(d) ?? 0) + 1);
      })
    );
    return Array.from(cont, ([data, total]) => ({ data, total })).sort((a, b) =>
      b.data.localeCompare(a.data)
    );
  }, [inscricoes]);

  const dataAtual = dataSel || datas[0]?.data || "";
  const idxAtual = datas.findIndex((d) => d.data === dataAtual);
  const dataAnterior = idxAtual >= 0 ? datas[idxAtual + 1]?.data : undefined;

  // frequência e primeira presença de cada inscrito (todas as datas)
  const historicoPorId = useMemo(() => {
    const map = new Map<string, { frequencia: number; primeira?: string }>();
    inscricoes.forEach((i) => {
      const ds = Object.keys(i.presencas ?? {})
        .filter((d) => i.presencas![d])
        .sort();
      map.set(i.id, { frequencia: ds.length, primeira: ds[0] });
    });
    return map;
  }, [inscricoes]);

  // --- helpers para filtros ---
  const uniqueAreas = useMemo(() => {
    const setAreas = new Set<number>();
    inscricoes.forEach((i) => i.area && setAreas.add(i.area));
    return Array.from(setAreas).sort((a, b) => a - b);
  }, [inscricoes]);

  const congregacoesForArea = useMemo(() => {
    const setCong = new Set<string>();
    inscricoes
      .filter((i) => areaFilter === "all" || i.area === areaFilter)
      .forEach((i) => i.congregacao && setCong.add(i.congregacao));
    return Array.from(setCong).sort();
  }, [inscricoes, areaFilter]);

  // recorte pelos filtros de perfil (independe da data escolhida)
  const recorteBase = useMemo(() => {
    const s = search.trim().toLowerCase();
    return inscricoes.filter((i) => {
      if (s) {
        const haystack = `${i.nome ?? ""} ${i.codigo ?? ""} ${
          i.cartaoMembro ?? ""
        } ${i.whatsapp ?? ""}`.toLowerCase();
        if (!haystack.includes(s)) return false;
      }
      if (areaFilter !== "all" && i.area !== areaFilter) return false;
      if (congregFilter !== "all" && i.congregacao !== congregFilter) return false;
      if (sexoFilter !== "all" && i.sexo !== sexoFilter) return false;
      if (liderFilter !== "all" && i.lideranca !== liderFilter) return false;
      if (faixaFilter !== "all" && faixaEtaria(Number(i.idade)) !== faixaFilter)
        return false;
      if (freqFilter !== "all") {
        const freq = historicoPorId.get(i.id)?.frequencia ?? 0;
        if (freqFilter === "0" ? freq !== 0 : freq < Number(freqFilter)) return false;
      }
      return true;
    });
  }, [
    inscricoes,
    historicoPorId,
    search,
    areaFilter,
    congregFilter,
    sexoFilter,
    liderFilter,
    faixaFilter,
    freqFilter,
  ]);

  // universo da data: presentes + quem já estava inscrito no dia do ensaio
  const registros: Registro[] = useMemo(
    () =>
      recorteBase.flatMap((i) => {
        const presente = !!i.presencas?.[dataAtual];
        const created = toDate(i.createdAt);
        if (!presente && created && dataLocalISO(created) > dataAtual) return [];
        const h = historicoPorId.get(i.id);
        return [
          {
            ...i,
            presente,
            frequencia: h?.frequencia ?? 0,
            primeiraVez: presente && h?.primeira === dataAtual,
          },
        ];
      }),
    [recorteBase, historicoPorId, dataAtual]
  );

  // --- KPIs ---
  const presentes = registros.filter((r) => r.presente);
  const totalPresentes = presentes.length;
  const totalAusentes = registros.length - totalPresentes;
  const taxa = pct(totalPresentes, registros.length);
  const primeiraVez = presentes.filter((r) => r.primeiraVez).length;
  const idades = presentes.map((r) => Number(r.idade)).filter((n) => n > 0);
  const idadeMedia = idades.length
    ? idades.reduce((a, b) => a + b, 0) / idades.length
    : null;
  const presentesAnterior = dataAnterior
    ? recorteBase.filter((i) => i.presencas?.[dataAnterior]).length
    : null;
  const variacao = presentesAnterior !== null ? totalPresentes - presentesAnterior : null;

  // --- gráficos ---
  const historico = useMemo(
    () =>
      [...datas].reverse().map(({ data }) => ({
        data,
        label: formatDataBR(data).slice(0, 5),
        presentes: recorteBase.filter((i) => i.presencas?.[data]).length,
      })),
    [datas, recorteBase]
  );

  const porArea = useMemo(
    () =>
      agrupar(registros, (r) => String(r.area ?? "-")).sort(
        (a, b) => Number(a.chave) - Number(b.chave)
      ),
    [registros]
  );

  const porCongregacao = useMemo(
    () =>
      agrupar(registros, (r) => r.congregacao || "-").sort(
        (a, b) => b.presentes - a.presentes || b.taxa - a.taxa
      ),
    [registros]
  );
  const congregVisiveis = verTodasCongreg ? porCongregacao : porCongregacao.slice(0, 15);

  const porFaixa = useMemo(
    () =>
      agrupar(registros, (r) => faixaEtaria(Number(r.idade))).sort(
        (a, b) => FAIXAS.indexOf(a.chave) - FAIXAS.indexOf(b.chave)
      ),
    [registros]
  );

  const porSexo = agrupar(presentes as Registro[], (r) => sexoLabel(r.sexo))
    .map((g) => ({ nome: g.chave, total: g.presentes }))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const porLideranca = agrupar(presentes as Registro[], (r) =>
    r.lideranca === "lider" ? "Lideranças" : "Jovens"
  )
    .map((g) => ({ nome: g.chave, total: g.presentes }))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const porFrequencia = useMemo(
    () =>
      Array.from({ length: datas.length + 1 }, (_, k) => ({
        ensaios: String(k),
        inscritos: registros.filter((r) => r.frequencia === k).length,
      })),
    [registros, datas.length]
  );

  // ranking: só congregações com pelo menos 3 inscritos, para não distorcer a taxa
  const rankingTaxa = porCongregacao
    .filter((g) => g.inscritos >= 3)
    .sort((a, b) => b.taxa - a.taxa || b.inscritos - a.inscritos);
  const melhores = rankingTaxa.slice(0, 5);
  const piores = rankingTaxa.length > 5 ? rankingTaxa.slice(-5).reverse() : [];

  // --- tabela ---
  const filtered = useMemo(() => {
    const lista = registros.filter((r) =>
      status === "todos" ? true : status === "presentes" ? r.presente : !r.presente
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return lista.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nome") cmp = (a.nome ?? "").localeCompare(b.nome ?? "");
      if (sortKey === "area") cmp = (a.area ?? 0) - (b.area ?? 0);
      if (sortKey === "congregacao")
        cmp = (a.congregacao ?? "").localeCompare(b.congregacao ?? "");
      if (sortKey === "idade") cmp = Number(a.idade) - Number(b.idade);
      if (sortKey === "frequencia") cmp = a.frequencia - b.frequencia;
      return cmp * dir || (a.nome ?? "").localeCompare(b.nome ?? "");
    });
  }, [registros, status, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [
    dataAtual,
    search,
    areaFilter,
    congregFilter,
    sexoFilter,
    liderFilter,
    faixaFilter,
    freqFilter,
    status,
    pageSize,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const ordenarPor = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "frequencia" ? "desc" : "asc");
    }
  };

  const limparFiltros = () => {
    setSearch("");
    setAreaFilter("all");
    setCongregFilter("all");
    setSexoFilter("all");
    setLiderFilter("all");
    setFaixaFilter("all");
    setFreqFilter("all");
  };

  const filtrosAtivos =
    search !== "" ||
    areaFilter !== "all" ||
    congregFilter !== "all" ||
    sexoFilter !== "all" ||
    liderFilter !== "all" ||
    faixaFilter !== "all" ||
    freqFilter !== "all";

  // --- exportações ---
  const exportarLista = () => {
    const header = [
      "Data do ensaio",
      "Status",
      "Codigo",
      "Nome",
      "Sexo",
      "Idade",
      "Area",
      "Congregacao",
      "Lideranca",
      "WhatsApp",
      "Cartao",
      "Ensaios frequentados",
      "Total de ensaios",
      "Primeira vez",
    ];
    const rows = filtered.map((r) => [
      formatDataBR(dataAtual),
      r.presente ? "Presente" : "Ausente",
      r.codigo ?? "",
      r.nome ?? "",
      sexoLabel(r.sexo),
      r.idade ?? "",
      r.area ?? "",
      r.congregacao ?? "",
      liderancaLabel(r.lideranca),
      r.whatsapp ?? "",
      r.cartaoMembro ?? "",
      r.frequencia,
      datas.length,
      r.primeiraVez ? "Sim" : "Não",
    ]);
    salvarCSV([header, ...rows], `presencas_${dataAtual}_${status}_${Date.now()}.csv`);
  };

  const exportarResumo = () => {
    const header = ["Area", "Congregacao", "Inscritos", "Presentes", "Ausentes", "Taxa (%)"];
    const areaDe = new Map(registros.map((r) => [r.congregacao, r.area]));
    const rows = [...porCongregacao]
      .sort(
        (a, b) =>
          (areaDe.get(a.chave) ?? 0) - (areaDe.get(b.chave) ?? 0) ||
          a.chave.localeCompare(b.chave)
      )
      .map((g) => [
        areaDe.get(g.chave) ?? "",
        g.chave,
        g.inscritos,
        g.presentes,
        g.ausentes,
        g.taxa.toFixed(1).replace(".", ","),
      ]);
    salvarCSV([header, ...rows], `presencas_resumo_${dataAtual}_${Date.now()}.csv`);
  };

  if (datas.length === 0) {
    return (
      <Card className="text-center">
        <CalendarCheck className="mx-auto mb-3 h-10 w-10 text-neutral-400" />
        <h2 className="text-lg font-bold text-secondary-900">
          Nenhuma presença registrada ainda
        </h2>
        <p className="text-sm text-neutral-500">
          As presenças marcadas na tela /presenca aparecem aqui, agrupadas por data de ensaio.
        </p>
      </Card>
    );
  }

  const mediaPorEnsaio = historico.length
    ? historico.reduce((a, h) => a + h.presentes, 0) / historico.length
    : null;

  const descricaoFiltro = [
    areaFilter !== "all" && `Área ${areaFilter}`,
    congregFilter !== "all" && congregFilter,
    sexoFilter !== "all" && sexoLabel(sexoFilter),
    liderFilter !== "all" && (liderFilter === "lider" ? "Lideranças" : "Jovens"),
    faixaFilter !== "all" && `${faixaFilter} anos`.replace("Menores de 18 anos", "Menores de 18"),
    freqFilter !== "all" &&
      (freqFilter === "0" ? "Nunca foram a um ensaio" : `Foram a ${freqFilter}+ ensaios`),
    search.trim() && `Busca: "${search.trim()}"`,
  ]
    .filter(Boolean)
    .join(" · ");

  const relatorio = montarRelatorioEnsaio({
    data: dataAtual,
    filtro: descricaoFiltro || undefined,
    presentes: totalPresentes,
    ausentes: totalAusentes,
    inscritos: registros.length,
    dataAnterior,
    presentesAnterior,
    primeiraVez,
    idadeMedia,
    porSexo,
    porLideranca,
    porArea,
    porCongregacao,
    melhores,
    piores,
    mediaPorEnsaio,
    totalEnsaios: historico.length,
    listarSemPresentes: areaFilter !== "all",
  });

  const SortHeader = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <TableHeaderCell>
      <button
        type="button"
        onClick={() => ordenarPor(k)}
        className="inline-flex cursor-pointer items-center gap-1 hover:text-secondary-900"
      >
        {children}
        {sortKey !== k ? (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
        ) : sortDir === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )}
      </button>
    </TableHeaderCell>
  );

  return (
    <div className="space-y-6">
      {/* Passo 1: escolha do ensaio */}
      <Card>
        <h2 className="text-lg font-bold text-secondary-900">Escolha o ensaio</h2>
        <p className="mb-4 text-sm text-neutral-500">
          {datas.length} {datas.length === 1 ? "data" : "datas"} com presença registrada
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {datas.map(({ data, total }) => {
            const ativo = data === dataAtual;
            return (
              <button
                key={data}
                type="button"
                onClick={() => setDataSel(data)}
                className={`cursor-pointer rounded-xl border p-3 text-left transition-colors ${
                  ativo
                    ? "border-primary-600 bg-primary-50 ring-2 ring-primary-600/20"
                    : "border-neutral-200 bg-white hover:border-neutral-400"
                }`}
              >
                <span className="block text-xs font-medium uppercase text-neutral-500">
                  {DIAS_SEMANA[parseDataISO(data).getDay()]}
                </span>
                <span
                  className={`block font-display text-lg font-bold ${
                    ativo ? "text-primary-700" : "text-neutral-900"
                  }`}
                >
                  {formatDataBR(data)}
                </span>
                <span className="block text-sm text-neutral-600">
                  {total} {total === 1 ? "presente" : "presentes"}
                </span>
              </button>
            );
          })}
        </div>

        {historico.length > 1 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-neutral-600">
              Presentes por ensaio{filtrosAtivos ? " (com os filtros aplicados)" : ""}. Clique em
              uma barra para selecionar a data.
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={historico}>
                <CartesianGrid vertical={false} stroke={CORES.grade} />
                <XAxis dataKey="label" {...eixoProps} />
                <YAxis allowDecimals={false} {...eixoProps} axisLine={false} width={36} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  labelFormatter={(_, p: any) => formatDataBR(p?.[0]?.payload?.data ?? "")}
                  formatter={(v: any) => [v, "Presentes"]}
                />
                <Bar
                  dataKey="presentes"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  className="cursor-pointer"
                  onClick={(_: any, index: number) => setDataSel(historico[index].data)}
                >
                  {historico.map((h) => (
                    <Cell
                      key={h.data}
                      fill={h.data === dataAtual ? CORES.selecionado : CORES.presentes}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Filtros */}
      <Card padding="sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Nome / código / cartão / WhatsApp..."
            className="lg:col-span-2"
          />
          <Select
            value={areaFilter}
            onChange={(e) => {
              setAreaFilter(e.target.value === "all" ? "all" : Number(e.target.value));
              setCongregFilter("all");
            }}
          >
            <option value="all">Todas as Áreas</option>
            {uniqueAreas.map((a) => (
              <option key={a} value={a}>
                Área {a}
              </option>
            ))}
          </Select>
          <Select value={congregFilter} onChange={(e) => setCongregFilter(e.target.value)}>
            <option value="all">Todas as Congregações</option>
            {congregacoesForArea.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={sexoFilter} onChange={(e) => setSexoFilter(e.target.value)}>
            <option value="all">Sexo: Todos</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </Select>
          <Select value={liderFilter} onChange={(e) => setLiderFilter(e.target.value)}>
            <option value="all">Jovens / Lideranças</option>
            <option value="jovem">Jovens</option>
            <option value="lider">Lideranças</option>
          </Select>
          <Select value={faixaFilter} onChange={(e) => setFaixaFilter(e.target.value)}>
            <option value="all">Todas as idades</option>
            {FAIXAS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
          <Select value={freqFilter} onChange={(e) => setFreqFilter(e.target.value)}>
            <option value="all">Qualquer frequência</option>
            <option value="0">Nunca foi a um ensaio</option>
            {datas.map((_, idx) => (
              <option key={idx} value={idx + 1}>
                {idx + 1 === datas.length
                  ? `Foi a todos (${datas.length})`
                  : `Foi a ${idx + 1}+ ensaios`}
              </option>
            ))}
          </Select>
        </div>
        {filtrosAtivos && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          </div>
        )}
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          titulo="Presentes"
          valor={totalPresentes}
          destaque="text-primary-600"
          detalhe={
            variacao !== null && dataAnterior ? (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  variacao > 0
                    ? "text-success"
                    : variacao < 0
                    ? "text-error"
                    : "text-neutral-500"
                }`}
              >
                {variacao > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : variacao < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5" />
                ) : null}
                {variacao > 0 ? "+" : ""}
                {variacao} vs {formatDataBR(dataAnterior).slice(0, 5)}
              </span>
            ) : (
              "Primeiro ensaio registrado"
            )
          }
        />
        <KpiCard
          titulo="Ausentes"
          valor={totalAusentes}
          destaque="text-error"
          detalhe="Inscritos até a data que não foram"
        />
        <KpiCard
          titulo="Taxa de presença"
          valor={fmtPct(taxa)}
          destaque="text-secondary-700"
          detalhe={`${totalPresentes} de ${registros.length} inscritos`}
        />
        <KpiCard
          titulo="Primeira vez"
          valor={primeiraVez}
          destaque="text-accent-600"
          detalhe="Primeiro ensaio frequentado"
        />
        <KpiCard
          titulo="Idade média (presentes)"
          valor={idadeMedia !== null ? idadeMedia.toFixed(1).replace(".", ",") : "-"}
          detalhe={
            idades.length ? `de ${Math.min(...idades)} a ${Math.max(...idades)} anos` : undefined
          }
        />
        <KpiCard
          titulo="Áreas presentes"
          valor={porArea.filter((g) => g.presentes > 0).length}
          detalhe={`de ${porArea.length} com inscritos`}
        />
        <KpiCard
          titulo="Congregações presentes"
          valor={porCongregacao.filter((g) => g.presentes > 0).length}
          detalhe={`de ${porCongregacao.length} com inscritos`}
        />
        <KpiCard
          titulo="Média por ensaio"
          valor={mediaPorEnsaio !== null ? mediaPorEnsaio.toFixed(1).replace(".", ",") : "-"}
          detalhe={`em ${historico.length} ${historico.length === 1 ? "ensaio" : "ensaios"}`}
        />
      </div>

      <RelatorioWhatsApp texto={relatorio} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard titulo="Presença por área" subtitulo="Presentes e ausentes entre os inscritos">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={porArea}>
              <CartesianGrid vertical={false} stroke={CORES.grade} />
              <XAxis dataKey="chave" {...eixoProps} tickFormatter={(a) => `Área ${a}`} />
              <YAxis allowDecimals={false} {...eixoProps} axisLine={false} width={36} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<TooltipPresenca prefixo="Área " />}
              />
              <Legend />
              <Bar dataKey="presentes" name="Presentes" stackId="a" fill={CORES.presentes} maxBarSize={48} />
              <Bar
                dataKey="ausentes"
                name="Ausentes"
                stackId="a"
                fill={CORES.ausentes}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Taxa de presença por área" subtitulo="% dos inscritos da área que compareceram">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={porArea}>
              <CartesianGrid vertical={false} stroke={CORES.grade} />
              <XAxis dataKey="chave" {...eixoProps} tickFormatter={(a) => `Área ${a}`} />
              <YAxis
                domain={[0, 100]}
                {...eixoProps}
                axisLine={false}
                width={44}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<TooltipPresenca prefixo="Área " />}
              />
              <Bar dataKey="taxa" fill={CORES.presentes} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          titulo="Presença por congregação"
          subtitulo={
            porCongregacao.length > 15 && !verTodasCongreg
              ? `15 com mais presentes, de ${porCongregacao.length}`
              : "Ordenadas por número de presentes"
          }
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={congregVisiveis.length * 30 + 60}>
            <BarChart data={congregVisiveis} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid horizontal={false} stroke={CORES.grade} />
              <XAxis type="number" allowDecimals={false} {...eixoProps} />
              <YAxis
                type="category"
                dataKey="chave"
                {...eixoProps}
                tick={{ fill: CORES.eixo, fontSize: 11 }}
                width={150}
                interval={0}
              />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} content={<TooltipPresenca />} />
              <Legend />
              <Bar dataKey="presentes" name="Presentes" stackId="a" fill={CORES.presentes} maxBarSize={20} />
              <Bar
                dataKey="ausentes"
                name="Ausentes"
                stackId="a"
                fill={CORES.ausentes}
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
          {porCongregacao.length > 15 && (
            <div className="mt-2 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => setVerTodasCongreg((v) => !v)}>
                {verTodasCongreg ? "Mostrar só as 15 primeiras" : "Ver todas as congregações"}
              </Button>
            </div>
          )}
        </ChartCard>

        <ChartCard titulo="Presentes por sexo">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={porSexo}
                dataKey="total"
                nameKey="nome"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
                label={({ value, percent }: any) =>
                  `${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {porSexo.map((s) => (
                  <Cell key={s.nome} fill={sexoColors[s.nome] ?? CORES.ausentes} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Presentes: jovens × lideranças">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={porLideranca}
                dataKey="total"
                nameKey="nome"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
                label={({ value, percent }: any) =>
                  `${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {porLideranca.map((l) => (
                  <Cell key={l.nome} fill={liderancaColors[l.nome] ?? CORES.ausentes} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Presença por faixa etária" subtitulo="Presentes e ausentes por idade">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porFaixa}>
              <CartesianGrid vertical={false} stroke={CORES.grade} />
              <XAxis dataKey="chave" {...eixoProps} />
              <YAxis allowDecimals={false} {...eixoProps} axisLine={false} width={36} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} content={<TooltipPresenca />} />
              <Legend />
              <Bar dataKey="presentes" name="Presentes" stackId="a" fill={CORES.presentes} maxBarSize={48} />
              <Bar
                dataKey="ausentes"
                name="Ausentes"
                stackId="a"
                fill={CORES.ausentes}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          titulo="Assiduidade dos inscritos"
          subtitulo={`Quantos inscritos foram a 0, 1, 2… dos ${datas.length} ensaios`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porFrequencia}>
              <CartesianGrid vertical={false} stroke={CORES.grade} />
              <XAxis dataKey="ensaios" {...eixoProps} />
              <YAxis allowDecimals={false} {...eixoProps} axisLine={false} width={36} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                labelFormatter={(l) => `Foram a ${l} ${l === "1" ? "ensaio" : "ensaios"}`}
                formatter={(v: any) => [v, "Inscritos"]}
              />
              <Bar dataKey="inscritos" fill={CORES.presentes} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          titulo="Ranking de congregações"
          subtitulo="Por taxa de presença (com 3 ou mais inscritos)"
          className="lg:col-span-2"
        >
          {rankingTaxa.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Nenhuma congregação com inscritos suficientes neste recorte.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { titulo: "Maior presença", lista: melhores },
                { titulo: "Menor presença", lista: piores },
              ]
                .filter((b) => b.lista.length > 0)
                .map((bloco) => (
                  <div key={bloco.titulo}>
                    <h3 className="mb-2 text-sm font-semibold text-neutral-700">{bloco.titulo}</h3>
                    <ul className="space-y-2">
                      {bloco.lista.map((g) => (
                        <li key={g.chave} className="text-sm">
                          <div className="mb-1 flex justify-between gap-2">
                            <span className="truncate text-neutral-800">{g.chave}</span>
                            <span className="shrink-0 text-neutral-600">
                              {g.presentes}/{g.inscritos} ·{" "}
                              <b className="text-neutral-900">{fmtPct(g.taxa)}</b>
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-neutral-100">
                            <div
                              className="h-2 rounded-full bg-primary-600"
                              style={{ width: `${g.taxa}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Lista */}
      <Card>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-secondary-900">
              Lista do ensaio de {formatDataBR(dataAtual)}
            </h2>
            <p className="text-sm text-neutral-500">
              Ausentes consideram só quem já estava inscrito na data do ensaio.
            </p>
          </div>
          <div className="w-full md:w-80">
            <SegmentedControl
              value={status}
              onChange={(v) => setStatus(v as Status)}
              options={[
                { value: "presentes", label: `Presentes (${totalPresentes})` },
                { value: "ausentes", label: `Ausentes (${totalAusentes})` },
                { value: "todos", label: "Todos" },
              ]}
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={exportarLista}>
              📥 Exportar lista
            </Button>
            <Button variant="secondary" size="sm" onClick={exportarResumo}>
              📊 Exportar resumo por congregação
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Itens por página:</label>
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-auto"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Código</TableHeaderCell>
              <SortHeader k="nome">Nome</SortHeader>
              <TableHeaderCell>Sexo</TableHeaderCell>
              <SortHeader k="idade">Idade</SortHeader>
              <SortHeader k="area">Área</SortHeader>
              <SortHeader k="congregacao">Congregação</SortHeader>
              <TableHeaderCell>Liderança</TableHeaderCell>
              <TableHeaderCell>WhatsApp</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <SortHeader k="frequencia">Frequência</SortHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-6 text-center text-neutral-500">
                  Ninguém encontrado com esses filtros.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{r.codigo ?? "-"}</TableCell>
                  <TableCell>
                    {r.nome}
                    {r.primeiraVez && (
                      <Badge tone="warning" className="ml-2">
                        1ª vez
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{r.sexo ?? "-"}</TableCell>
                  <TableCell>{r.idade ?? "-"}</TableCell>
                  <TableCell>{r.area ?? "-"}</TableCell>
                  <TableCell>{r.congregacao ?? "-"}</TableCell>
                  <TableCell>{liderancaLabel(r.lideranca)}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.whatsapp ?? "-"}</TableCell>
                  <TableCell>
                    <Badge tone={r.presente ? "success" : "error"}>
                      {r.presente ? "Presente" : "Ausente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.frequencia}/{datas.length}
                    <span className="ml-1 text-xs text-neutral-500">
                      ({fmtPct(pct(r.frequencia, datas.length))})
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-neutral-600">
            Mostrando {paginated.length} de {filtered.length} resultados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {"<"}
            </Button>
            <span className="rounded border bg-white px-3 py-1">
              Página {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              {">"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
