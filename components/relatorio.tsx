"use client"

import type { Chapa, ResultadoCorte } from "@/types"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface RelatorioProps {
  chapa: Chapa
  resultado: ResultadoCorte
  onExportPDF: () => void
}

export function Relatorio({ chapa, resultado, onExportPDF }: RelatorioProps) {
  const areaChapa = chapa.largura * chapa.altura

  const totalPecasColocadas = resultado.chapas.reduce((acc, ch) => acc + ch.pecasColocadas.length, 0)
  const areaTotal = resultado.chapas.reduce((acc, ch) => {
    const areaPecas = ch.pecasColocadas.reduce((sum, item) => sum + item.peca.largura * item.peca.altura, 0)
    return acc + areaPecas
  }, 0)

  const aproveitamentoMedio = (areaTotal / (areaChapa * resultado.chapas.length)) * 100
  const sobraMedio = 100 - aproveitamentoMedio
  const totalPecasNaoColocadas = resultado.pecasNaoColocadas.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Relatório</h2>
        <Button onClick={onExportPDF} variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Baixar PDF
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-gray-700 font-medium">Aproveitamento Médio:</span>
          <span className="text-green-700 font-bold text-lg">{aproveitamentoMedio.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-gray-700 font-medium">Sobra Média:</span>
          <span className="text-orange-700 font-bold text-lg">{sobraMedio.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700 font-medium">Peças cortadas:</span>
          <span className="text-blue-700 font-bold text-lg">{totalPecasColocadas}</span>
        </div>

        {totalPecasNaoColocadas > 0 && (
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-gray-700 font-medium">Peças não couberam:</span>
            <span className="text-red-700 font-bold text-lg">{totalPecasNaoColocadas}</span>
          </div>
        )}

        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
          <span className="text-gray-700 font-medium">Chapas usadas:</span>
          <span className="text-indigo-700 font-bold text-lg">{resultado.chapas.length}</span>
        </div>
      </div>
    </div>
  )
}
