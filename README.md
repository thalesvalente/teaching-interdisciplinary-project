# Prática Profissional Integrada I · IFMA

Portal de materiais da disciplina no Campus Itapecuru-Mirim.

**Endereço do portal, após ativar o GitHub Pages:**
https://thalesvalente.github.io/teaching-interdisciplinary-project/

## Materiais disponíveis

| Aula | Material |
| --- | --- |
| 01 | [Conhecendo a PPI e os desafios](lessons/1-conhecendo-ppi-e-os-desafios.pdf) |
| 02 | [Da observação ao problema de projeto](lessons/2-Da_observacao_ao_problema_de_projeto-versao-boa.pdf) |
| 03 | [Escolher para investigar](lessons/3-%20Escolher%20para%20investigar.pdf) |
| 04 | [Processo, papéis e marcos](lessons/4-processo-papeis-marco.pdf) |
| 05 | [Mapeamento de Fluxos de Informação](lessons/aula-05-fluxos-informacao/) · [Ficha da equipe](lessons/aula-05-fluxos-informacao/Ficha_Equipe_Aula_05_PPI.html) |
| 06 | [Ética e Proteção de Dados](lessons/aula-06-etica-protecao-dados/) · [Ficha da equipe](lessons/aula-06-etica-protecao-dados/Ficha_Equipe_Aula_06_PPI.html) |

Os PDFs originais permanecem em `lessons/`, sem renomeação ou alteração. O portal organiza o acesso aos materiais; não modifica atividades, prazos ou critérios de avaliação.

## Publicação

Abra as [configurações de Pages deste repositório](https://github.com/thalesvalente/teaching-interdisciplinary-project/settings/pages).

Em **Build and deployment**, escolha **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)** e clique em **Save**. Acompanhe a publicação na aba **Actions**. O endereço só estará disponível depois da ativação e de uma publicação concluída com sucesso.

Referência: [Configurar a fonte de publicação — GitHub Docs](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Estrutura

- `index.html`: página inicial responsiva, catálogo das aulas, busca local e guia de uso.
- `.nojekyll`: marcador para publicação estática, sem processamento Jekyll.
- `lessons/`: materiais originais da disciplina.

A página utiliza HTML, CSS e JavaScript locais. Não há dependências de CDN, instalação de pacotes, coleta de dados ou serviços de terceiros. Os links das aulas também funcionam com JavaScript desativado; apenas a busca depende dele.

## Aula 06: uso e manutenção

A aula oferece 24 telas, modo leitura responsivo e cinco desafios com até 100 XP. A ficha da equipe tem sete missões, com um indicador separado de preparação. Os XP da ficha registram preenchimento; a qualidade das respostas depende da revisão docente.

**PDF e impressão aceitam respostas em branco.** A exportação registra a pontuação atual sobre 100, as respostas registradas e as pendências. Corrigir, trocar ou apagar uma resposta recalcula os pontos. Os índices de risco não são XP nem autorização para utilizar dados.

Os arquivos funcionam localmente, sem envio das respostas. Para continuar a ficha em outro momento, use **Guardar rascunho (JSON)** e depois **Reabrir rascunho**. Não há salvamento automático. Símbolos que o gerador de PDF direto não suporta são preservados pelo fluxo **Imprimir → Salvar como PDF**.

- [Guia de uso, rubricas e decisões didáticas](lessons/aula-06-etica-protecao-dados/FICHA_PROTOCOLO.md).
- [Relatório da revisão de usabilidade, acessibilidade e conteúdo](docs/aula06-revisao-2026-10-20.md).

### Verificações de desenvolvimento

As dependências abaixo servem somente aos testes; o site continua estático e não precisa de instalação para funcionar.

```sh
npm ci
npx playwright install --with-deps chromium firefox
npm run test:aula06
```

A suíte verifica layout, teclado, estados de acessibilidade automatizáveis, pontuação, importação de rascunhos e exportações parciais. Produz relatórios e amostras temporárias em `tmp/aula06-qa/`. Para incluir WebKit, instale esse motor com Playwright e execute `AULA06_BROWSERS=chromium,firefox,webkit npm run test:aula06`. Os resultados e os limites da verificação estão descritos no relatório da revisão.

Para conferir também o texto, os pontos e os limites das páginas dos PDFs baixados, execute `python tests/aula06-pdf-qa.py tmp/aula06-qa` em um ambiente com `pdfplumber`. A inspeção visual continua necessária para avaliar quebras de página e apresentação.

## Acrescentar uma aula

1. Envie o material para `lessons/`.
2. Copie um bloco `<article class="card">` em `index.html`. Atualize o identificador, o número, o título, o texto, `data-search`, os dois links e os rótulos `aria-label`.
3. Acrescente o atalho correspondente na lista `.journey`. Identificadores devem ser únicos.
4. Atualize a tabela deste README. Confira os links e o layout no celular antes de publicar.

A contagem da busca é calculada a partir dos cartões. **O catálogo não é atualizado automaticamente ao enviar um arquivo:** o novo cartão e o atalho precisam ser acrescentados ao HTML.

Espaços nos caminhos devem ser representados como `%20`; preserve maiúsculas e minúsculas dos nomes. Não adicione links para materiais ainda não publicados. Se uma aula em HTML for disponibilizada, troque o link e o rótulo de formato, sem chamá-la de PDF.
