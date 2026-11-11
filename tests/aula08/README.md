# QA da Aula 08

A suíte verifica a apresentação estática e o rascunho local do catálogo. Os XP são exclusivamente formativos; as verificações não atribuem nota nem simulam revisão docente.

## Executar

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:aula08:unit
npm run test:aula08
# Regressão focal de impressão, quando houver alteração somente em @media print:
node tests/aula08/print-check.cjs
# Regressão focal de grupos ARIA, foco e acessibilidade após alteração semântica:
node tests/aula08/a11y-review.cjs
```

Por padrão, os testes de navegador executam Chromium, Firefox e WebKit. Todos os navegadores solicitados precisam iniciar e concluir os testes: falta de binário ou biblioteca é registrada como `BLOCKED` e torna a execução malsucedida. A variável `AULA08_BROWSERS` permite uma execução diagnóstica limitada (por exemplo, `chromium`); ela não substitui a verificação final dos três navegadores. `AULA08_EVIDENCE_DIR` altera a pasta de evidências.

Em ambientes locais que oferecem bibliotecas em prefixo de usuário, `AULA08_WEBKIT_EXECUTABLE` pode apontar para um launcher instalado e verificado localmente. A CI não usa esse override; instala os requisitos do Playwright no runner. A aplicação didática não depende dessas bibliotecas: elas são dependências de desenvolvimento para a verificação dos navegadores.

## Cobertura

- 26 telas, seis missões, IDs versionados, pesos 10/15/20/15/20/20 e gabaritos justificados nas duas trilhas.
- 17 questões objetivas por trilha, erro com explicação, nova tentativa, pontuação derivada das respostas, reinício de missão e ausência de acúmulo duplicado.
- Isolamento de respostas e catálogo entre Memórias e Permanência; retomada local após recarregamento.
- Catálogo RF/RNF/dados, exportação voluntária e validação efetiva de JSON Schema 2020-12 com Ajv.
- Separação entre XP, completude, revisão docente pendente e nota oficial não aplicável.
- Rejeição de estado corrompido, versões desconhecidas, IDs/opções inexistentes, protótipos hostis e pontuação injetada.
- 26 telas × duas trilhas × quatro viewports (1280×720, 1280×650, 390×844 e 320×568) por navegador.
- Geometria do canvas, overflow horizontal e cortes detectáveis; imagens de todas as telas em projeção e amostras móveis.
- Axe-core com os critérios detectáveis WCAG 2.0/2.1/2.2 A/AA, foco visível, teclado, diálogos, alto contraste, cores forçadas e redução de movimento.
- Impressão da síntese em PDF no Chromium, CSS de impressão nos três motores e preservação do rascunho ao imprimir.
- Texto parecido com HTML tratado como texto; ausência de requisições externas, POST, telemetria e execução de conteúdo digitado.
- Sessão sem rede após carregar, abertura direta `file://` offline, falha de armazenamento e preservação dos bytes de um rascunho corrompido.

## Evidências

O diretório padrão `tmp/aula08-qa/` contém:

- `browser-report.json`: versões reais, hashes SHA-256 dos arquivos verificados, duração, resultados, falhas e evidências por teste;
- `print-final-report.json`: regressão focal de impressão vinculada aos hashes atuais, quando executada;
- `a11y-final-report.json` e `<browser>-axe-final.json`: regressão focal dos grupos nomeados e 33 estados de acessibilidade por navegador, vinculada aos hashes atuais;
- `<browser>-geometry.json`: medições dos estados da apresentação;
- `<browser>-axe.json`: violações e casos inconclusivos de acessibilidade;
- `<trilha>-sNN-1280x720.png`: prévias das 26 telas de cada trilha;
- `<browser>-<trilha>.json`: exportações sintéticas efetivamente baixadas;
- `aula08-filled.pdf` e `aula08-partial-safe-text.pdf`: sínteses geradas na impressão;
- `aula08-final-filled.pdf` e `aula08-final-long.pdf`: sínteses da regressão focal, com respostas completas ou nove campos de texto longos;
- capturas da missão 3 nas quatro resoluções solicitadas.

A workflow `.github/workflows/qa-aula08.yml` publica as evidências como artifact `aula08-qa`. Os relatórios de QA devem distinguir resultados locais, resultados de CI e inspeção humana; arquivos de uma execução anterior não constituem evidência de uma versão posterior.

## Limites

Os testes automatizados não demonstram conformidade WCAG completa. Leituras por tecnologias assistivas, uso por estudantes com necessidades específicas, projeção no equipamento real da sala, exatidão pedagógica e validação institucional exigem revisão humana. Os itens `incomplete` do axe são explicitamente registrados. O teste de abertura offline usa arquivos completos baixados; não promete cache persistente da página hospedada nem service worker.

### Particularidade observada no WebKit local

O WebKit 26.0 do ambiente local retornou erro interno ao abrir um HTML mínimo via `file://` com a emulação `offline: true`. O mesmo arquivo abriu com a emulação desligada. Por isso, o teste `FILE-OFFLINE` usa no WebKit abertura local com todas as rotas HTTP(S) abortadas e exige zero requisições remotas. Chromium e Firefox usam `offline: true` mais bloqueio HTTP(S). A evidência registra a técnica por motor. O teste `NETWORK` também desliga a rede depois do carregamento nos três motores e verifica as interações. Nenhuma limitação do ambiente é apresentada como funcionalidade testada do aplicativo.

### Revisão dos resultados inconclusivos

Os relatórios do axe preservam seletores, explicações e dados dos checks que exigem revisão. A suíte principal e a regressão focal reprovam `aria-prohibited-attr` mesmo quando o axe classifica a ocorrência como `incomplete`, pois um nome ARIA aplicado a um elemento genérico pode exigir correção semântica. A revisão dos demais resultados inconclusivos permanece explícita: não são somados aos passes nem descartados. A CI executa essa regra na suíte principal; não repete desnecessariamente a suíte focal.
