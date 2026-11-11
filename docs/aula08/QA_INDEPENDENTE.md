# Aula 08 — QA independente não autora

**Revisor:** agente nativo `/root/p4_qa_independente`, sem participação na autoria da aula, do modelo, dos testes ou do contrato. **Data:** 10/11/2026, America/Fortaleza.

**Decisão: PASS — QA independente da Aula 08.** Não há achado bloqueante aberto no candidato identificado em [SHA-256 do candidato](evidence/qa-candidate-sha256.json). Três achados reais foram corrigidos e revalidados: transbordamento em projeção, grupos ARIA sem papel e foco do enunciado no Firefox. A revisão cobre conteúdo, comportamento local, contrato, acessibilidade verificável, preservação de escopo e evidências executadas.

Este PASS autoriza prosseguir ao gate de CI previsto pelo usuário. **Não declara CI, merge ou publicação concluídos**, nem equivale a conformidade WCAG completa ou aprovação pedagógica institucional. Esses estados dependem dos recibos próprios do coordenador.

## 1. Escopo e origem

Revisão do pedido `PPI-A08 — Aula Interativa: Da Evidência ao Requisito`, dos cinco arquivos de implementação da aula, do contrato de exportação, dos exemplos, da especificação pedagógica, da suíte de testes e da integração ao portal. Baseline do repositório: `b9a1e960bc5531429c627429dea0259d565d9666`.

O revisor leu os 34 enunciados contextualizados, alternativas, gabaritos e feedbacks; conferiu os objetivos e a equivalência entre trilhas. As fontes didáticas foram confrontadas com a análise crítica documentada pelo agente P1. A leitura original dos dois arquivos do Drive e dos catálogos oficiais foi executada por P1, não repetida nem atribuída ao revisor.

## 2. Matriz da revisão

| Critério | Resultado desta rodada | Evidência / fundamento |
| --- | --- | --- |
| 22–30 telas, conteúdo e prática intercalados | PASS | 26 telas: conceitos, exemplos, seis missões, catálogo, revisão e ticket. |
| Roteiro de 50 minutos | PASS | Especificação: 5 + 10 + 20 + 10 + 5 minutos, intercalados. |
| Cadeia entre registro, achado/evidência, necessidade, requisito e teste | PASS | Telas 04–06, 08–09, 18, 21–23; missão 6 preserva hipótese de utilidade pendente. |
| RF/RNF/dados/regras, qualidade e prioridade | PASS | Telas 11–20; taxonomia explicitamente didática, sem alegar norma institucional inventada. |
| Gabaritos e duas trilhas | PASS | 17 perguntas por trilha, respostas coerentes e feedback para todas as alternativas. |
| Pesos de XP | PASS | 10/15/20/15/20/20; pontuação derivada de respostas atuais; ausência de bônus por quantidade de texto. |
| Avaliação aberta sem correção semântica simulada | PASS | Checklist declaratório; avaliação docente permanece pendente. |
| Quatro domínios separados | PASS | Treino, completude, docente e nota oficial no modelo, exportação e impressão. |
| Dados sintéticos e proteção | PASS | Nenhum nome/matrícula compulsório, coleta externa, ranking ou telemetria; regras dos casos identificadas como fictícias. |
| Interoperabilidade | PASS com limite explícito | Schema 2020-12 e metadados versionados; documentação distingue validação estrutural de validação semântica necessária a consumidor futuro. |
| Persistência e isolamento | PASS | Teste próprio: nove campos longos e ticket preservados exatamente; catálogo/ticket separados por trilha. |
| Impressão de textos longos | PASS | PDF de seis páginas; nove marcadores de fim de campo e ticket confirmados por `pdftotext`; página final inspecionada visualmente. |
| Limpeza local sem afetar aulas anteriores | PASS | Cancelamento preserva; confirmação remove apenas a chave Aula08 e mantém sentinelas sintéticas Aula07/ficha07. |
| Apresentação 16:9 com todas as alternativas/feedbacks | **PASS — QA-01 fechado** | Revalidação própria de 246 estados: zero transbordamento e zero erro JavaScript. Falha inicial preservada como histórico. |
| Reflow do catálogo/revisão/ticket em 390/320 px | PASS | 12 combinações de telas 24–26 e quatro resoluções; largura de documento igual à viewport móvel. |
| Contraste de texto e controles | PASS nos pares examinados | 93 estados, 45 pares, mínimo de texto 5,349:1; bordas de controle ≥3,215:1 e foco ≥4,846:1 contra os fundos adjacentes avaliados. |
| ARIA, teclado e foco após atualização | PASS — QA-02/03 fechados | 99 estados axe finais sem violações; seis verificações focais nos três motores; revisor confirmou oito sequências de foco no Firefox. |
| Preservação de escopo | PASS | Cartões 01–07 do portal comparados byte a byte; nenhum arquivo de aula anterior modificado. |
| Portal e acesso direto ao catálogo | PASS | Oito cartões; busca “requisito” encontra Aula08; `#s24` abre o catálogo. |
| SUAP e aplicação da Aula07 | PASS | Replanejamento declarado como proposta; sem afirmação de aprovação SUAP ou aula ministrada. |

