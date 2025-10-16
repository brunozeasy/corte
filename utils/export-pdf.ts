import jsPDF from "jspdf"
import type { Chapa, Peca, ResultadoCorte } from "@/types"

// Helper function to convert hex colors to RGB for jsPDF
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

export async function exportarPDF(
  chapa: Chapa,
  pecas: Peca[],
  resultado: ResultadoCorte,
  canvasRefs: HTMLCanvasElement[],
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  let yPosition = 20

  // Título
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text("CorteCerto Web - Plano de Corte", 105, yPosition, { align: "center" })
  yPosition += 15

  // Informações da Chapa
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Informações da Chapa:", 20, yPosition)
  yPosition += 7

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(10)
  pdf.text(`Dimensões: ${chapa.largura} x ${chapa.altura} mm`, 20, yPosition)
  yPosition += 5
  pdf.text(`Espessura do Corte: ${chapa.espessuraCorte} mm`, 20, yPosition)
  yPosition += 10

  // Estatísticas
  const totalPecasColocadas = resultado.chapas.reduce((acc, ch) => acc + ch.pecasColocadas.length, 0)
  const areaTotal = resultado.chapas.reduce((acc, ch) => {
    const areaPecas = ch.pecasColocadas.reduce((sum, item) => sum + item.peca.largura * item.peca.altura, 0)
    return acc + areaPecas
  }, 0)
  const areaChapa = chapa.largura * chapa.altura
  const aproveitamentoMedio = (areaTotal / (areaChapa * resultado.chapas.length)) * 100

  pdf.setFont("helvetica", "bold")
  pdf.text("Resumo:", 20, yPosition)
  yPosition += 7

  pdf.setFont("helvetica", "normal")
  pdf.text(`Chapas Usadas: ${resultado.chapas.length}`, 20, yPosition)
  yPosition += 5
  pdf.text(`Peças Cortadas: ${totalPecasColocadas}`, 20, yPosition)
  yPosition += 5
  pdf.text(`Aproveitamento Médio: ${aproveitamentoMedio.toFixed(1)}%`, 20, yPosition)
  yPosition += 5
  pdf.text(`Sobra Média: ${(100 - aproveitamentoMedio).toFixed(1)}%`, 20, yPosition)
  yPosition += 10

  // Tabela de Peças
  pdf.setFont("helvetica", "bold")
  pdf.text("Lista de Peças:", 20, yPosition)
  yPosition += 7

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)

  // Cabeçalho da tabela
  pdf.text("Nome", 20, yPosition)
  pdf.text("Largura", 60, yPosition)
  pdf.text("Altura", 90, yPosition)
  pdf.text("Qtd", 120, yPosition)
  pdf.text("Cor", 140, yPosition)
  yPosition += 5

  // Linhas da tabela
  pecas.forEach((peca) => {
    if (yPosition > 270) {
      pdf.addPage()
      yPosition = 20
    }
    
    // Nome da peça (ou "Sem nome" se não tiver)
    const nomeExibicao = peca.nome || "Sem nome"
    pdf.text(nomeExibicao, 20, yPosition)
    pdf.text(`${peca.largura} mm`, 60, yPosition)
    pdf.text(`${peca.altura} mm`, 90, yPosition)
    pdf.text(`${peca.quantidade}`, 120, yPosition)
    
    // Cor padrão para todas as peças (já que não temos cor individual)
    const cor = "#4CAF50"
    const rgb = hexToRgb(cor)
    pdf.setFillColor(rgb.r, rgb.g, rgb.b)
    pdf.rect(140, yPosition - 3, 10, 4, "F")
    yPosition += 5
  })

  // Adicionar imagens das chapas
  for (let i = 0; i < canvasRefs.length; i++) {
    const canvas = canvasRefs[i]
    if (!canvas) continue

    pdf.addPage()
    yPosition = 20

    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Chapa ${i + 1} de ${resultado.chapas.length}`, 105, yPosition, { align: "center" })
    yPosition += 10

    // Estatísticas da chapa
    const chapaAtual = resultado.chapas[i]
    const areaPecasChapa = chapaAtual.pecasColocadas.reduce(
      (acc, item) => acc + item.peca.largura * item.peca.altura,
      0,
    )
    const aproveitamentoChapa = (areaPecasChapa / areaChapa) * 100

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Peças: ${chapaAtual.pecasColocadas.length}`, 20, yPosition)
    yPosition += 5
    pdf.text(`Aproveitamento: ${aproveitamentoChapa.toFixed(1)}%`, 20, yPosition)
    yPosition += 10

    // Adicionar imagem do canvas
    const imgData = canvas.toDataURL("image/png")
    const imgWidth = 170
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    if (yPosition + imgHeight > 280) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight)
  }

  // Salvar PDF
  pdf.save("plano-de-corte.pdf")
}
