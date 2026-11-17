# 🛒 Classificador Inteligente de Catálogo com IA

Aplicação desenvolvida em **TypeScript** e **Node.js** com integração à **Google Gen AI API (Gemini)**, projetada para automatizar a limpeza, padronização e categorização de dados em catálogos de e-commerce, marketplaces e plataformas de delivery.

---

## 🎯 O Problema que Ele Resolve

Em ecossistemas de alta escala — como aplicativos de delivery e grandes supermercados online —, os dados cadastrais de produtos enviados por diferentes fornecedores chegam frequentemente despadronizados, com abreviações caóticas, erros de digitação e falta de categorização uniforme (ex: *"refri coca cola zero acucar 2l pet"*). 

Este aplicativo resolve esse problema utilizando **Inteligência Artificial (LLMs)** combinada com **Engenharia de Software robusta** para:
* **Padronizar nomes comerciais** de forma limpa e legível para o usuário final.
* **Categorizar automaticamente** os itens (ex: Bebidas, Hortifrúti, Padaria, etc.).
* **Gerar descrições comerciais atrativas** para o catálogo.

---

## 🛠️ Arquitetura e Decisões de Engenharia

O projeto foi estruturado seguindo boas práticas de desenvolvimento de software modernas:
1. **Tipagem Estática Rigorosa:** Uso de interfaces do TypeScript (`ProdutoBruto`, `ProdutoProcessado`) para garantir contratos de dados consistentes.
2. **Programação Orientada a Objetos (POO):** Toda a regra de negócio está encapsulada na classe `ClassificadorCatalogoAI`, promovendo alta coesão e manutenibilidade.
3. **Resiliência e Tratamento de Erros:** Implementação de um mecanismo de tentativas (*retry logic*) com tratamento de exceções para lidar com indisponibilidades momentâneas de rede ou picos de tráfego na API.
4. **Modo de Segurança (Fallback Inteligente):** Caso ocorram falhas de conexão ou limites de taxa na API externa, a aplicação aciona um mecanismo de fallback local para assegurar que o fluxo de execução nunca seja interrompido de forma abrupta.

---

## 📂 Estrutura do Projeto

```text
ifood-ai-classifier/
├── src/
│   └── index.ts          # Código-fonte principal (TypeScript)
├── .env                  # Variáveis de ambiente (Chave da API)
├── .env.example          # Exemplo de configuração de ambiente
├── package.json          # Dependências e scripts do projeto
├── tsconfig.json         # Configurações do compilador TypeScript
└── README.md             # Documentação oficial do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* Ter o **Node.js** instalado na sua máquina.

### Passo a passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO_DO_GITHUB/ifood-ai-classifier.git
   cd ifood-ai-classifier
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   * Crie um arquivo `.env` na raiz do projeto baseando-se no `.env.example`:
     ```env
     GEMINI_API_KEY=sua_chave_de_api_aqui
     ```
   * *Nota: Você pode gerar uma chave gratuita no [Google AI Studio](https://aistudio.google.com/).*

4. **Compile o código TypeScript para JavaScript:**
   ```bash
   npx tsc
   ```

5. **Execute a aplicação:**
   ```bash
   node src/index.js
   ```

---

## 💻 Exemplo de Saída no Terminal

```json
[
  {
    "id": 1,
    "nomePadronizado": "Refrigerante Coca-Cola Zero Açúcar 2L",
    "categoria": "Bebidas",
    "descricaoCurta": "Refrescante, sem açúcar e ideal para acompanhar suas refeições.",
    "preco": 10.99
  }
]
```

---

## 💡 Autor
Desenvolvido com foco em engenharia de software e inteligência artificial aplicada.