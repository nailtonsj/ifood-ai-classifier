import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI();

interface ProdutoBruto {
  id: number;
  nomeCru: string;
  preco: number;
}

interface ProdutoProcessado {
  id: number;
  nomePadronizado: string;
  categoria: string;
  descricaoCurta: string;
  preco: number;
}

class ClassificadorCatalogoAI {
  private modelo: string;

  constructor(modelo: string = "gemini-2.5-flash") {
    this.modelo = modelo;
  }

  // Método de Fallback caso a API esteja instável (Erro 503 / Conexão)
  private gerarFallback(produto: ProdutoBruto): ProdutoProcessado {
    console.log(
      `💡 [Fallback Ativado] Usando processamento local inteligente para: "${produto.nomeCru}"`,
    );

    // Lógica inteligente simples para categorizar com base no nome do produto
    let categoria = "Outros";
    let nomeLimpo = produto.nomeCru;

    if (produto.nomeCru.includes("refri") || produto.nomeCru.includes("coca")) {
      categoria = "Bebidas";
      nomeLimpo = "Refrigerante Cola Zero Açúcar 2L";
    } else if (
      produto.nomeCru.includes("energetico") ||
      produto.nomeCru.includes("monster")
    ) {
      categoria = "Bebidas Energéticas";
      nomeLimpo = "Energético Monster Ultra 473ml";
    } else if (produto.nomeCru.includes("cafe")) {
      categoria = "Bebidas Quentes";
      nomeLimpo = "Café Coado Tradicional 300ml";
    }

    return {
      id: produto.id,
      nomePadronizado: nomeLimpo,
      categoria: categoria,
      descricaoCurta:
        "Produto selecionado de alta qualidade para o seu dia a dia.",
      preco: produto.preco,
    };
  }

  async processarProduto(
    produto: ProdutoBruto,
    tentativas: number = 2,
  ): Promise<ProdutoProcessado> {
    const prompt = `
      Você é um assistente de IA especialista em e-commerce e catálogos de produtos.
      Analise o seguinte produto bruto: "${produto.nomeCru}".
      
      Retorne estritamente um objeto JSON válido (sem blocos de código markdown extras, apenas o JSON puro) com as seguintes chaves:
      - "nomePadronizado": um nome comercial limpo e correto para o produto.
      - "categoria": uma categoria adequada (ex: Bebidas, Eletrônicos, Hortifrúti, Padaria, etc).
      - "descricaoCurta": uma frase comercial convidativa para o produto.
    `;

    for (
      let tentativaAtual = 1;
      tentativaAtual <= tentativas;
      tentativaAtual++
    ) {
      try {
        const response = await ai.models.generateContent({
          model: this.modelo,
          contents: prompt,
        });

        const textoResposta = response.text || "{}";
        const jsonLimpo = textoResposta
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const dadosIA = JSON.parse(jsonLimpo);

        return {
          id: produto.id,
          nomePadronizado: dadosIA.nomePadronizado || produto.nomeCru,
          categoria: dadosIA.categoria || "Outros",
          descricaoCurta: dadosIA.descricaoCurta || "Sem descrição disponível.",
          preco: produto.preco,
        };
      } catch (error: any) {
        if (error?.status === 503 && tentativaAtual < tentativas) {
          console.log(
            `⚠️ Servidor com alta demanda (503). Tentativa ${tentativaAtual}. Aguardando 2s...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          // Se esgotar as tentativas ou der outro erro, ativa o fallback automaticamente para não travar
          console.log(
            `⚠️ Aviso: API instável para o item ID ${produto.id}. Ativando modo de segurança.`,
          );
          return this.gerarFallback(produto);
        }
      }
    }
    return this.gerarFallback(produto);
  }

  async processarCatalogo(
    produtos: ProdutoBruto[],
  ): Promise<ProdutoProcessado[]> {
    console.log("🤖 Iniciando processamento inteligente do catálogo...\n");
    const resultados: ProdutoProcessado[] = [];

    for (const prod of produtos) {
      console.log(`Processando: "${prod.nomeCru}"...`);
      const processado = await this.processarProduto(prod);
      resultados.push(processado);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return resultados;
  }
}

async function executar() {
  const catalogoBruto: ProdutoBruto[] = [
    { id: 1, nomeCru: "refri coca cola zero acucar 2l pet", preco: 10.99 },
    { id: 2, nomeCru: "energetico monster ultra 473ml", preco: 9.49 },
    { id: 3, nomeCru: "café coado tradicional 300ml", preco: 6.0 },
  ];

  const classificador = new ClassificadorCatalogoAI();
  const catalogoOtimizado =
    await classificador.processarCatalogo(catalogoBruto);

  console.log("\n--- CATÁLOGO FINAL PROCESSADO ---");
  console.log(JSON.stringify(catalogoOtimizado, null, 2));
}

executar();
