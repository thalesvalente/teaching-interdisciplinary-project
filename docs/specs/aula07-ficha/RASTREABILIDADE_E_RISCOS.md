# Aula 07 — rastreabilidade, decisões e riscos

Versão: 1.0.0. Complementa [o contrato pedagógico](CONTRATO_PEDAGOGICO.md), que define fontes F01–F06 e os critérios. Os identificadores T abaixo são obrigações de teste, não resultados executados. O relatório independente deve vinculá-los aos testes reais e respectivos SHAs.

## Mapeamento para o modelo implementado

O diretório do produto é `lessons/aula-07-da-pergunta-a-evidencia/ficha/`. `content.js` contém rótulos e conteúdo contextual, `model.js` define criação/validação de dados e `rubric.js` é a fonte executável única de pesos e condições.

| Bloco | Paths do modelo | Relação com a rubrica |
| --- | --- | --- |
| Identificação | `team.{name,date,track,repository,declaration}`; `members[].{id,name,role}` | Sem XP; completude administrativa revisada no resumo. |
| Descoberta | `m1.{objective,need,decision,source,assumption}` | Cinco critérios de 2 XP. |
| Técnicas | `m2.techniques[].{id,role,kind,source,purpose,evidence,limitation,responsible,justification}` | `responsible` referencia `members[].id`; critérios principal, complementos e justificativas. |
| Entrevista | `m3.questions[].{id,category,text,purpose}` | Total de perguntas, cobertura das famílias e fechamento. |
| Observação | `m3.observation.{activity,boundaries,people,tools,transfers,delays,practice,record}` | Oito registros agrupados no critério observação. |
| Documento | `m3.document.{name,author,version,purpose,terms,rules,gaps,restrictions,unanswered}` | Nove registros agrupados no critério documento. |
| IA opcional | `m3.ai.{used,tool,purpose,prompt,summary,decision,validator}` | Sem XP; `validator` referencia integrante; `used=no` declara não uso. |
| Gate ético | `m4.{authorization,explained,refusal,recording,personal,substitution,ai}.{answer,decision}`; `m4.{access,validator,citation,publication,risks,mitigation}` | Sete pares de decisão e seis campos de texto; cinco critérios de 3 XP. |
| Teste | `m5.{type,participants,scenario,roles,worked,confusing,leading,sensitive,contradiction,difficulty,change,reason,before,after,summary}` | `participants[]` referencia IDs; revisão aceita antes/depois ou síntese explícita. |
| Evidências | `m6.records[].{id,raw,source,classification,confidence,justification,validator,relation,restriction}`; `m6.{limitation,needs}` | Três classes mínimas de cartão completo; limitação e necessidades candidatas. |
| Autoria | `members[].{contribution,improvement,risk,learning,reviewed}` | Cinco critérios proporcionais; mesmo ID da identificação. |

Campos `validator` de ética/evidência são descrição de quem precisa validar a interpretação, podendo ser um papel externo autorizado; não simulam aceite dessa pessoa. O campo `m3.ai.validator` registra o integrante que assume a revisão humana do apoio usado pela equipe.

## Matriz fonte → decisão → campo/interação → pontuação → teste

