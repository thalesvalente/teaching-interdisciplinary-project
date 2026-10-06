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

## Acrescentar uma aula

1. Envie o material para `lessons/`.
2. Copie um bloco `<article class="card">` em `index.html`. Atualize o identificador, o número, o título, o texto, `data-search`, os dois links e os rótulos `aria-label`.
3. Acrescente o atalho correspondente na lista `.journey`. Identificadores devem ser únicos.
4. Atualize a tabela deste README. Confira os links e o layout no celular antes de publicar.

A contagem da busca é calculada a partir dos cartões. **O catálogo não é atualizado automaticamente ao enviar um arquivo:** o novo cartão e o atalho precisam ser acrescentados ao HTML.

Espaços nos caminhos devem ser representados como `%20`; preserve maiúsculas e minúsculas dos nomes. Não adicione links para materiais ainda não publicados. Se uma aula em HTML for disponibilizada, troque o link e o rótulo de formato, sem chamá-la de PDF.
