"use client";
import React, { useState, useMemo } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, Eye } from "lucide-react";

export function FaturamentoDashboard() {

  const [filters, setFilters] = useState({
    empresa: "",
    tipo: "",
    status: "",
    dataInicio: "",
    dataFim: "",
    valorMin: "",
    valorMax: "",
  });

  const data = [
    { id: "TRX-2024-007", ocorrencia: "11/11/2023", registro: "14/11/2023", empresa: "Super Terminais", tipo: "Saída/Pagamento", valor: "R$ 12.500,00", status: "Extraviada" },
    { id: "TRX-2024-006", ocorrencia: "09/11/2023", registro: "09/11/2023", empresa: "Super Terminais", tipo: "Saída/Pagamento", valor: "R$ 450,00", status: "Cancelada" },
    { id: "TRX-2024-003", ocorrencia: "04/11/2023", registro: "04/11/2023", empresa: "Aurora EADI", tipo: "Ajuste de Estoque", valor: "R$ 1.200,00", status: "Pendente" },
    { id: "TRX-2024-002", ocorrencia: "31/10/2023", registro: "31/10/2023", empresa: "Aurora EADI", tipo: "Entrada/Recebimento", valor: "R$ 250.000,00", status: "Confirmada" }
  ];

  const parseDate = (str: string) => {
    if (!str) return null;
    const [dia, mes, ano] = str.split("/").map(Number);
    return new Date(ano, mes - 1, dia);
  };

  const parseCurrency = (str: string) => {
    return Number(str.replace("R$ ", "").replace(".", "").replace(",", "."));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Empresa
      if (filters.empresa && !item.empresa.toLowerCase().includes(filters.empresa.toLowerCase()))
        return false;

      // Tipo
      if (filters.tipo && !item.tipo.toLowerCase().includes(filters.tipo.toLowerCase()))
        return false;

      // Status
      if (filters.status && item.status.toLowerCase() !== filters.status.toLowerCase())
        return false;

      // Datas
      const itemDate = parseDate(item.ocorrencia);
      const startDate = parseDate(filters.dataInicio);
      const endDate = parseDate(filters.dataFim);

      if (startDate && itemDate && itemDate < startDate) return false;
      if (endDate && itemDate && itemDate > endDate) return false;

      // Valores
      const valor = parseCurrency(item.valor);

      if (filters.valorMin && valor < Number(filters.valorMin)) return false;
      if (filters.valorMax && valor > Number(filters.valorMax)) return false;

      return true;
    });
  }, [filters, data]);

  const limparFiltros = () => {
    setFilters({
      empresa: "",
      tipo: "",
      status: "",
      dataInicio: "",
      dataFim: "",
      valorMin: "",
      valorMax: "",
    });
  };

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Relatório CutOff</h1>
        <p className="text-gray-500">Visualize e filtre registros contábeis.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <Search className="w-5 h-5" /> Filtros de Pesquisa
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Empresa */}
            <Input
              placeholder="Buscar empresa..."
              value={filters.empresa}
              onChange={(e) => setFilters({ ...filters, empresa: e.target.value })}
            />

            {/* Tipo */}
            <Select onValueChange={(val) => setFilters({ ...filters, tipo: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
                <SelectItem value="Ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select onValueChange={(val) => setFilters({ ...filters, status: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Confirmada">Confirmada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
                <SelectItem value="Extraviada">Extraviada</SelectItem>
              </SelectContent>
            </Select>

            {/* Data início */}
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Data Início (dd/mm/aaaa)"
                className="pl-8"
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              />
            </div>


            {/* Data fim */}
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Data Fim (dd/mm/aaaa)"
                className="pl-8"
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              />
            </div>

            {/* Valores */}
            <Input
              placeholder="Valor Mínimo"
              value={filters.valorMin}
              onChange={(e) => setFilters({ ...filters, valorMin: e.target.value })}
            />

            <Input
              placeholder="Valor Máximo"
              value={filters.valorMax}
              onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })}
            />

          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={limparFiltros}>Limpar Filtros</Button>
            <Button>Aplicar Filtros</Button>
          </div>

        </CardContent>
      </Card>

      {/* TABELA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-700 text-lg">Resultados</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Data Ocorrência</th>
                  <th className="p-3 text-left">Data Registro</th>
                  <th className="p-3 text-left">Empresa</th>
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Valor</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.ocorrencia}</td>
                    <td className="p-3">{item.registro}</td>
                    <td className="p-3">{item.empresa}</td>
                    <td className="p-3">{item.tipo}</td>
                    <td className="p-3 font-medium text-gray-700">{item.valor}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Eye className="w-4 h-4 cursor-pointer text-gray-600 hover:text-gray-800" />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>

      </Card>
    </div>
  );
}
