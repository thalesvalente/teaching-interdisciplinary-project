# Aula 07 — revisão independente de aderência pedagógica

Data: 2026-10-27. Revisor: agente nativo `pedagogia`, sem escrita em implementação ou testes. Escopo: confronto do contrato, conteúdo, modelo, rubrica, exportações e interface com a missão autorizada. Esta revisão não substitui a QA técnica, a inspeção visual por navegador nem o aceite docente.

## Checkpoint inicial examinado

Leitura dos arquivos em elaboração na worktree exclusiva `ppi-implementacao`, diretório `lessons/aula-07-da-pergunta-a-evidencia/ficha/`. Ainda sem SHA de produto congelado nesse checkpoint. Para identificar os conteúdos observados:

| Arquivo | SHA-256 observado |
| --- | --- |
| `content.js` | `500afe242d1f77b1cda6444726bef2e32a5e79bc0c3b101318e8b0f3217eec7a` |
| `rubric.js` | `fc0b5063a90618af301c9d96387839bee292e3c16b7d25685c439e59f28d680e` |
| `export.js` | `abdf8560e28500ae85f4b2e039a3c8f1e1c3a65a23c036db284f945d09b0ab86` |

Também foram lidos `model.js`, `index.html` e as regras de impressão de `ficha.css`. `app.js` e `papel.html` ainda não estavam disponíveis no primeiro checkpoint; a revisão desses arquivos depende do handoff de implementação.

## Aderências observadas

- `content.js` inclui as duas trilhas com cenários explicitamente sintéticos e sem nomes, matrículas, notas, frequências ou localidades reais.
- Mapa de Memórias contempla autoria, versões divergentes, validação comunitária, visibilidade, locais sensíveis e consentimento para imagem/voz.
- EDA/Permanência contempla decisão pedagógica, significado local de permanência/retenção/evasão, origem/responsável/periodicidade, dados ausentes, associação versus causalidade, acesso restrito e proibição de ranking punitivo.
- `rubric.js` possui os 33 critérios do contrato, com tetos 10/15/20/15/20/10/10. M4 pede decisão textual; M5 limita o teto sem revisão; M7 conta integrantes por IDs e não pelo texto do nome.
- O fechamento exibido previamente não pontua sozinho; a finalidade precisa ser registrada.
- `model.js` limpa o conteúdo investigativo e a autoria ao trocar de trilha, preservando identificação compatível. Remover integrante limpa seus vínculos e não desloca a autoria dos demais.
- Tela inicial, Markdown e impressão distinguem nota automática, revisão docente pendente e nota oficial PPI1-3B não calculada.
- Os blocos de necessidades candidatas permanecem pendentes de validação e mencionam a formalização na Aula 08.
- Impressão parcial preserva campos e lista critérios pendentes. A versão em branco não copia nomes ou respostas da equipe observada.

## Findings encaminhados ao implementador e coordenador

| ID | Severidade | Evidência/reprodução | Correção solicitada | Estado final desta revisão |
| --- | --- | --- | --- | --- |
| PED-01 | Média | `renderPrint()` exibia somente `m.max` no título da missão e `c.weight` no critério. O total aparecia, mas faltavam XP ganhos por missão e frações de autoria. | Exibir `m.xp / m.max` e `c.earned / c.weight` no documento preenchido/parcial; manter pesos em branco. | Corrigido em `801c9d0`; código relido. |
| PED-02 | Média | `printSections(source, true)` criava exatamente quatro blocos de autoria e identificação, mesmo com seis integrantes cadastrados. Reprodução Node: seis integrantes; quatro blocos `7 · Autoria individual`. | Gerar ao menos o número de integrantes cadastrados, sem conservar nomes/respostas, ou fornecer mecanismo explícito de extensão manual equivalente. | Corrigido em `801c9d0`; código usa `Math.max(4, source.members.length)`. |
| PED-03 | Baixa | Na versão em branco, confirmação de revisão individual e declaração apareciam apenas como “Pendente”, sem controle ou linha manual explícitos. | Oferecer caixa/linha para marcar a confirmação no papel. | Corrigido em `801c9d0`; caixas explícitas nas duas declarações. |
| PED-04 | Baixa | `m2-reasons` exigia técnica principal core e justificativas, mas aceitava complementar repetindo a principal. O contrato usa escolhas válidas como pré-condição. | Exigir complementar distinta e enum válido também na condição de justificativas, sem tornar presença dos demais campos pré-condição oculta. | Corrigido em `801c9d0`; distinção, enums e unicidade conferidos. |
| PED-05 | Média | `renderEvidence()` marcava todos os campos dos cartões adicionais como obrigatórios em `validateMission()`, enquanto a rubrica exige três classes mínimas completas. Três cartões completos e um adicional vazio podiam produzir conclusão no status e erro no botão de conferência. | Alinhar validação de cartões opcionais à rubrica; manter indicação compreensível de cartões iniciados incompletos, sem mudar pesos ou impedir exportação parcial. | Corrigido e relido em `a52869e`: cartões adicionais opcionais; ajuda explica completude necessária para pontuar. |
| PED-06 | Baixa | `questionWarning()` aplicava a heurística de sim/não ao fechamento obrigatório “Há algo importante que não perguntamos?”. Isso poderia levar à alteração do texto prescrito e perda do critério. | Fornecer ajuda específica para o fechamento e orientar o aprofundamento da resposta sem apresentar o texto prescrito como problema. | Corrigido e relido em `a52869e`: ajuda específica convida ao aprofundamento. |
| PED-07 | Baixa | A versão em branco mostrava “Não informado” no uso de IA, sem alternativa manual para declarar não uso. | Inserir caixas “Não utilizamos IA” e “Usamos IA e registramos abaixo” no documento em branco e em `papel.html`. | Corrigido em `9281ac1`; reprodução focal Node confirmou ambas as opções. |

