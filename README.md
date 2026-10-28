# Prática Profissional Integrada I · IFMA

Portal de materiais da disciplina no Campus Itapecuru-Mirim.

**Portal:** https://thalesvalente.github.io/teaching-interdisciplinary-project/

## Materiais disponíveis

| Aula | Material |
| --- | --- |
| 01 | [Conhecendo a PPI e os desafios](lessons/1-conhecendo-ppi-e-os-desafios.pdf) |
| 02 | [Da observação ao problema de projeto](lessons/2-Da_observacao_ao_problema_de_projeto-versao-boa.pdf) |
| 03 | [Escolher para investigar](lessons/3-%20Escolher%20para%20investigar.pdf) |
| 04 | [Processo, papéis e marcos](lessons/4-processo-papeis-marco.pdf) |
| 05 | [Mapeamento de Fluxos de Informação](lessons/aula-05-fluxos-informacao/) · [Ficha da equipe](lessons/aula-05-fluxos-informacao/Ficha_Equipe_Aula_05_PPI.html) |
| 06 | [Ética e Proteção de Dados](lessons/aula-06-etica-protecao-dados/) · [Ficha da equipe](lessons/aula-06-etica-protecao-dados/Ficha_Equipe_Aula_06_PPI.html) |
| 07 | [Da pergunta à evidência](lessons/aula-07-da-pergunta-a-evidencia/) · [Ficha avaliativa da equipe](lessons/aula-07-da-pergunta-a-evidencia/ficha/) |

Os PDFs originais permanecem em `lessons/`. O portal organiza o acesso aos materiais e não altera prazos ou critérios de avaliação.

## Aula 07 — Da pergunta à evidência

A apresentação interativa possui 26 slides e seis missões formativas sobre:

- entrevista, observação e análise documental;
- perguntas abertas, neutras e ligadas ao objetivo;
- triangulação entre fala, prática e registro;
- achado, evidência, hipótese e pendência;
- uso responsável de IA e gate ético;
- aplicação nas trilhas Mapa de Memórias Quilombolas e EDA/Permanência Estudantil.

Os 100 XP dos slides são **exclusivamente de treino**: não valem nota, não geram ranking, não identificam estudantes e não alimentam a ficha avaliativa. A apresentação funciona localmente, sem enviar respostas.

A interface usa canvas de 1280 × 720 com escala automática para projetores e monitores, além de modo leitura para celulares. Inclui teclado, foco visível, alto contraste, redução de movimento, notas do professor e impressão 16:9.

- [Guia técnico e didático da Aula 07](lessons/aula-07-da-pergunta-a-evidencia/README.md)
- [Relatório de revisão da Aula 07](docs/aula07-revisao-2026-10-27.md)

### Verificação da Aula 07

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:aula07
```

A suíte verifica 1280 × 720, 1280 × 650, reflow móvel, teclado, missões, pontuação formativa, contraste, diálogos e acessibilidade automatizável. Evidências são gravadas em `tmp/aula07-qa/`.

### Ficha avaliativa da Aula 07

[Abrir a ficha da equipe](lessons/aula-07-da-pergunta-a-evidencia/ficha/). Produto: **Protocolo de Elicitação Testado — versão 1**. As instruções de preenchimento, as ajudas por trilha e a rubrica ficam na própria interface, sem exigir leitura de arquivos Markdown pelos estudantes.

A mesma ficha atende às trilhas **Mapa de Memórias Quilombolas** e **EDA/Permanência Estudantil**. São sete missões com 10, 15, 20, 15, 20, 10 e 10 XP, totalizando 100. A nota automática de processo é `XP / 10`; a qualidade técnica e ética permanece sujeita à revisão docente. Os XP de treino dos slides são independentes. A ficha não calcula a nota oficial PPI1-3B de 3,0 pontos nem antecipa o catálogo de RF/RNF/requisitos de dados previsto para a Aula 08.

O preenchimento é local, com rascunho automático, importação/exportação JSON, exportação Markdown e impressão/PDF preenchido, parcial ou em branco. Use somente identificação acadêmica mínima da equipe e exemplos sintéticos ou autorizados. Não há submissão automática, login, backend ou telemetria.

Para verificar a ficha:

```sh
npm run test:ficha07:unit
PPI_FICHA_BROWSERS=chromium,firefox,webkit npm run test:ficha07
```

- [Guia técnico da ficha](lessons/aula-07-da-pergunta-a-evidencia/ficha/README.md)
- [Contrato pedagógico e rastreabilidade](docs/specs/aula07-ficha/)
- [QA independente e evidências](docs/reviews/aula07-ficha/)
- [Manifesto multiagente](docs/implementation/aula07-ficha/EXECUTION_MANIFEST.md)

## Aula 06 — uso e manutenção

A Aula 06 oferece 24 telas, modo leitura responsivo e cinco desafios com até 100 XP. Sua ficha da equipe é um artefato separado, com sete missões e exportações próprias. Os XP da apresentação e da ficha registram percurso/preenchimento; a qualidade depende da revisão docente.

A apresentação e a ficha funcionam localmente. Para continuar a ficha em outro momento, use **Guardar rascunho (JSON)** e depois **Reabrir rascunho**. A impressão aceita respostas parciais.

- [Guia de uso, rubricas e decisões didáticas da Aula 06](lessons/aula-06-etica-protecao-dados/FICHA_PROTOCOLO.md)
- [Relatório da revisão da Aula 06](docs/aula06-revisao-2026-10-20.md)

### Verificação da Aula 06

```sh
npm run test:aula06
```

## Estrutura

- `index.html`: portal responsivo, catálogo, busca e guia de uso;
- `lessons/`: PDFs e aulas interativas;
- `docs/`: relatórios de revisão e evidências;
- `tests/`: testes automatizados de acessibilidade, reflow e comportamento;
- `.github/workflows/`: QA contínua das aulas.

Não há dependências de CDN, coleta de dados nem serviços externos para abrir as aulas.

## Publicação

O GitHub Pages usa a branch `main` e a pasta raiz. Após a integração, acompanhe a publicação na aba **Actions** do repositório.

## Acrescentar uma aula

1. Crie uma pasta em `lessons/` com nome canônico e sem espaços.
2. Adicione o cartão correspondente em `index.html`.
3. Atualize a tabela deste README.
4. Inclua testes de reflow, teclado e acessibilidade.
5. Confira os links e o layout em projetor, desktop e celular antes de integrar.
