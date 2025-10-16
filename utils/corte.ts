import type { Chapa, Peca, ResultadoCorte, PecaColocada, ChapaComPecas } from "@/types"

export function calcularCorte(chapa: Chapa, pecas: Peca[]): ResultadoCorte {
  const kerf = chapa.espessuraCorte

  // Expandir peças pela quantidade
  const pecasExpandidas: Peca[] = []
  pecas.forEach((peca) => {
    for (let i = 0; i < peca.quantidade; i++) {
      pecasExpandidas.push({ ...peca, quantidade: 1 })
    }
  })

  // Ordenar peças por área (maior primeiro) para melhor aproveitamento
  const pecasOrdenadas = [...pecasExpandidas].sort((a, b) => b.largura * b.altura - a.largura * a.altura)

  const chapas: ChapaComPecas[] = []
  let pecasRestantes = [...pecasOrdenadas]

  while (pecasRestantes.length > 0) {
    const chapaAtual: ChapaComPecas = {
      pecasColocadas: [],
      espacosLivres: [{ x: 0, y: 0, largura: chapa.largura, altura: chapa.altura }],
    }

    const pecasNaoColocadasNestaChapa: Peca[] = []

    // Tentar colocar cada peça restante na chapa atual
    for (const peca of pecasRestantes) {
      let colocada = false

      // Tentar colocar a peça em algum espaço livre
      for (let i = 0; i < chapaAtual.espacosLivres.length; i++) {
        const espaco = chapaAtual.espacosLivres[i]

        // Verificar se a peça cabe no espaço
        if (peca.largura <= espaco.largura && peca.altura <= espaco.altura) {
          // Colocar a peça
          const pecaColocada: PecaColocada = {
            peca,
            x: espaco.x,
            y: espaco.y,
          }
          chapaAtual.pecasColocadas.push(pecaColocada)

          // Remover o espaço usado
          chapaAtual.espacosLivres.splice(i, 1)

          // Espaço à direita (com kerf)
          if (espaco.largura > peca.largura + kerf) {
            chapaAtual.espacosLivres.push({
              x: espaco.x + peca.largura + kerf,
              y: espaco.y,
              largura: espaco.largura - peca.largura - kerf,
              altura: peca.altura,
            })
          }

          // Espaço abaixo (com kerf)
          if (espaco.altura > peca.altura + kerf) {
            chapaAtual.espacosLivres.push({
              x: espaco.x,
              y: espaco.y + peca.altura + kerf,
              largura: espaco.largura,
              altura: espaco.altura - peca.altura - kerf,
            })
          }

          colocada = true
          break
        }
      }

      // Se não coube nesta chapa, tentar na próxima
      if (!colocada) {
        pecasNaoColocadasNestaChapa.push(peca)
      }
    }

    // Adicionar a chapa atual à lista
    chapas.push(chapaAtual)

    // Atualizar peças restantes
    pecasRestantes = pecasNaoColocadasNestaChapa

    if (chapaAtual.pecasColocadas.length === 0 && pecasRestantes.length > 0) {
      // Peças muito grandes que não cabem na chapa
      break
    }
  }

  return {
    chapas,
    pecasNaoColocadas: pecasRestantes,
  }
}