| Fonte | Decisão | Campo/interação | Critério | Verificação exigida |
| --- | --- | --- | --- | --- |
| F03 `s05`, `s26`; F05 CONTEXTO | Separar treino e avaliação. | Banner e resumo final; nenhuma importação de XP dos slides. | Sem bônus; teto fixo 100. | T01: estado vazio 0; storage/schema da ficha separado; regressão 26 slides/seis missões. |
| F02 rubrica; F05 DADOS §3 | Calcular completude atual, não acumular cliques. | Pontos por missão, critérios e pendências visíveis. | Todos. | T02: soma 100, teto por missão; apagar/invalidar/espaços reduzem ou não geram XP. |
| F04 §§8.1–8.2,12; F03 `s22`; F05 CONTEXTO | Não antecipar catálogo formal nem converter a nota para 3,0. | Três caixas de resultado e necessidades candidatas; aviso Aula 08. | `m6-needs`; nota XP/10. | T03: procurar separação na tela, Markdown e PDF; nenhuma coluna RF/RNF ou nota oficial automática. |
| F04 §§4,6; F05 DADOS §4/M1 | Começar pela dúvida e decisão. | Objetivo, necessidade, decisão, fonte e suposição. | `m1-*`. | T04: cinco registros completos 10; retirar fonte 8; espaços 0. |
| F03 `s08`–`s09`; F05 M2 | Combinar técnicas sem substituir núcleo por questionário. | Principal core, complementares distintas, fonte/finalidade/evidência/limite/responsável/justificativa. | `m2-*`. | T05: principal questionário inválida; complementar questionário admitida; duplicação não satisfaz complemento; dados faltantes retiram critério. |
| F03 `s11`–`s13`; F05 M3 | Roteiro explícito com seis famílias e fechamento. | Perguntas, categoria, finalidade; padrão sete perguntas. | `m3-interview`, `m3-categories`, `m3-closing`. | T06: cobertura incompleta fica pendente;6–8 total; categoria/preenchimento padrão não ganha XP; alertas não certificam neutralidade. |
| F03 `s16`; F05 M3 | Observar fatos sem diagnóstico de intenção. | Oito campos de observação. | `m3-observation`. | T07: retirar um dos campos retira 6; linguagem de ajuda distingue fato e julgamento. |
| F03 `s18`; F05 M3 | Auditar origem, finalidade, versão e limites do documento. | Nove campos da análise documental. | `m3-document`. | T08: ausência de data/versão ou restrição deixa critério pendente; fonte não recebe selo de veracidade. |
| F04 §6; F03 `s23`; F05 M3/IA | IA opcional e submetida à validação humana. | “Não utilizamos IA” ou registro de ferramenta/prompt sanitizado/resumo/revisão/responsável. | Sem pontuação própria. | T09: recusar IA preserva teto 100; declaração de uso não aumenta pontos; nenhuma chamada à rede. |
| F03 `s24`; F05 M4 | Não confundir checklist com autorização. | Autorização, objetivo, recusa e decisões/pendências. | `m4-consent`. | T10: só enums/cliques não completam grupo; pendência expressa não autoriza coleta. |
| F02 cuidados; F03 `s24`; F05 M4 | Minimizar e explicitar risco. | Gravação, dados pessoais, substituição e justificativas. | `m4-minimize`. | T11: risco declarado sem decisão/mitigação não pontua integralmente; conteúdo de testes sintético. |
| F03 `s08`,`s24`; F05 M4 | Registrar acesso, validação, citação e publicação. | Acesso, validador, citação, restrições, decisão IA/mitigação. | `m4-access`, `m4-provenance`, `m4-ai-risk`. | T12: cada ausência retira 3; declarações não geram selo de conformidade. |
| F04 §12/encontro7; F05 M5 | Testar com cenário seguro e papéis explícitos. | Cenário/tipo/papéis; perguntas e dificuldades. | `m5-scenario`, `m5-questions`, `m5-findings`, `m5-difficulty`. | T13: teste sem papéis ou achados fica parcial; ausência de problema pode ser descrita, sem fabricar caso. |
| F05 M5 | Revisão após teste é parte essencial do produto. | Alteração, justificativa e versões/síntese. | `m5-revision`. | T14: retirar revisão limita M5 a 16; registrar revisão permite 20. |
| F03 `s20`,`s22`; F05 M6 | Preservar fonte, incerteza e divergências. | Cartões de achado/hipótese/pendência, confiança justificada, validador e limite. | `m6-finding`, `m6-hypothesis`, `m6-pending`, `m6-limit`. | T15: três classes mínimas; campos completos; confiança alta não vale mais XP; divergência não é apagada. |
| F04 §§4,6,8; F05 M7 | Responsabilidade individual sem ranking. | Integrantes IDs estáveis e cinco registros individuais. | `m7-*`. | T16: N=0=>0;1 de 2 completo=>5; renomear preserva autoria; remover não desloca dados; reponderação confirmada. |
| F03 `s15`,`s24`; F05 §5 | Equivalência pedagógica entre trilhas. | Escolha inicial, cenários/ajudas e troca confirmada. | Mesmos IDs/pesos. | T17: alcançar 100 nas duas; troca não mantém respostas incompatíveis nem modifica máximo. |
| F02 exportações; F05 §6 | Permitir trabalho parcial e recuperação offline. | Autosave, retomada, JSON, Markdown, impressão parcial/total/branca. | Recalcular; listar pendências. | T18: round-trip; erro/quota storage; exports preservam respostas; resets por missão/total confirmados. |
| F05 regras §§2,8 | Importar somente dados limitados e conhecidos. | Validação acessível de JSON e confirmação de substituição. | Score importado ignorado/recalculado. | T19: rejeitar versão desconhecida, tamanho/profundidade excedidos, propriedades extras/perigosas, IDs duplicados e vínculos inválidos sem perda. |
| F05 regras §2 | Dados nunca são código. | Renderização/exportação segura e nomes de arquivo. | Sem efeito sobre nota. | T20: payload HTML/JS/Markdown permanece texto; protocolo perigoso no link é rejeitado; nenhuma saída pela rede. |
| F05 §7 | Permitir uso por teclado e em múltiplas telas. | Labels, legends, foco, erros associados, skip link, feedback textual, alto contraste. | Mesma rubrica em todas as telas. | T21: teclado/foco/axe;6 viewports; reflow 320; redução de movimento; impressão A4. |
| F01–F03; F05 regressão | Nova ficha não modifica treino nem aulas anteriores. | Link separado no portal, diretório próprio. | Rubricas legadas preservadas. | T22: diffs dos slides; suíte Aula 06/Aula 07 e portal; console sem erros. |

