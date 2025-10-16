"use client"

import { useState, useRef, useEffect } from "react"
import { InputChapa } from "@/components/input-chapa"
import { TabelaPecas } from "@/components/tabela-pecas"
import { CanvasCorte, type CanvasCorteRef } from "@/components/canvas-corte"
import { Relatorio } from "@/components/relatorio"
import { calcularCorte } from "@/utils/corte"
import { exportarPDF } from "@/utils/export-pdf"
import type { Chapa, Peca, ResultadoCorte } from "@/types"

export default function Home() {
  const [chapa, setChapa] = useState<Chapa>({ largura: 2750, altura: 1830, espessuraCorte: 3 })
  const [pecas, setPecas] = useState<Peca[]>([])
  const [resultado, setResultado] = useState<ResultadoCorte | null>(null)
  const canvasRef = useRef<CanvasCorteRef>(null)

  useEffect(() => {
    if (resultado && pecas.length > 0) {
      const resultadoCorte = calcularCorte(chapa, pecas)
      setResultado(resultadoCorte)
    }
  }, [chapa]) // Updated to include all chapa properties

  const handleGerarPlano = () => {
    if (pecas.length === 0) {
      alert("Adicione pelo menos uma peça!")
      return
    }
    const resultadoCorte = calcularCorte(chapa, pecas)
    setResultado(resultadoCorte)
  }

  const handleExportPDF = () => {
    if (!resultado || !canvasRef.current) return

    const canvasRefs = canvasRef.current.getCanvasRefs()
    exportarPDF(chapa, pecas, resultado, canvasRefs)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          {/* <h1 className="text-4xl font-bold text-indigo-900 mb-2">CorteCerto Web</h1>
          <p className="text-lg text-indigo-700">Gerador de planos de corte simples e gratuito</p> */}
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Coluna Esquerda - Inputs */}
          <div className="space-y-6">
            <InputChapa chapa={chapa} setChapa={setChapa} />
            <TabelaPecas pecas={pecas} setPecas={setPecas} />

            <button
              onClick={handleGerarPlano}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
            >
              Gerar Plano de Corte
            </button>
          </div>

          {/* Coluna Direita - Resultado */}
          <div className="space-y-6">
            {resultado && (
              <>
                <CanvasCorte ref={canvasRef} chapa={chapa} resultado={resultado} />
                <Relatorio chapa={chapa} resultado={resultado} onExportPDF={handleExportPDF} />
              </>
            )}
            {!resultado && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                <p className="text-lg">Configure a chapa e as peças, depois clique em "Gerar Plano de Corte"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
