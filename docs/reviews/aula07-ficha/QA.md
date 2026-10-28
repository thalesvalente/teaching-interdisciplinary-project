# QA independente — Ficha Avaliativa Aula 07

**Estado: PASS no gate técnico independente G4.** Foram executados 45 testes unitários, 61 grupos de testes em navegadores, verificações de quatro PDFs reais e três revalidações focais após o último reparo de armazenamento. Nenhuma falha, bloqueio ou finding alto/crítico permanece aberto; os cinco findings médios também foram fechados. A aprovação é técnica e circunscrita às árvores explicitadas abaixo; não representa aceite docente, aprovação da PR, merge ou publicação.

Agente responsável: `/root/qa`, branch `work/aula07-ficha-qa`. Ownership exclusivo: testes e este relatório; implementação somente leitura. As correções de produto são encaminhadas ao implementador, com reprodução e severidade.

## Plano e oráculos

- Base: `dc5ed18ebdab8dea9035f56a8f3bdedb2520af68`, árvore `c517e16770ed329ad7353571279b2b1072b8e3d3`.
- Contrato: missão `PPI-A07-FICHA-AVALIATIVA-IMPLEMENT-MA-01`, rubrica pedagógica v1 e dados exclusivamente sintéticos.
- Não inferir que preenchimento implica qualidade, consentimento real, aprovação docente ou nota oficial.
- Testar os três motores Playwright já presentes no stack: Chromium, Firefox e WebKit.
- Manter evidências por SHA e registrar restrições reais do ambiente.

## Snapshot final e reprodução

| Identidade | Valor |
| --- | --- |
| Commit integrado final, unitários e revalidação focal | `92a37c225a1cece0961544220bd7269b7345f8b5` |
| Árvore integrada final | `d2c2bd70b80d80cc565ae373e99323d8b5047107` |
| Subárvore final da ficha | `a76418b010492f503d1f51dbbab95a776b50e520` |
| Commit da corrida completa de navegadores/PDFs | `3a797a4e2abb6de9750dd121943ca609157d99fb` |
| Árvore da corrida completa | `6b1fb2e9bc1f3e71757edea8b611323be1966c61` |
| Subárvore da ficha na corrida completa | `587a68ca2f51c6e27ca369ec0fbd785797a1d1a0` |
| Estado da ficha durante/depois da execução | Limpo, em checkout detached congelado e somente leitura para esta frente |
| Início da corrida completa de navegadores | `2026-10-27T22:03:41.070Z` |
| Handoff da suíte | `87e808db0f4ced2e36b555f23e7bd1d6f6376575` |
| Handoff do registro de identidade | `74a4a0b29849c066746fd4a552f745e278dbc492` |
| Handoff da regressão de rascunho rejeitado | `dfb09ede3cb923802b7fb9369a44d82e071d555a` |

Os arquivos de teste executados pertencem aos próprios snapshots integrados. As evidências foram escritas apenas na worktree de QA. O relatório não usa o HEAD mutável da implementação como substituto da árvore realmente testada. Após os 61 grupos aprovados, a revisão do coordenador identificou `QA-DATA-02`; o único reparo posterior no produto removeu a gravação redundante de `pagehide`. O caso afetado foi revalidado nos três motores e os 45 unitários foram repetidos. Os módulos de modelo/rubrica/exportação, HTML e CSS permaneceram byte a byte idênticos; seus hashes e a atribuição das imagens constam de `visual-report.json`. A suíte completa atual será novamente executada pelo CI sob responsabilidade do coordenador.

Com dependências instaladas a partir do lockfile e os navegadores Playwright disponíveis, execute na raiz do checkout que será verificado:

```sh
node --test tests/aula07-ficha/unit.test.cjs
PPI_FICHA_BROWSERS=chromium,firefox,webkit PPI_FICHA_EVIDENCE_DIR=tmp/aula07-ficha-qa node tests/aula07-ficha/browser.cjs
python3 tests/aula07-ficha/pdf-check.py tmp/aula07-ficha-qa
# Reprodução focal do último caso, também incorporado ao grupo STORAGE-UI:
PPI_FICHA_EVIDENCE_DIR=tmp/aula07-ficha-qa node tests/aula07-ficha/browser-storage.cjs
```