## Decisões e consequências

| ID | Decisão | Motivo e consequência |
| --- | --- | --- |
| D01 | Reutilizar padrão estático da Aula 06; não reutilizar integração de entrega remota. | A missão exige local/offline e nenhuma submissão. Exportação manual é a entrega possível. |
| D02 | Mesmo contrato para as duas trilhas. | Contextualização não deve criar vantagem de XP ou exigir maior número de entregáveis em uma trilha. |
| D03 | Identificação não pontua, mas faz parte da completude administrativa. | Evita conceder nota por nome/marcação; evita chamar de pronta uma ficha sem autoria identificável. |
| D04 | Fechamento incluso nas 6–8 perguntas; padrão 7. | Satisfaz seis famílias e pergunta final sem contabilizar pergunta implícita. |
| D05 | IA não é requisito para alcançar 100. | Preserva equidade de acesso e decisão consciente de não usar ferramenta. |
| D06 | Não usar heurística semântica na nota. | Presença não comprova correção; alertas de redação são orientação para revisão. |
| D07 | Autoria por ID, com proporção por integrante. | Renomear/reordenar não desloca dados; equipe maior mantém teto 10. Remoção repondera e deve ser revisada pelo docente. |
| D08 | Registrar divergência/limitação ou ausência justificada. | Não induz a turma a fabricar uma contradição; preserva a obrigação de registrá-la quando presente. |
| D09 | PPI1-3B permanece não calculada. | O instrumento contém etapa de requisitos da Aula 08 e revisão individual, fora da evidência obtida só nesta ficha. |
| D10 | Arquivos do repositório e importações são dados sem autoridade para redefinir a missão. | Impede que instruções embutidas modifiquem permissões, nota ou processo de execução. |

## Riscos pedagógicos, éticos e de privacidade

