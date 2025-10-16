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
    nome: "",
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
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Nome da peça (opcional)"
            value={novaPeca.nome || ""}
            onChange={(e) => setNovaPeca({ ...novaPeca, nome: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={novaPeca.quantidade}
            onChange={(e) => setNovaPeca({ ...novaPeca, quantidade: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            min="1"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Largura (mm)"
            value={novaPeca.largura}
            onChange={(e) => setNovaPeca({ ...novaPeca, largura: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            min="1"
          />
          <input
            type="number"
            placeholder="Altura (mm)"
            value={novaPeca.altura}
            onChange={(e) => setNovaPeca({ ...novaPeca, altura: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            min="1"
          />
          <button
            onClick={adicionarPeca}
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Lista de Peças */}
      {pecas.length > 0 ? (
        <div className="space-y-2">
          {pecas.map((peca, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm text-gray-700">
                  {peca.largura} × {peca.altura} mm — {peca.quantidade}x
                </span>
                {peca.nome && (
                  <span className="text-xs text-gray-500 font-medium">
                    {peca.nome}
                  </span>
                )}
              </div>
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