Foi encaminhada ainda uma recomendação de clareza contextual: manter rótulo de avaliação da equipe, XP de completude e revisão docente pendente próximo às missões longas, para que a separação de notas não dependa de retornar ao topo. Não se recomendou barra fixa que pudesse cobrir campos.

## Verificação específica executada

Uma execução Node carregou `model.js`, `rubric.js` e `export.js`, criou seis integrantes inteiramente sintéticos e completou a autoria de apenas um. Resultado observado: `1.6666666666666665` XP em M7, quatro blocos de autoria na versão em branco e nenhum nome sintético preservado no documento em branco. Essa execução reproduz PED-02 e confirma o caráter proporcional da autoria; não é teste de paginação ou de PDF.

## Limites e revalidação

Os achados iniciais se referem aos hashes acima, observados antes do commit da implementação. Os fechamentos foram verificados nos checkpoints registrados abaixo. Os testes dos navegadores, acessibilidade, rede, responsividade e geração/inspeção visual dos PDFs pertencem à frente de QA.

## Primeira revalidação — implementação funcional

Checkpoint real informado e conferido: SHA `801c9d011c521501f24d34300c1fcddd8bec79b5`, árvore `a09c629a3a482fbf85aff411abaf94b38506b26c`.

Foram relidos `export.js`, `rubric.js` e o novo `app.js`. PED-01 a PED-04 foram corrigidos pelo implementador, sem intervenção do revisor nos arquivos de produto. A interface contém os campos previstos, mostra contexto avaliativo em cada missão e distingue novamente os três resultados no resumo. Acrescenta explicação de que XP não autoriza coleta ou publicação, confirma exclusão/reponderação de autoria e esclarece o uso de cenários sintéticos ou cartões docentes autorizados.

A leitura do novo fluxo revelou PED-05 e PED-06, encaminhados ao implementador e à coordenação. A versão estática em papel ainda estava em geração nesse checkpoint, de modo que o parecer permaneceu pendente até a segunda revalidação.

Uma reprodução focal Node após as primeiras correções confirmou PED-02/PED-03/PED-04: seis integrantes geram seis blocos em branco sem copiar os nomes, as duas confirmações têm caixas manuais e técnica complementar duplicada não obtém os 5 XP de justificativas. A mesma combinação com técnica complementar distinta e justificativas preenchidas obtém 5 XP.

## Segunda revalidação — interface e versão em papel

Checkpoint examinado: SHA `a52869e00e6fcb7863c72321daa69c64defcf9fe`, árvore `6cd9b78106550b1571ecd578d12205afff13b53a`.

- `app.js` não exige os campos de cartões extras como se fossem novos critérios obrigatórios. A ajuda esclarece que cartões adicionais são opcionais e que o registro precisa estar completo para pontuar nas três classes mínimas.
- `questionWarning()` reconhece o fechamento prescrito e orienta a convidar a pessoa a acrescentar algo/aprofundar a resposta. Não apresenta mais a pergunta exigida como alerta de sim/não.
- `papel.html` apresenta as duas trilhas, cenários e cuidados, os mesmos 33 critérios, o fechamento, o registro opcional de IA, o gate ético, teste/revisão, três cartões de evidência, necessidades candidatas e quatro blocos individuais de autoria.
- Uma verificação de conteúdo Node comparou os rótulos das **25 seções** retornadas por `printSections(estadoVazio, true)` com o HTML estático: **nenhum rótulo ausente**. Também confirmou os dois cenários e a orientação de ampliar autoria para equipes maiores.
- A prévia em branco mantém pelo menos quatro espaços e acompanha a quantidade cadastrada. A versão estática orienta copiar a seção de autoria ou gerar a quantidade necessária pelo modo interativo.
- A impressão parcial sem integrantes contém espaços de autoria; o quadro parcial com menos de três registros contém espaços remanescentes. Essas áreas para preenchimento manual não alteram XP nem inventam respostas.

Esse checkpoint revelou apenas PED-07, reparado em seguida pelo implementador.

## Fechamento da revisão pedagógica

Checkpoint final revalidado: SHA **`9281ac1880940e5c9a4eb170ede9970d66c3c27e`**, árvore **`d8efdff413c56e548e10ca44145cc5d8cb9c1068`**.

PED-07 foi conferido por leitura do diff e execução focal Node sobre `printSections()` e `papel.html`; ambos contêm as caixas de uso e não uso de IA. As correções não mudaram pesos ou a independência da nota oficial.

**Parecer: PASS de aderência pedagógica ao contrato, no escopo e checkpoints descritos.** Sete findings foram encaminhados e corrigidos; nenhum finding pedagógico crítico, alto, médio ou baixo permanece aberto nesta revisão. A automação continua limitada a completude/processo, as duas trilhas mantêm a mesma rubrica e a avaliação oficial permanece dependente de revisão humana e da etapa curricular seguinte.

Este PASS é revisão independente do produto e dos registros estruturados/textuais. **Não é aceite do professor, certificação WCAG, avaliação visual dos PDFs ou resultado da suíte técnica.** A coordenação deve combinar este parecer com a QA independente sobre a árvore integrada e preservar o gate humano antes de qualquer merge/publicação.
