# Aula 08 — testes, acessibilidade e limites

Execução em 10/11/2026 (America/Fortaleza). Base: `b9a1e960bc5531429c627429dea0259d565d9666`. Este relatório documenta o candidato local; a CI e o readback da publicação têm recibos próprios.

## Resultados executados

| Verificação | Resultado | Evidência |
| --- | --- | --- |
| Conteúdo, estado, XP, reinício, isolamento e schema | 25/25 PASS | [Log unitário](evidence/unit-run.log) |
| Fluxos em Chromium 141.0.7390.37, Firefox 142.0.1 e WebKit 26.0 | 51/51 PASS; 17 por motor | [Relatório de navegador](evidence/browser-report.json) |
| 26 telas × 2 trilhas × 4 resoluções × 3 motores | 624 estados, zero corte/overflow detectado | Relatórios `*-geometry.json` |
| Axe, versão final da semântica | 6/6 verificações focais PASS; 99 estados, zero violações | [Recibo focal de acessibilidade](evidence/a11y-final-report.json) |
| Impressão no CSS final | 3/3 verificações; cenário preenchido e texto longo por motor | [Recibo de impressão](evidence/print-final-report.json) |
| Regressão dos modelos existentes | 82/82 PASS; sem skips | [Log de regressão](evidence/regression-unit.log) |
| Inspeção própria de todas as alternativas e feedbacks | 246 estados, zero overflow após correção | [Revalidação independente](evidence/qa-layout-retest.json) |
| Contraste real das cores renderizadas | 45 pares em 93 estados; mínimo 5,349:1 | [Contraste e ARIA](evidence/qa-contrast-and-aria.json) |
| Persistência, isolamento, limpeza e textos longos | 5 verificações próprias PASS | [Recibo independente de dados](evidence/qa-data-checks.json) |
| Portal e preservação | 8 cartões; busca correta; cartões 01–07 idênticos | [Portal/versão](evidence/portal-and-version.json), [escopo](evidence/scope-preservation.json) |

Os totais descrevem conjuntos diferentes e parcialmente sobrepostos; não devem ser somados como número de testes únicos. A configuração de projeção cobre 1280×720 e 1280×650; leitura móvel cobre 390×844 e 320×568. A inspeção visual adicional de interface também usou 320×844.

## Comportamentos verificados

- Todas as 17 perguntas de cada trilha foram respondidas pelos controles visíveis, incluindo erro, explicação e nova tentativa.
- O total chega a 100 XP apenas quando as seis missões estão completas; repetir respostas não acumula pontos. Reiniciar uma missão preserva as outras e a outra trilha.
- Catálogo, revisão e ticket não geram XP nem aprovação docente. A exportação mantém nota oficial como `null` e avaliação qualitativa como pendente.
- JSON foi baixado efetivamente e validado por Ajv 2020. Rascunhos vazios e preenchidos das duas trilhas acompanham o contrato.
- Persistência funciona em recarregamento imediato. Falta de quota mantém a sessão em memória com aviso; JSON local inválido é preservado sem sobrescrita silenciosa.
- Texto com aparência de HTML permanece texto no formulário, JSON e impressão. Não houve execução de markup informado pelo usuário.
- Impressão inclui respostas parciais/longas e não altera estado. O [PDF preenchido](evidence/aula08-final-filled.pdf) tem 3 páginas; o [PDF longo](evidence/aula08-final-long.pdf),6 páginas, preserva os nove campos de aproximadamente 1.900 caracteres.
- Nenhuma chamada remota, POST, analytics ou submissão ocorreu durante os fluxos. Os links externos de referência exigem ativação voluntária.

## Acessibilidade: o que foi resolvido e o que continua limitado

Semântica HTML, labels, legendas, grupos nomeados, feedback textual e anunciável, foco visível, navegação por teclado, retorno de foco de diálogos, alto contraste, cores forçadas e movimento reduzido foram exercitados. Não existem interações que dependem de arrastar.

A revisão não se limitou ao contador de violações do axe. A análise dos resultados **incomplete** identificou três grupos com `aria-label` sem papel explícito; foram corrigidos com `role="group"` e revalidados. As referências `aria-controls` a diálogos fechados foram conferidas contra IDs reais. Os itens de contraste que o axe não decidiu por causa de pseudo-elementos/degradês foram examinados com as cores renderizadas, composição alfa e pior fundo da capa. O menor contraste observado foi 5,349:1, acima do limite conservador 4,5:1 aplicado a todos os textos medidos.

Esses resultados apoiam a meta de critérios verificáveis da **WCAG 2.2 AA**, sem declaração de conformidade completa. Ainda não foram executados: testes com estudantes/usuários de tecnologias assistivas, uso com leitor de tela real, validação docente de tempo em sala e leitura no projetor físico. Os resultados não confirmam a veracidade de uma fonte inserida pelo aluno nem a qualidade de uma resposta aberta.

## Deltas de verificação, com hashes

A suíte ampla capturou o CSS antes de uma mudança restrita à impressão: `break-after: avoid` para manter o rótulo junto da resposta. O recibo focal de impressão cobre o CSS final; o revisor independente reconstruiu o hash anterior removendo exatamente essa declaração, demonstrando que as regras de tela permaneceram idênticas.

Depois foram corrigidos os três grupos ARIA e o foco após trocar de questão no Firefox. O foco agora é aplicado após o layout do novo enunciado; o teste exige que chegue ao enunciado, sem aceitar retorno ao corpo da página. O recibo focal de acessibilidade cobre esses caminhos nos três motores e vincula os 99 estados ao HTML/JS final. O revisor independente também confirmou oito estados de foco no Firefox. A CI executa a suíte completa sobre o commit da PR.

## Ambiente local e offline

Chromium/Firefox passaram diretamente em `file://` com `offline:true`. O mock offline do WebKit falhou inclusive com um HTML mínimo; nesse motor, o cenário equivalente usa bloqueio de todas as rotas HTTP(S) e exige zero requests externos. Os três motores também funcionaram com a rede retirada após carregar a aula. Essa diferença de técnica está explícita no recibo.

Bibliotecas faltantes do WebKit foram extraídas de pacotes oficiais verificados em um prefixo temporário do usuário, sem privilégios administrativos ou alteração do produto. A CI utiliza a instalação normal do Playwright no runner. A aula entregue requer apenas seus cinco arquivos estáticos locais e um navegador com JavaScript.

## Capturas do candidato

- [Capa em projetor](evidence/projector-aula08.png).
- [Missão 4 com erro explicado em janela 1280×650](evidence/mission4-1280x650.png).
- [Catálogo em 320 CSS px](evidence/mobile-catalogo-320.png).
- [Portal com a Aula 08](evidence/portal-aula08.png).

As imagens `qa-overflow-*.png` documentam o achado inicial corrigido. Não são a versão entregue. O [parecer independente](QA_INDEPENDENTE.md) registra descoberta, correção, revalidação e limites.
