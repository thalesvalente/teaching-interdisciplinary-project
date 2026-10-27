# Evidências independentes da ficha

Corrida completa de 61 grupos, PDFs e imagens: `3a797a4e2abb6de9750dd121943ca609157d99fb`; subárvore da ficha: `587a68ca2f51c6e27ca369ec0fbd785797a1d1a0`.

Snapshot final com último reparo isolado de armazenamento e teste de regressão: `92a37c225a1cece0961544220bd7269b7345f8b5`; subárvore da ficha: `a76418b010492f503d1f51dbbab95a776b50e520`. Nele foram executados novamente os 45 unitários e a revalidação focal nos três motores. A única mudança posterior de produto foi remover a gravação redundante ao sair da página; os hashes dos arquivos de modelo, pontuação, conteúdo e impressão permanecem iguais.

Todos os nomes, respostas, links e situações desta pasta são sintéticos. A identificação completa, o método, as reproduções dos findings e os limites estão em [QA.md](../QA.md).

## Conteúdo

- `unit-report.json` / `unit-run.log`: 45 casos reais e a identidade do código.
- `browser-report.json` / `browser-run.log`: 61 grupos reais, versões dos motores, percursos, geometrias e resultados.
- `*-axe.json`: nove etapas e um estado de erro por motor, sem violações.
- `webkit-validation-retest.log`: seis repetições independentes do defeito de clique/validação reparado.
- `storage-lifecycle-report.json` / `storage-lifecycle-run.log`: revalidação final do rascunho local rejeitado em três motores, usando o mesmo cenário incorporado a `STORAGE-UI`.
- `finding-storage02-before.log`, `storage02-before-test.log` e `storage02-before/`: reprodução e falha esperada antes do último reparo. Não são falhas do produto final.
- `chromium-1280x650-*.png`, `chromium-390x844-*.png`: capturas reais da missão e do resumo.
- `ficha-{filled,partial,blank,long}.pdf`: quatro documentos gerados pela aplicação no Chromium.
- `pdf-report.json` / `pdf-run.log`: leitura de texto e geometria dos PDFs reais.
- `pdf-*-contact-sheet.png`: todas as páginas renderizadas, em miniaturas ordenadas.
- `pdf-*-page*.png`: ampliações selecionadas do bloco docente, autoria parcial, escrita manual e resposta longa.
- `finding-print0*-before.png`: evidência anterior dos dois defeitos de impressão. Não representa o produto final.
- `visual-report.json`: registro da inspeção e hashes dos documentos/imagens.
- Arquivos JSON e Markdown prefixados pelo motor: downloads reais dos fluxos, armazenamento indisponível e offline.

Os renders intermediários individuais não são versionados. Para reproduzir as páginas de um PDF com Poppler:

```sh
mkdir -p tmp/aula07-ficha-render
pdftoppm -scale-to 1100 -png docs/reviews/aula07-ficha/evidence/ficha-filled.pdf tmp/aula07-ficha-render/filled
```

Os hashes de identidade do código são mais informativos que timestamps dos arquivos. Datas de exportação dos PDFs refletem a zona configurada pela aplicação. Logs com o caminho do executor foram normalizados para caminhos relativos; nenhum dado de avaliação foi enviado para serviços externos.