`PPI_FICHA_ROOT` permite apontar a um checkout separado e imutável; `PPI_FICHA_EVIDENCE_DIR` muda somente a saída. O executor precisou autorizar servidor HTTP local de leitura e subprocessos Node/Playwright, porque o sandbox negava `listen`. A execução real foi então realizada nos três motores; nenhum resultado foi substituído por inferência. A CSP do produto permaneceu ativa. O axe-core foi avaliado no contexto da página, sem `bypassCSP` ou relaxamento do HTML.

## Resultados finais

| Frente | Resultado | Evidência |
| --- | --- | --- |
| Modelo, pontuação, schema, importação e persistência | **45 PASS, 0 FAIL, 0 SKIP** | [unit-report.json](evidence/unit-report.json), [unit-run.log](evidence/unit-run.log) |
| Chromium `141.0.7390.37` | **21 PASS** | [browser-report.json](evidence/browser-report.json) |
| Firefox `142.0.1` | **20 PASS** | [browser-report.json](evidence/browser-report.json) |
| WebKit `26.0` | **20 PASS** | [browser-report.json](evidence/browser-report.json) |
| Total dos navegadores, Playwright `1.56.1` | **61 PASS, 0 FAIL, 0 BLOCKED** | [browser-run.log](evidence/browser-run.log) |
| PDFs A4, texto e geometria | **4 PASS, 0 FAIL** | [pdf-report.json](evidence/pdf-report.json), [pdf-run.log](evidence/pdf-run.log) |
| Revalidação focal do clique WebKit | **6/6 PASS** | [webkit-validation-retest.log](evidence/webkit-validation-retest.log) |
| Revalidação final do ciclo de rascunho rejeitado | **3 PASS, 0 FAIL**, um por motor | [storage-lifecycle-report.json](evidence/storage-lifecycle-report.json), [storage-lifecycle-run.log](evidence/storage-lifecycle-run.log) |

Cada trilha foi preenchida por controles reais em cada motor: 143 campos por fluxo, seis fluxos completos e 858 preenchimentos registrados. Ambas chegaram a 100 XP e nota automática 10,0, com JSON baixado e reimportado sem perda. A suíte também verifica exclusão de respostas, reset confirmado/cancelado, retomada da missão, mudança de trilha, preservação da autoria por ID e cartão adicional de evidência vazio.

O oráculo de pontuação exercita os 33 critérios com pesos estáveis, os sete tetos e a soma de 100. Textos vazios/espaços, opções padrão, decisões éticas sem justificativa e simulação sem revisão explícita não recebem a pontuação indevida. A autoria é proporcional ao número de integrantes ativos; renomear/remover integrantes preserva as respostas remanescentes. IA não concede XP. As fixtures são independentes, inteiramente sintéticas e não afirmam correção semântica.

Os testes adversariais incluem JSON inválido, versão desconhecida, excesso de tamanho/profundidade, propriedades inesperadas, chaves perigosas, IDs/referências inválidas, URL inadequada e pontuação adulterada. Os imports rejeitados preservam a resposta anterior e apresentam resumo acessível. Conteúdo semelhante a HTML aparece como texto nos campos e na impressão, sem criar imagem ou executar script. Quota/indisponibilidade do armazenamento não bloqueia a edição/exportação. O rascunho com URL ainda inválida sobrevive ao reload, embora importação e exportação mantenham validação estrita.

Todos os motores passaram na contingência sem JavaScript, uso offline após carregamento, downloads locais e verificação de ausência de envio de respostas pela rede. O console terminou sem erros ou warnings relevantes.

### Acessibilidade e viewports

- **30 estados auditados por axe-core:** nove etapas mais um estado de erro em cada motor; zero violações de qualquer impacto nesses relatórios. O alto contraste recebeu uma auditoria adicional em cada motor, sem violações sérias/críticas.
- **162 combinações de etapa e viewport:** nove etapas × seis dimensões × três motores, sem largura de documento superior ao viewport. Dimensões: 1280×650, 1366×768, 1920×1080, 390×844, 360×800 e 320×568.
- Navegação por teclado atravessou identificação, sete missões e resumo; acionou o link de salto, editou uma resposta e alcançou o reset com foco visível. O foco muda para conteúdo significativo ao navegar e para o resumo de erros ao validar; links do resumo levam ao campo inválido.
- Reflow com texto a 200% e espaçamentos ampliados foi exercitado em 640×480. Também foram verificados `prefers-reduced-motion`, alternância de alto contraste e `forced-colors`.

