"use client"

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Chapa, ResultadoCorte } from "@/types"

interface CanvasCorteProps {
  chapa: Chapa
  resultado: ResultadoCorte
}

export interface CanvasCorteRef {
  getCanvasRefs: () => HTMLCanvasElement[]
}

const CORES = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#E91E63",
  "#9C27B0",
  "#00BCD4",
  "#CDDC39",
  "#FF5722",
  "#795548",
  "#607D8B",
]

export const CanvasCorte = forwardRef<CanvasCorteRef, CanvasCorteProps>(({ chapa, resultado }, ref) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const [chapaAtual, setChapaAtual] = useState(0)

  const totalChapas = resultado.chapas.length

  useImperativeHandle(ref, () => ({
    getCanvasRefs: () => canvasRefs.current.filter((c): c is HTMLCanvasElement => c !== null),
  }))

  useEffect(() => {
    canvasRefs.current.forEach((canvas, index) => {
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const maxWidth = 600
      const escala = maxWidth / chapa.largura
      canvas.width = maxWidth
      canvas.height = chapa.altura * escala

      ctx.fillStyle = "#f5f5f5"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      const kerfEscalado = chapa.espessuraCorte * escala

      resultado.chapas[index]?.pecasColocadas.forEach((item, pieceIndex) => {
        const x = item.x * escala
        const y = item.y * escala
        const w = item.peca.largura * escala
        const h = item.peca.altura * escala

        ctx.fillStyle = CORES[pieceIndex % CORES.length]
        ctx.fillRect(x, y, w, h)

        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, w, h)

        if (chapa.espessuraCorte > 0 && kerfEscalado > 0.5) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
          ctx.fillRect(x + w, y, kerfEscalado, h)
          ctx.fillRect(x, y + h, w + kerfEscalado, kerfEscalado)
        }

        ctx.fillStyle = "#fff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        
        // Mostrar nome se disponível, senão mostrar dimensões
        const texto = item.peca.nome || `${item.peca.largura}×${item.peca.altura}`
        ctx.fillText(texto, x + w / 2, y + h / 2)
        
        // Se tem nome, mostrar também as dimensões abaixo
        if (item.peca.nome) {
          ctx.font = "10px sans-serif"
          ctx.fillText(`${item.peca.largura}×${item.peca.altura}`, x + w / 2, y + h / 2 + 15)
        }
      })
    })
  }, [chapa, resultado])

  const irParaAnterior = () => {
    setChapaAtual((prev) => Math.max(0, prev - 1))
  }

  const irParaProxima = () => {
    setChapaAtual((prev) => Math.min(totalChapas - 1, prev + 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Visualização do Corte</h2>
        {totalChapas > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={irParaAnterior} disabled={chapaAtual === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
              Chapa {chapaAtual + 1} de {totalChapas}
            </span>
            <Button variant="outline" size="icon" onClick={irParaProxima} disabled={chapaAtual === totalChapas - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {chapa.espessuraCorte > 0 && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="inline-block w-3 h-3 bg-red-300 mr-2"></span>
          Área vermelha = espessura do corte ({chapa.espessuraCorte}mm)
        </p>
      )}
      <div className="flex justify-center">
        {resultado.chapas.map((_, index) => (
          <canvas
            key={index}
            ref={(el) => (canvasRefs.current[index] = el)}
            className={`border border-gray-300 rounded-lg max-w-full ${index === chapaAtual ? "" : "hidden"}`}
          />
        ))}
      </div>
    </div>
  )
})

CanvasCorte.displayName = "CanvasCorte"
