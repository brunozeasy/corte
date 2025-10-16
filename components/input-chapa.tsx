"use client"

import type { Chapa } from "@/types"

interface InputChapaProps {
  chapa: Chapa
  setChapa: (chapa: Chapa) => void
}

export function InputChapa({ chapa, setChapa }: InputChapaProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📐 Dimensões da Chapa</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Largura (mm)</label>
          <input
            type="number"
            value={chapa.largura}
            onChange={(e) => setChapa({ ...chapa, largura: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Altura (mm)</label>
          <input
            type="number"
            value={chapa.altura}
            onChange={(e) => setChapa({ ...chapa, altura: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="1"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Espessura do Corte (mm)
            <span className="text-gray-500 text-xs ml-2">Largura da serra</span>
          </label>
          <input
            type="number"
            value={chapa.espessuraCorte}
            onChange={(e) => setChapa({ ...chapa, espessuraCorte: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  )
}