## 3. Achado inicial, correção e revalidação

### QA-01 — conteúdo e controles ultrapassam o canvas

**Severidade:** bloqueante para o gate de apresentação, pois o pedido exige ausência de cortes/sobreposições nas resoluções de referência.

No Chromium 141, em 1280 × 650 e 1280 × 720, percorrer todas as alternativas de cada questão gera 78 estados com descendentes além do limite inferior do slide. Casos afetados incluem M2, M4, M5 e M6. Na M4 (`s17`), questão 1, a seleção de alternativa longa seguida do feedback empurra os controles e o rodapé para fora da superfície; em uma amostra 1280 × 650, o canvas termina em y=577,09 e o rodapé chega a y=625,19. O pior excesso observado na rodada foi aproximadamente 100,53 px. O catálogo `s24` também excede o limite pelo rodapé.

**Reprodução curta:** abrir a aula em 1280 × 650; ir à tela 17; selecionar A, B ou C da primeira questão; conferir limites de `.slide.active`, `.mission-actions` e `.slide-footer`. Repetir nas demais questões e alternativas, inclusive feedback incorreto.

**Critério de fechamento:** todas as alternativas/feedbacks das duas trilhas permanecem dentro do canvas nas duas resoluções de projeção, com texto legível e sem ocultação por `overflow:hidden`.

**Correção e revalidação:** P2 reuniu o índice de questões e seu estado em uma linha, deu largura integral a grupos de três alternativas e manteve o rodapé interno redundante apenas no modo leitura. O revisor executou novamente todos os 236 estados de alternativas/feedbacks nas duas trilhas e resoluções de projeção, mais quatro estados de catálogo e seis estados móveis de fechamento: **246 estados, zero transbordamento, zero erros JavaScript**. A captura da M4 com feedback de erro em 1280 × 650 foi inspecionada visualmente e mostra alternativas, explicação e controles dentro da superfície. Não houve redução das fontes das alternativas nem ocultação do conteúdo. **QA-01 fechado.**

Após essa revalidação, houve uma única alteração de CSS, exclusivamente em impressão: `#print-summary dt` ganhou `break-after: avoid`. O revisor reconstruiu o hash anterior removendo exatamente essa declaração e confirmou que todas as regras de tela são byte a byte idênticas. O recibo está em `qa-css-delta.json`; a suíte final registra a impressão com o CSS atual.

### QA-02 — rótulos em grupos genéricos sem papel explícito

A inspeção dos resultados `incomplete` do axe identificou `aria-label` em `div.lesson-progress`, `.question-nav` e `.catalog-tabs` sem papel que suporte um nome acessível. Foi acrescentado `role="group"` às três famílias, preservando conteúdo e layout. A revalidação final de P3 verificou os oito grupos renderizados, nomes acessíveis e interação por teclado nos três motores. A revisão própria também confirmou que os grupos têm o papel correto, que os dois `aria-controls` apontam para os diálogos existentes e que não há `aria-labelledby` quebrado. **QA-02 fechado.**

### QA-03 — foco perdido no Firefox após substituir o enunciado

A verificação focal de P3 demonstrou que ativar o índice de questão por teclado podia deixar o foco no `BODY` no Firefox, porque a tentativa de focar a legenda ocorria imediatamente após substituir os elementos. O coordenador passou a focar o enunciado no próximo quadro de renderização, verificando que a legenda continua conectada. A asserção não foi relaxada para aceitar foco no corpo.

O revisor executou oito sequências no Firefox 142.0.1, quatro questões em 1280 px e quatro em 320 px: Enter no índice foca `LEGEND.prompt`; Enter em uma alternativa mantém o foco no novo botão selecionado. P3 confirmou índice, questão anterior/próxima, reinício e catálogo nos três motores, com seis verificações focais PASS. **QA-03 fechado.**

## 4. Verificações próprias e evidências