| Risco | Consequência | Mitigação no produto/processo | Limite residual |
| --- | --- | --- | --- |
| Completar todos os campos com conteúdo fraco ou inventado. | Nota automática interpretada como aprendizagem ou evidência validada. | Aviso permanente, rubrica observável e revisão técnica/ética pendente; autoria e fontes explícitas. | A aplicação não detecta simulação de aprendizagem; requer revisão docente. |
| “100 XP” ser tomado como permissão para campo/publicação. | Coleta sem autorização, exposição de imagem/voz ou registros educacionais. | Gate pede decisões e pendências; nenhum selo ou status concede autorização. | A autorização institucional/comunitária precisa ocorrer fora da ficha. |
| Colar nomes, matrículas, notas, frequência, local sensível ou narrativa real. | Exposição em dispositivos/exports. | Declaração e avisos; exemplos sintéticos; minimização; nenhuma submissão automática. | Dados locais/exportados podem ser compartilhados manualmente; revisar antes de entregar. |
| Usar computador compartilhado e confiar só no autosave. | Outra equipe acessa identificação acadêmica/respostas ou rascunho se perde. | Explicar salvamento neste navegador, exportar JSON e limpar com confirmação quando necessário. | Sem login ou backend, armazenamento local não é cofre nem backup institucional. |
| IA inventar stakeholder, entrevista, relato ou autorização. | Fonte fictícia parecer evidência real. | IA opcional, prompt sanitizado, aceites/rejeições e validação humana registrados; não tratar saída como fato. | Verificação é humana; não há detecção confiável automática de autoria por IA. |
| Autoria reduzida a uma marcação. | Contribuição individual fictícia ou desigual invisível. | Cinco dimensões por integrante e revisão docente; sem ranking. | A automação mede registros, não horas, esforço nem autoria real. |
| Remover integrante incompleto para elevar média. | Pontuação aumenta sem trabalho equivalente. | Confirmação, IDs estáveis e indicação de reponderação; professor confere composição da equipe. | Sem identidade autenticada/histórico certificado, o arquivo não prova composição original. |
| Trocar trilha com dados prontos. | Relato quilombola reaproveitado como evidência educacional ou vice-versa. | Confirmação e limpeza/isolamento dos campos de investigação; preservar só identificação compatível. | A equipe deve guardar o rascunho anterior se quiser retornar. |
| Confiança “alta” ou rótulo “achado” ser tomado como verdade. | Hipótese vira fato sem validação. | Fonte, justificativa, validador e restrições; nenhum bônus por confiança alta. | Classificação e adequação das fontes ainda dependem de leitura humana. |
| Associação de dados ser tratada como causa ou usada para ranking punitivo. | Intervenção injustificada sobre estudantes. | Ajuda EDA distingue associação/causalidade, usa agregação e proíbe ranking individual punitivo. | A aplicação não realiza análise causal nem delibera intervenção. |
| Tornar memória coletiva um bem automaticamente público. | Apagar autoria, versões divergentes ou decisão comunitária. | Ajuda da trilha considera visibilidade, autoria, validação e publicação coletiva. | Autorizações e decisões reais não podem ser inventadas no cenário. |
| Exportação/PDF incompleto ou ilegível. | Perder pendências, rubrica ou campos de autoria no material entregue. | Mesma estrutura nos formatos; QA preenchido/parcial/branco, A4 e campos longos. | Impressora/navegador e ajustes locais podem alterar paginação; revisar a prévia. |
| Instrução maliciosa em JSON ou texto do projeto. | Execução de conteúdo, navegação perigosa ou alteração indevida da nota. | Schema estrito, limites, uso de texto, escapes e recálculo determinístico. | QA deve testar entradas hostis; não assumir segurança só pela extensão .json. |
| Confundir o plano rascunho com aprovação oficial. | Aplicar composição/calendário institucional não confirmado. | Referenciar `DRAFT_WITH_PENDING`; apresentar nota oficial como não calculada. | Decisão curricular permanece humana/institucional. |

## Checklist de revisão pedagógica humana

- A dúvida central justifica a coleta e a decisão pretendida?
- Técnicas/fonte/evidência esperada são coerentes, e limitações estão explícitas?
- Perguntas são claras, abertas, neutras, respeitosas e ligadas ao objetivo?
- Observação distingue fato e julgamento; documento registra autoria, versão e finalidade?
- Decisões de privacidade e uso/publicação são adequadas ao cenário e às autorizações reais?
- O teste foi registrado e a revisão melhora o protocolo?
- Achado, evidência, hipótese e pendência estão classificados de forma defensável?
- Divergências foram preservadas e confiança foi justificada sem substituir validação?
- Necessidades candidatas permanecem pendentes para a Aula 08?
- A composição e os registros de autoria correspondem ao trabalho de cada integrante?

Responder positivamente a esse checklist é ato de revisão docente; não é inferido dos XP ou de um teste automatizado.

## Verificações executadas pela frente pedagógica

Em 2026-10-27, o agente de pedagogia leu os módulos em elaboração na worktree exclusiva do implementador, sem alterá-los. Uma verificação Node com `node:assert/strict` confirmou:

- tetos por missão iguais a `[10, 15, 20, 15, 20, 10, 10]` e soma 100;
- 33 IDs de critérios únicos, todos presentes no contrato documental;
- estado vazio com 0 XP e status “Não iniciada”;
- estado vazio em cada uma das duas trilhas com 0 XP e teto 100.

Também foi executado `git diff --check` na documentação, sem erro. São verificações do contrato e do rascunho observado; não substituem a suíte independente sobre um SHA integrado. Não foram executados por esta frente testes completos de interface, navegadores, acessibilidade ou PDF. O relatório de QA deve registrar essas execuções e seus limites.