As capturas 1280×650 e 390×844 de missão/resumo foram inspecionadas visualmente: texto legível, campos íntegros e ausência de sobreposição. O pequeno rótulo anterior ao título pode estar acima da borda da captura porque a navegação desloca o foco para o título; trata-se da posição normal de rolagem, e não de conteúdo oculto. As demais dimensões têm resultados geométricos e percurso das nove etapas registrados em `VIEW-01`.

### Impressão e inspeção visual

| Documento real | Páginas | Caracteres selecionáveis | Inspeção |
| --- | ---: | ---: | --- |
| [Preenchido](evidence/ficha-filled.pdf) | 15 | 15.519 | Respostas, 100/100, critérios, autoria e bloco docente preservados |
| [Parcial](evidence/ficha-partial.pdf) | 22 | 10.232 | Resposta parcial, pendências, espaços restantes, quatro integrantes manuais e três registros de evidência |
| [Em branco](evidence/ficha-blank.pdf) | 22 | 9.493 | Nenhuma resposta anterior; linhas, caixas de revisão e espaço docente |
| [Resposta longa](evidence/ficha-long.pdf) | 17 | 21.068 | Texto multilinha atravessa páginas e mantém o marcador final |

Os quatro PDFs foram gerados pelo Chromium real no snapshot da corrida completa (`3a797a4`). Todos usam A4 retrato, conservam o aviso obrigatório, a separação da nota PPI1-3B e a fronteira com a Aula 08. O verificador encontrou zero caracteres fora da página, zero camadas textuais coincidentes e nenhuma página vazia. O texto final das respostas foi extraído para detectar truncamento. O último reparo de armazenamento não alterou os módulos ou estilos de impressão; essa identidade foi conferida por hash, sem alegar uma nova geração de PDF no último SHA.

As 76 páginas foram renderizadas com Poppler. As quatro contact sheets completas e páginas ampliadas relevantes foram inspecionadas, incluindo o bloco docente antes órfão, os espaços de autoria parcial e a continuação da resposta longa. As evidências selecionadas permanecem em Git; os renders individuais intermediários são reproduzíveis a partir dos PDFs. Firefox e WebKit passaram nos três modos de prévia, mídia de impressão, acionamento da impressão e preservação das respostas.

## Registro de findings

| ID | Severidade | Reprodução e consequência | Reparo | Revalidação |
| --- | --- | --- | --- | --- |
| QA-PRINT-01 | Média | Exportar PDF preenchido com a fixture completa: uma linha da área docente passava para uma página final sem texto. | `81bce6de8a58f20295d23690f176bed3a484a52b`: bloco docente e espaços de escrita sem fragmentação; títulos preservados. | **FECHADO:** PDF final de 15 páginas; página 15 contém o bloco docente completo. `pdf-check.py` passou a recusar páginas sem texto. |
| QA-PRINT-02 | Média | Exportar parcial sem integrantes: a Missão 7 aparecia na rubrica, mas os campos de autoria não eram impressos. | `a52869e00e6fcb7863c72321daa69c64defcf9fe`: espaços de identificação/autoria na parcial vazia; quadro de evidências mantém três espaços. | **FECHADO:** `PRINT-partial` passou nos três motores e PDF parcial contém os quatro espaços de autoria. |
| QA-DATA-01 | Média | Firefox/WebKit: editar URL, conferir pendências e atualizar antes dos 400 ms do autosave podia restaurar a edição anterior. Aguardar 600 ms evitava a perda, demonstrando a janela do debounce. | `53aab5db84c7875ccfc10f0687c7e798f31a1681`: persistência síncrona a cada edição; debounce do anúncio de XP permanece independente. | **FECHADO:** `URL-UI` passou nos três motores com reload imediato, sem espera artificial. |
| QA-VALIDATE-01 | Média | WebKit, 6/6 reproduções: editar URL inválida e clicar em conferir. A mensagem visual de `blur` deslocava o botão entre pressionar e soltar o ponteiro; o clique não ocorria e o resumo de erros ficava oculto. | `ef6082927d3b16e542132302b7f5406dd4f72d4a`: remove somente o handler visual de `blur`, mantendo validação explícita, associação ao campo e validação de exportação. | **FECHADO:** 6/6 repetições focais e `URL-UI` final nos três motores; resumo visível, foco correto e rascunho preservado. |
| QA-DATA-02 | Média | Abrir com JSON local corrompido exibe aviso e preserva o raw; recarregar sem editar disparava `pagehide` e o sobrescrevia com estado vazio. | `2778438a02e1c5060369193e994e689e82feb30c`: remove gravação redundante no `pagehide`, mantendo persistência síncrona das edições e ações. | **FECHADO:** novo teste falha na versão anterior; no snapshot final passa nos três motores, preservando raw por dois reloads e mantendo a persistência imediata após nova edição. |