- [Geometria das missões — rodada inicial](evidence/qa-mission-geometry.json): 236 estados, 78 com transbordamento, zero erros JavaScript.
- [Revalidação independente após correção](evidence/qa-layout-retest.json): 246 estados, zero achados; inclui hashes dos cinco arquivos de implementação.
- [Delta final restrito à impressão](evidence/qa-css-delta.json): identidade byte a byte das regras de tela comprovada.
- [Missão com feedback após correção](evidence/qa-mission-after-1280x650.png): imagem real em janela curta.
- [Geometria do catálogo e fechamento](evidence/qa-catalog-geometry.json): telas 24–26 em 1280 × 650, 1280 × 720, 390 × 844 e 320 × 568.
- [Dados, isolamento, limpeza e impressão](evidence/qa-data-checks.json): cinco verificações funcionais independentes PASS.
- [PDF longo de teste, inteiramente sintético](evidence/qa-print-long.pdf): seis páginas, nove campos longos e ticket preservados.
- [Preservação de escopo](evidence/qa-scope.json): cartões anteriores e diff rastreado conferidos.
- [Contraste e relações ARIA](evidence/qa-contrast-and-aria.json): 93 estados, composição alfa e pior extremo do gradiente da capa; limite conservador 4,5:1 para todos os textos, inclusive os grandes.
- [Foco do Firefox após correção](evidence/qa-firefox-focus-retest.json): oito sequências de teclado, com hash do JavaScript final.
- [Hash do candidato final](evidence/qa-candidate-sha256.json): implementação, contrato e arquivos de integração.
- [Detalhe dos resultados inicialmente inconclusivos](evidence/qa-axe-incomplete-detail.json): preservado para explicar os achados, sem confundi-lo com a situação corrigida.
- `qa-overflow-1.png` a `qa-overflow-6.png`: amostras visuais do achado inicial; não representam a versão corrigida.

Os testes de fluxo usaram dados fabricados, inclusive sentinelas de armazenamento. Nenhum conteúdo de aluno foi consultado ou alterado.

## 5. Consolidação dos testes de P3

Os resultados abaixo foram lidos pelo revisor a partir dos relatórios reais; não são testes fictícios nem contagens de tarefas planejadas.

| Camada | Resultado | Cobertura e recibo |
| --- | --- | --- |
| Modelo, contrato e invariantes | 25/25 PASS | Log de `npm run test:aula08:unit`, sem skips. |
| Fluxos completos | 51/51 PASS | [browser-report.json](evidence/browser-report.json), 17 casos por motor; 624 combinações de layout, missões, XP, reset, isolamento, exportação, storage, teclado e offline. |
| Impressão no CSS final | 3/3 PASS | [print-final-report.json](evidence/print-final-report.json), rascunhos preenchido e longo nos três motores; PDFs efetivos gerados no Chromium. |
| Revisão final de ARIA/foco | 6/6 PASS | [a11y-final-report.json](evidence/a11y-final-report.json), 99 estados axe com zero violações e zero `aria-prohibited-attr`, além dos fluxos de foco. |

Motores executados: **Chromium 141.0.7390.37, Firefox 142.0.1 e WebKit 26.0**. O WebKit local usou bibliotecas e um launcher no ambiente de teste, sem dependência acrescentada à aplicação; a CI usa o procedimento padrão do Playwright.

O axe ainda registra, por motor, 32 estados inconclusivos em `aria-valid-attr-value` e 32 em `color-contrast`. O primeiro grupo refere-se aos IDs de diálogos fechados, conferidos manualmente no DOM. O segundo decorre da faixa decorativa `::before`, gradiente da capa e caracteres como setas: os pares de cor e sua composição foram calculados e as áreas foram inspecionadas. **Zero violações automáticas não foi tratado como sinônimo de auditoria completa.**

Os cinco hashes de implementação do relatório focal final coincidem com os arquivos atuais. A única alteração posterior ao recebimento desse relatório está no teste `tests/aula08/browser.cjs`, que acrescenta a regressão explícita do foco já verificado pelo teste focal; não muda a aplicação. A CI deve executar a suíte efetivamente commitada antes do merge.

## 6. Limites da conclusão

A revisão técnica não equivale à aplicação da aula com estudantes, validação de viabilidade pelo professor, teste no projetor físico nem auditoria completa com leitores de tela. A meta WCAG 2.2 AA é tratada por critérios verificáveis; resultados de axe não provam conformidade integral. A indicação de fonte no catálogo e a autoavaliação não autenticam evidência ou autorização. Um consumidor futuro deve recalcular XP e validar relações semânticas, como descrito em [Contrato v1](../../contracts/README-aula08.md).

Os três achados estão fechados e não resta bloqueante de QA no candidato revisado. CI, merge e readback de Pages permanecem gates separados. Não foi executado merge ou deploy por este revisor.
