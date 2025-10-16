export interface Chapa {
  largura: number
  altura: number
  espessuraCorte: number
}

export interface Peca {
  largura: number
  altura: number
  quantidade: number
  nome?: string
}

export interface PecaColocada {
  peca: Peca
  x: number
  y: number
}

export interface EspacoLivre {
  x: number
  y: number
  largura: number
  altura: number
}

export interface ChapaComPecas {
  pecasColocadas: PecaColocada[]
  espacosLivres: EspacoLivre[]
}

export interface ResultadoCorte {
  chapas: ChapaComPecas[]
  pecasNaoColocadas: Peca[]
}
