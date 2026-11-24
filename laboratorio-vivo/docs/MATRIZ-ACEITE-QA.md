# Matriz de requisitos, aceite e evidências

A coluna de evidência indica o que precisa existir; não declara execução. Resultados efetivos pertencem ao relatório de testes/QA independente e ao recibo da execução. Teste puro, mock, readback de Sheets e round-trip Web App são evidências distintas.

| ID | Requisito/risco | Aceite verificável | Evidência/gate |
| --- | --- | --- | --- |
| R01 | Preservar fontes | Título, abas, IDs/propriedades e permissões permanecem; zero chamadas de escrita às fontes | Manifestos antes/depois F0/F6 |
| R02 | Novos recursos distintos | Os quatro IDs são distintos e os dois novos têm título/ambiente corretos | Readback Drive/Sheets F2/F3 |
| R03 | QA derivado da nova estrutura | Source da cópia é a nova produção saneada; sem conteúdo de Web/PPI antiga | Recibo de cópia F3 |
| R04 | Isolamento de backend | Projetos/properties/bindings exclusivos; alvo ambíguo bloqueado | Teste negativo + readback F4/F5 |
| R05 | Produção vazia | Sem equipes, participantes, submissões, avaliações ou notas; flags false | Contagens/intervalos limitados F2/F6 |
| R06 | Catálogo/rubricas versionados | Rejeitar versão sobrescrita, critério desconhecido e soma inconsistente | Testes de catálogo F4 |
| R07 | Identidade confiável | Sessão vazia e cliente forjando papel/equipe não obtêm acesso | Negativos + sessão real F4/F5 |
| R08 | Escopo de leitura | Alfa não lê respostas/notas de Beta; docente só com papel autorizado | Testes cruzados F4/F5 |
| R09 | Rascunho/envio | Rascunho incompleto permitido; envio incompleto recusado; recibo server-side | Testes de fluxos F4/F5 |
| R10 | Idempotência | Mesmo request/ator/operação/payload: NO_OP e uma submissão | Contagens + recibo igual F4/F5 |
| R11 | Conflito determinístico | Payload alterado com mesmo request: CONFLICT sem sobrescrever | Registro de Conflitos F4/F5 |
| R12 | Concorrência | Escritas usam lock; prazo de lock e stale revision falham explicitamente | Mock adversarial + QA conectado |
| R13 | Falha parcial | Não há sucesso falso; ledger/linhas retornam estado reconciliável | Injeção de falhas F4, readback F5 |
| R14 | Formula/CSV injection | =,+,-,@ e prefixos de espaço/controle permanecem texto | Round-trip células/export F4/F5 |
| R15 | Unicode/tipos/limites | Aceitar português/Unicode válido; rejeitar malformado, excessivo e tipos desconhecidos | Testes de validador F4 |
| R16 | Separar XP e nota | XP100 ou preenchimento não altera item oficial; slide XP não entra | Teste de regras F4 |
| R17 | Nota docente | Valores não aprovados ausentes do quadro oficial; plano/versão/ref obrigatórios | Testes de projeção F4/F5 |
| R18 | N3/N4 | Máximos iniciais2/3/5 e2/4/4; total10 só com três aprovados; versão dinâmica | Fórmulas e testes F2/F4 |
| R19 | N1/N2 ausentes | Nenhuma média anual, nota inventada ou zero automático | Inspeção schema e testes F4 |
| R20 | Import/export íntegro | Versão, estrutura, tamanho e hash antes do envio; import não autentica | Testes JSON e UI F4 |
| R21 | Auditoria mínima | Eventos sem respostas, tokens, e-mails ou IDs privados em logs públicos | Inspeção de código/artefatos F4 |
| R22 | Fuso | Apps Script e planilha America/Fortaleza; timestamps emitidos pelo servidor | Readback/config e testes |
| R23 | Acessibilidade/responsividade | Critérios abaixo e alternativas offline verificadas | QA UI F4/F5 |
| R24 | Integração Aula08 | Contrato provisório explícito; sem afirmar merge inexistente | Contrato e inspeção main F0/F4 |
| R25 | Ativação controlada | Sem link transacional aos alunos até segurança, privacidade, QA e autorização | Gate F7 |

## Checklist de interface — meta WCAG 2.2 AA

| Área | Verificação | Evidência mínima |
| --- | --- | --- |
| Reflow | 320 CSS px sem perda de conteúdo/função e sem rolagem horizontal da página | Screenshot e dimensões; tabelas com alternativa adequada |
| Viewports | 1280×720,1280×650,390×844 e320 CSSpx | Capturas/inspeção responsiva |
| Teclado | Tab/ShiftTab/Enter/Espaço; ordem previsível; sem armadilha | Roteiro manual registrado |
| Foco | Indicador visível e controles focados não ocultos | Navegação real |
| Nomes/rótulos | Inputs com label; erros associados; títulos e landmarks | DOM/árvore acessível |
| Feedback | Carregando, vazio, erro, rascunho e recibo distinguíveis; status anunciado | Testes de estado + leitor de tela |
| Contraste | Texto normal≥4,5:1; texto grande≥3:1; componentes≥3:1 quando aplicável | Cálculo/inspeção das cores |
| Alvos | Tamanho/afastamento conforme2.5.8; preferência operacional por44px | Medição real |
| Zoom | 200% texto e400% equivalente a320px mantendo funções | Inspeção manual |
| Impressão/PDF | Campos/estado legíveis sem botões soltos e sem corte de conteúdo | Preview de impressão |
| JSON offline | Exportar/importar, rejeitar arquivo alterado, manter distinção sem recibo | Teste real em navegador |

Um scanner automatizado não comprova sozinho conformidade WCAG2.2AA nem experiência com leitor de tela. Resultado humano não executado deve constar NOT_RUN. Fonte: [WCAG2.2](https://www.w3.org/TR/WCAG22/).

## Gates e status final

| Gate | Deve demonstrar | Bloqueio se ausente |
| --- | --- | --- |
| F0 | Inventário e proteção das fontes; main/tecnologia/contrato | Não escolher destinos por aproximação |
| F1 | Schema, fluxos, ameaças, acesso e aceite | Núcleo sem contrato fica indisponível |
| F2 | Nova produção, readback, proteção/validação, vazia | Não afirmar criação sem ID verificado |
| F3 | Nova QA copiada da estrutura nova, fixtures segregadas | Não copiar dados antigos |
| F4 | Código, testes e QA independente | Não chamar mock de homologação conectada |
| F5 | /exec real, identidade, submit/receipt/readback/replay/conflito/revisão | NOT_RUN se falta projeto/OAuth/deploy |
| F6 | Preservação fontes e reconciliação recursos/manifestos | Divergências são resolvidas antes de liberar |
| F7 | CI/QA/privacidade/autorização e link verificado | Só orientação/contingência até aprovação |

`PPI_LAB_CONNECTED_QA_PASS` exige F5 real; `PPI_LAB_PRODUCTION_READY` exige todos os gates e autorização; `PPI_LAB_PARTIAL_CHAT_FIRST` indica recursos/código entregues com Apps Script/deploy bloqueado; `BLOCKED_SPECIFIC` identifica a ação/superfície impedida.