As miniaturas `evidence/finding-print01-before.png` e `evidence/finding-print02-before.png` registram os defeitos visuais antes do reparo. Não são imagens do produto final.

Uma falha exploratória de teclado no Firefox vinha do teste tentando circular o foco pelo chrome do navegador para voltar ao índice. O roteiro foi corrigido para usar `Shift+Tab` a partir do conteúdo até o índice, sem editar o produto. As duas primeiras falhas unitárias intermediárias também não eram defeitos de produto: assert de texto Markdown já escapado e schema ainda em criação.

## Matriz das obrigações pedagógicas para testes executáveis

| Obrigação | Testes correspondentes |
| --- | --- |
| T01: treino separado, vazio e regressão | `SCORE-01`, `FLOW-01`, `PRIVACY-UI`; regressão dos slides pelo coordenador |
| T02: soma, tetos, exclusão e espaços | `SCORE-02`, `SCORE-04-M1…M7`, `SCORE-05`, `SCORE-06`, `FLOW-03` |
| T03: três resultados e Aula 08 | `FLOW-01`, `EXPORT-01`, `PRINT-*`, `pdf-check.py` |
| T04: cinco campos da descoberta | `SCORE-13`, `FLOW-02-*` |
| T05: técnicas centrais e complemento | `SCORE-09`, `SCORE-10`, `SCORE-14`, `FLOW-02-*` |
| T06: roteiro e categorias | `SCORE-11`, `SCORE-14`, `FLOW-02-*` |
| T07–T08: observação e documento | `SCORE-13`, `FLOW-02-*` |
| T09: IA opcional e sem rede | `SCORE-12`, `PRIVACY-01`, `PRIVACY-UI` |
| T10–T12: decisões éticas, risco e proveniência | `SCORE-07`, `SCORE-15`, `FLOW-02-*` |
| T13–T14: simulação e revisão explícita | `SCORE-08`, `SCORE-15`, `FLOW-02-*` |
| T15: classes de evidência e confiança | `SCORE-11`, `SCORE-16`, `EVIDENCE-UI` |
| T16: autoria e IDs | `TEAM-01`, `TEAM-02`, `TEAM-UI` |
| T17: equivalência e troca de trilha | `SCORE-03-*`, `TRACK-01…03`, `FLOW-02-*`, `RESET-UI` |
| T18: rascunho, offline e exportação | `IMPORT-01`, `STORAGE-01…04`, `FLOW-03`, `RESET-UI`, `PRINT-*`, `STORAGE-UI`, `OFFLINE-UI`, `NOJS-UI` |
| T19: importação limitada e hostil | `IMPORT-01…07`, `IMPORT-UI` |
| T20: texto não executável e links | `EXPORT-02`, `EXPORT-03`, `PRIVACY-01`, `IMPORT-UI`, `URL-UI`, `PRIVACY-UI` |
| T21: acessibilidade, reflow e A4 | `A11Y-01…03`, `VIEW-01`, `PRINT-*`, `pdf-check.py` e inspeção PNG |
| T22: preservação das aulas anteriores | Regressão do coordenador, revisão independente do reparo da fixture legada e diff de produto |

## Revisão independente de alteração global

