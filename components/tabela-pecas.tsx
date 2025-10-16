"use client"

import { useState } from "react"
import type { Peca } from "@/types"

interface TabelaPecasProps {
  pecas: Peca[]
  setPecas: (pecas: Peca[]) => void
}

export function TabelaPecas({ pecas, setPecas }: TabelaPecasProps) {
  const [novaPeca, setNovaPeca] = useState<Peca>({
    largura: 500,
    altura: 400,
    quantidade: 1,
  })

  const adicionarPeca = () => {
    if (novaPeca.largura <= 0 || novaPeca.altura <= 0 || novaPeca.quantidade <= 0) {
      alert("Todos os valores devem ser maiores que zero!")
      return
    }
    setPecas([...pecas, { ...novaPeca }])
  }

  const removerPeca = (index: number) => {
    setPecas(pecas.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📦 Peças a Cortar</h2>

      {/* Adicionar Nova Peça */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <input
          type="number"
          placeholder="Largura"
          value={novaPeca.largura}
          onChange={(e) => setNovaPeca({ ...novaPeca, largura: Number(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          min="1"
        />
        <input
          type="number"
          placeholder="Altura"
          value={novaPeca.altura}
          onChange={(e) => setNovaPeca({ ...novaPeca, altura: Number(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          min="1"
        />
        <input
          type="number"
          placeholder="Qtd"
          value={novaPeca.quantidade}
          onChange={(e) => setNovaPeca({ ...novaPeca, quantidade: Number(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          min="1"
        />
        <button
          onClick={adicionarPeca}
          className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Lista de Peças */}
      {pecas.length > 0 ? (
        <div className="space-y-2">
          {pecas.map((peca, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700">
                {peca.largura} × {peca.altura} mm — {peca.quantidade}x
              </span>
              <button
                onClick={() => removerPeca(index)}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">Nenhuma peça adicionada ainda</p>
      )}
    </div>
  )
}