O coordenador reparou a fixture legada de entrega da Aula 06 em `778201a`: o código de produto já usava `4º Bimestre`, enquanto o teste ainda preparava `3º Bimestre`. Revisei o diff contra a base: apenas a fixture e consultas/asserts de aba alvo mudaram; a proteção das demais abas passou a cobrir 1º/2º/3º e os testes de colunas futuras e preservação de notas permaneceram. Não reexecutei os 35 casos dessa suíte nesta frente; a execução e seu log pertencem ao coordenador.

## Histórico de execução

Exploração inicial: 39 testes unitários passaram após a conclusão do schema e o ajuste do assert de Markdown; depois, 40 passaram incluindo retenção do rascunho com URL inválida. A primeira execução Chromium cobriu 17 grupos com sucesso e detectou apenas o papel estático ainda não criado. A corrida exploratória dos três motores teve 57 grupos aprovados e três falhas (uma do método de teste, duas do mesmo defeito de autosave). Houve alteração do produto durante essa corrida; por isso ela não serve como aprovação por SHA.

O snapshot congelado `f028b9e1644344fe3307f6a3fa1d2ad896652692`, após o reparo de persistência, produziu 45/45 unitários, 60/61 grupos de navegador e quatro PDFs aprovados. A única falha restante revelou `QA-VALIDATE-01`. Entre esse snapshot e `3a797a4`, o produto mudou somente no handler de `blur` de `app.js`. Mesmo assim, a corrida de 45 unitários e 61 grupos foi repetida integralmente em `3a797a4`, e os quatro PDFs e imagens foram regenerados. Esse histórico preserva os resultados anteriores sem apresentá-los como aprovação de uma árvore que não foi testada.

A revisão adicional do coordenador então identificou a possibilidade de sobrescrever um rascunho local rejeitado ao recarregar sem editar. A reprodução e o teste novo confirmaram `QA-DATA-02` no SHA `3a797a4`; o arquivo `storage02-before/storage-lifecycle-report.json` registra essa falha esperada. A versão `92a37c2`, com a remoção do handler de `pagehide` e o teste incorporado a `STORAGE-UI`, passou no teste focal em cada motor e nos 45 unitários. `unit-report.json` e `storage-lifecycle-report.json` identificam esse último snapshot; `browser-report.json`, PDFs e imagens continuam corretamente atribuídos a `3a797a4`. Não houve nova execução local dos 61 grupos após o último reparo isolado; o CI executa a suíte completa atual.

## Gate e atribuição de regressão

| Critério | Parecer desta frente |
| --- | --- |
| Pontuação e equivalência entre trilhas | PASS, 45 unitários e seis fluxos reais completos |
| Persistência, reset, autoria e retomada | PASS, inclusive os dois reparos de URL/foco |
| Importação, escape e ausência de envio pela rede | PASS, testes adversariais unitários e de navegador |
| Acessibilidade automatizada e teclado | PASS no escopo executado; limites abaixo |
| Seis viewports, reflow e contraste | PASS, 162 geometrias e verificações adicionais |
| Impressão preenchida, parcial e em branco | PASS, três motores em prévia e quatro PDFs reais inspecionados |
| Findings críticos/altos abertos | Nenhum; os cinco findings médios também foram fechados |
| Regressão anterior, portal e GitHub Actions | Atribuição ao coordenador, com logs próprios; esta frente revisou a alteração da fixture legada |
| Aceite pedagógico/docente, PR e publicação | Fora da aprovação técnica desta frente; não inferido |

## Limites da evidência

- axe-core sem violações sérias/críticas cobre verificações automatizáveis; não é certificação completa WCAG 2.2 AA nem teste presencial com leitor de tela.
- Navegadores são versões reais executadas via Playwright, com viewports em pixels CSS; não representam testes em aparelhos físicos.
- PDF automatizado usa o layout de impressão Chromium. Firefox e WebKit são verificados em prévia e mídia de impressão; a paginação final da impressora escolhida pode variar.
- Os testes medem contrato funcional, completude, preservação dos dados e segurança das interações. Não validam qualidade pedagógica das respostas, autorizações reais, autoria humana ou nota oficial.
- A importação aceita arquivos de até 512 KiB e os limites estruturais definidos no modelo. O armazenamento local inválido é preservado até uma nova edição ou ação explícita; a ficha não reconstrói automaticamente conteúdo corrompido ou incompatível. O usuário ainda precisa manter cópias JSON válidas para recuperação.
