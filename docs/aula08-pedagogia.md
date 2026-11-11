# Aula 08 — especificação pedagógica e matriz de rastreabilidade

Versão: **1.0.0**. Data de elaboração: **10/11/2026**. Disciplina: **Prática Profissional Integrada I**, IFMA Campus Itapecuru-Mirim, 2º ano do Técnico em Informática Integrado, 2026.2.

> **Revisão pedagógica (11/11/2026):** a aula usa agora duas tabelas de seis registros efetivamente renderizadas, antes de qualquer missão. O conceito de requisito é apresentado separadamente do processo de análise. [Guia pedagógico com as tabelas, os exemplos e os critérios de QA](aula08/GUIA_DOSSIE_PROGRESSIVO.md). O esquema JSON e os 100 XP permanecem; nenhuma coleta real, submissão institucional ou nota oficial é criada.\n\n## 1. Produto e fronteira

A apresentação “Da evidência ao requisito” oferece 26 telas, seis missões formativas e um rascunho local de catálogo mínimo: **1 RF, 1 RNF verificável e 1 requisito de dados**, cada qual ligado a uma fonte sintética ou hipótese marcada como pendente. O catálogo é uma atividade de aprendizagem e não uma ficha avaliativa formal.

A Aula 07 publicada apresenta entrevista, observação, documentos, ética, evidências e hipóteses. Seu contrato pedagógico reserva a formalização de RF/RNF/dados para a Aula 08. Esse encaixe foi conferido no README, no arquivo docs/aula07-revisao-2026-10-27.md e em docs/specs/aula07-ficha/CONTRATO_PEDAGOGICO.md. Publicação não comprova que a aula foi ministrada.

**Não há nova autorização de coleta, contato com comunidade, uso de dados pessoais, inferência de evasão individual ou submissão externa.** As fontes EV-M01 e EV-P01 correspondem às tabelas sintéticas efetivamente exibidas na tela 3; os outros requisitos são propostas formuladas nas telas seguintes, sem fingir documentos externos. Os prefixos M e P identificam trilhas, nunca pessoas. A atividade não solicita nomes ou matrículas.

### Proposta de replanejamento, sem alteração institucional

O plano anexado, rotulado DRAFT_WITH_PENDING, prevê para **11/11/2026** modelo lógico, normalização, dicionário e proveniência, com PPI1-4A. A Aula 08 propõe antes disso a formalização de requisitos, para criar uma base explícita para a modelagem posterior. **É uma proposta de replanejamento pedagógico; não representa aprovação no SUAP, alteração de avaliação ou confirmação de execução de aulas.** O arquivo do plano não foi editado.

## 2. Objetivos e critérios de aprendizagem

| Objetivo | Evidência de aprendizagem | Critério observável |
| --- | --- | --- |
| O1 — Interpretar registros com limites | Respostas da M1 e explicação oral | Distinguir registro de conclusão, hipótese e pendência. |
| O2 — Passar da necessidade à especificação | M2 e RF do catálogo | Explicar para quem e para quê; definir comportamento verificável. |
| O3 — Diferenciar tipos e domínio | M3 e catálogo RF/RNF/RD | Classificar pelo foco e reconhecer política fictícia sem alegar norma real. |
| O4 — Tornar qualidade verificável | M4 e RNF do catálogo | Explicitar condição, procedimento e resultado; separar obrigações. |
| O5 — Definir aceite e priorizar | M5 e critérios do catálogo | Usar Dado/Quando/Então com dados conhecidos; justificar o escopo mínimo. |
| O6 — Preservar rastreabilidade | M6 e fontes do catálogo | Relacionar fonte, achado, necessidade, requisito e critério, mantendo pendências. |

As categorias são didáticas e podem se relacionar: uma regra do domínio pode gerar RFs, RNFs e restrições de dados. A aula não apresenta a divisão em quatro categorias como taxonomia exclusiva da ISO. A ISO/IEC/IEEE 29148 orienta conceitualmente a passagem de necessidades para requisitos; a ISO/IEC 25010 orienta a especificação e a avaliação da qualidade de produto. Não se declara certificação ou conformidade integral com normas.

## 3. Sequência pedagógica e cronograma

**Regra da versão revisada:** a fonte que fundamenta as perguntas aparece integralmente na **tela 3**. A definição conceitual de requisito é ensinada na **tela 4** sem misturar uma lista de passos. As demais telas aplicam os conceitos sempre ao **mesmo conjunto de seis registros**, que pode ser consultado sem abandonar o slide atual. O botão **Ver dados e evolução** mostra a tabela e as decisões efetivamente construídas na aplicação; não há material externo oculto.

| Etapa | Minutos de referência | Execução |
| --- | ---: | --- |
| Contextualização e leitura da fonte (01–03) | 7 | Mostrar as duas trilhas e estudar a tabela fictícia |
| Conceitos comentados intercalados (04–06 e ao longo da aula) | 8 | Explicar sem siglas preliminares ou fontes não exibidas |
| Seis missões contextualizadas (07, 10, 14, 17, 20, 23) | 20 | Feedback imediato e possibilidade de consultar a tabela |
| Catálogo e revisão por pares (24–25) | 10 | Escrever função, qualidade e dados com origem e teste |
| Síntese (26) | 5 | Defender a cadeia do caso e registrar pendências |

Este tempo é planejamento, **não uma duração efetivamente medida**. Caso a discussão seja mais longa, a turma pode concluir o catálogo na atividade orientada, sem eliminar explicações fundamentais.

### Objetivo explícito de cada tela

| Tela | Título exibido | Objetivo e pré-requisito |
| --- | --- | --- |
| s01 | Da observação ao requisito | Apresentar um caso completo e um produto concreto |
| s02 | Que problema vamos investigar? | Delimitar contexto, papel e pergunta do caso |
| s03 | Esta é a tabela do nosso exercício | Exibir a tabela de seis registros antes das perguntas |
| s04 | Afinal, o que é um requisito? | Definir requisito e mostrar um contraexemplo, sem passos soltos |
| s05 | O que é fato e o que é interpretação? | Ensinar evidência, achado, hipótese e pendência com a tabela |
| s06 | Um dado não vira requisito automaticamente | Explicitar diferença entre observação e necessidade candidata |
| s07 | Leia a tabela e classifique | Missão 1: classificar informações já apresentadas |
| s08 | Qual é o objetivo de quem usa? | Ensinar necessidade, serviço esperado e obrigação de sistema |
| s09 | Um exemplo completo, três níveis | Comparar três níveis do mesmo exemplo |
| s10 | Da necessidade à função | Missão 2: identificar necessidade e obrigação |
| s11 | O que o sistema faz? Como deve funcionar? | Distinguir funcional de não funcional no mesmo filtro |
| s12 | Quais dados serão usados? Que regra respeitar? | Definir dados e política fictícia a partir das colunas mostradas |
| s13 | Como escrever sem gerar dúvidas? | Revisar redação, origem e resultado testável |
| s14 | Diferencie os tipos de requisito | Missão 3: classificar requisitos do próprio caso |
| s15 | “Rápido” não é uma medida | Transformar desempenho vago em meta proposta com seis itens |
| s16 | O mesmo filtro precisa ser acessível e seguro | Testar teclado e política de publicação usando Revisado? |
| s17 | Torne a qualidade verificável | Missão 4: identificar qualidade mensurável |
| s18 | Como saber se o filtro ficou correto? | Critério Dado/Quando/Então com IDs e linhas exibidos |
| s19 | O que é essencial agora? | Priorizar a primeira entrega do filtro |
| s20 | Escolha o teste e a prioridade | Missão 5: aceitar, separar obrigações e priorizar |
| s21 | Como explicar de onde veio o requisito? | Explicar a rastreabilidade sem um arquivo externo oculto |
| s22 | Verificar não é o mesmo que validar | Distinguir teste do requisito da validação da necessidade |
| s23 | Ligue fonte, requisito e teste | Missão 6: encadear a mesma fonte e o mesmo teste |
| s24 | Escreva os requisitos do seu caso | Produzir rascunho local de três tipos de requisitos |
| s25 | Outra pessoa consegue testar seu requisito? | Revisar coerência do catálogo com os registros |
| s26 | Da tabela ao requisito que podemos testar | Sintetizar o caso e justificar o que é verificável |

As seis missões preservam **17 perguntas por trilha** e **100 XP formativos**. A pontuação é treino, não avaliação oficial. Os campos livres exigem julgamento humano e não possuem correção semântica confiável.

## 4. Contrato de XP e avaliação

| Domínio | Resultado | Limite |
| --- | --- | --- |
| Treino dos slides | 0–100 XP por trilha | Somente as seis missões objetivas; não equivale a nota. |
| Completude do catálogo/laboratório | Presença e relações estruturais | Não comprova verdade, qualidade ou autorização. |
| Avaliação qualitativa docente | Pendente de ato humano externo | Não é inferida por comprimento, palavras-chave ou checklist. |
| Nota oficial | Não calculada nesta aula | Não reaproveita PPI1-3B, PPI1-4A nem qualquer fórmula do SUAP. |

A missão concede seu peso **uma única vez quando todas as suas respostas estão corretas**. Erros recebem explicação específica e permitem nova tentativa sem punição. Cada missão tem reinício independente, que remove os XP correspondentes. Trocar de trilha não transporta respostas ou XP; cada contexto tem estado próprio. Abrir slides, carregar exemplos e preencher perguntas abertas não concede XP. Não existem ranking, telemetria ou identificação compulsória.

| Missão | XP | Questões | Objetivo |
| --- | ---: | ---: | --- |
| M1 — Separe as pistas | 10 | 4 | Distinguir achado, evidência, hipótese e pendência. |
| M2 — Da necessidade ao sistema | 15 | 2 | Relacionar o objetivo do usuário à especificação do sistema. |
| M3 — Classifique com precisão | 20 | 4 | Diferenciar RF, RNF, requisito de dados e regra de negócio. |
| M4 — Qualidade que se verifica | 15 | 2 | Escolher RNFs mensuráveis de desempenho, acesso e proteção. |
| M5 — Aceite e prioridade | 20 | 3 | Definir Dado/Quando/Então, reduzir ambiguidade e priorizar. |
| M6 — Feche o rastro | 20 | 2 | Relacionar evidência, achado, necessidade, requisito e critério. |

**Total: 100 XP; 17 questões por trilha.** Os mesmos IDs de pergunta são contextualizados por track_id. As versões content=1.0.0, criteria=1.0.0 e answerKey=1.0.0 fixam o conjunto didático. Mudanças no significado ou gabarito exigem nova versão e estratégia explícita para rascunhos anteriores.

## 5. Matriz pergunta → objetivo → evidência → critério

A origem executável dos enunciados, opções, gabaritos e justificativas é content.js. A tabela abaixo foi extraída dessa mesma versão. Em uma resposta errada, a aplicação explica especificamente a alternativa escolhida; a coluna “Gabarito” fixa a alternativa correta.

| Pergunta | Trilha | Objetivo | Evidência de referência | Critério | Gabarito |
| --- | --- | --- | --- | --- | --- |
| a08.m1.q1.v1 | memorias | Distinguir evidência de interpretação. | EV-M01 | Identifica o registro consultável e seu limite. | B |
| a08.m1.q2.v1 | memorias | Reconhecer um achado sustentado. | EV-M01 | Relaciona a conclusão ao registro que a sustenta. | A |
| a08.m1.q3.v1 | memorias | Manter incerteza explícita. | HIP-M01 | Não promove uma suposição a fato. | C |
| a08.m1.q4.v1 | memorias | Registrar uma pendência de validação. | PEND-M01 | Identifica o que falta e não fabrica confirmação. | D |
| a08.m2.q1.v1 | memorias | Distinguir necessidade do usuário de solução. | NEC-M01 | Seleciona o objetivo da pessoa sem impor tecnologia. | C |
| a08.m2.q2.v1 | memorias | Especificar comportamento do sistema. | RF-M01 | Define operação, objeto e limite de efeito. | A |
| a08.m3.q1.v1 | memorias | Classificar RF. | RF-M01 | Reconhece o comportamento solicitado. | A |
| a08.m3.q2.v1 | memorias | Classificar RNF. | RNF-M01 | Reconhece uma condição de qualidade verificável. | B |
| a08.m3.q3.v1 | memorias | Classificar requisito de dados. | RD-M01 | Distingue domínio do campo de função e política. | C |
| a08.m3.q4.v1 | memorias | Classificar regra do domínio sem inventar norma real. | RN-M01 | Reconhece a política e mantém sua natureza fictícia. | D |
| a08.m4.q1.v1 | memorias | Tornar desempenho mensurável. | RNF-M02 | Inclui condição, carga, métrica, limite e repetição. | B |
| a08.m4.q2.v1 | memorias | Especificar acesso e proteção sem promessas absolutas. | RNF-M01 / RNF-M03 | Escolhe condições observáveis e separa duas obrigações no catálogo. | C |
| a08.m5.q1.v1 | memorias | Selecionar um critério Dado/Quando/Então. | EV-M01 → CA-M01 | Inclui dados conhecidos, ação e resultado exato. | A |
| a08.m5.q2.v1 | memorias | Detectar ambiguidade e múltiplas obrigações. | REV-M01 | Divide obrigações e pede definições verificáveis. | B |
| a08.m5.q3.v1 | memorias | Priorizar um escopo mínimo responsável. | MVP-M01 | Preserva o propósito e as proteções no recorte. | C |
| a08.m6.q1.v1 | memorias | Montar cadeia de rastreabilidade. | EV-M01 | Relaciona os cinco elos sem inventar confirmação. | B |
| a08.m6.q2.v1 | memorias | Revisar fonte, requisito e critério em conjunto. | EV-M01 / HIP-M01 | Preserva resultado verificável e incerteza contextual. | A |
| a08.m1.q1.v1 | permanencia | Distinguir evidência de interpretação. | EV-P01 | Identifica o registro consultável e seu limite. | B |
| a08.m1.q2.v1 | permanencia | Reconhecer um achado sustentado. | EV-P01 | Relaciona a conclusão ao registro que a sustenta. | A |
| a08.m1.q3.v1 | permanencia | Manter incerteza explícita. | HIP-P01 | Não promove uma suposição a fato. | C |
| a08.m1.q4.v1 | permanencia | Registrar uma pendência de validação. | PEND-P01 | Identifica o que falta e não fabrica confirmação. | D |
| a08.m2.q1.v1 | permanencia | Distinguir necessidade do usuário de solução. | NEC-P01 | Seleciona o objetivo da pessoa sem impor tecnologia. | C |
| a08.m2.q2.v1 | permanencia | Especificar comportamento do sistema. | RF-P01 | Define operação, objeto e limite de efeito. | A |
| a08.m3.q1.v1 | permanencia | Classificar RF. | RF-P01 | Reconhece o comportamento solicitado. | A |
| a08.m3.q2.v1 | permanencia | Classificar RNF. | RNF-P01 | Reconhece uma condição de qualidade verificável. | B |
| a08.m3.q3.v1 | permanencia | Classificar requisito de dados. | RD-P01 | Distingue domínio do campo de função e política. | C |
| a08.m3.q4.v1 | permanencia | Classificar regra do domínio sem inventar norma real. | RN-P01 | Reconhece a política e mantém sua natureza fictícia. | D |
| a08.m4.q1.v1 | permanencia | Tornar desempenho mensurável. | RNF-P02 | Inclui condição, carga, métrica, limite e repetição. | B |
| a08.m4.q2.v1 | permanencia | Especificar acesso e proteção sem promessas absolutas. | RNF-P01 / RNF-P03 | Escolhe condições observáveis e separa duas obrigações no catálogo. | C |
| a08.m5.q1.v1 | permanencia | Selecionar um critério Dado/Quando/Então. | EV-P01 → CA-P01 | Inclui dados conhecidos, ação e resultado exato. | A |
| a08.m5.q2.v1 | permanencia | Detectar ambiguidade e múltiplas obrigações. | REV-P01 | Divide obrigações e pede definições verificáveis. | B |
| a08.m5.q3.v1 | permanencia | Priorizar um escopo mínimo responsável. | MVP-P01 | Preserva o propósito e as proteções no recorte. | C |
| a08.m6.q1.v1 | permanencia | Montar cadeia de rastreabilidade. | EV-P01 | Relaciona os cinco elos sem inventar confirmação. | B |
| a08.m6.q2.v1 | permanencia | Revisar fonte, requisito e critério em conjunto. | EV-P01 / HIP-P01 | Preserva resultado verificável e incerteza contextual. | A |

### Gabaritos comentados

As letras são iguais entre as duas trilhas porque o objetivo de cada pergunta é equivalente. Os enunciados, registros, necessidades e resultados esperados são contextualizados e não se misturam.

| Pergunta | Resposta correta — síntese | Justificativa |
| --- | --- | --- |
| a08.m1.q1.v1 | B: Evidência | A ficha/tabela identificada é a evidência do exercício. Ela permite conferir a coleção fictícia, mas não retrata uma comunidade ou turma real. |
| a08.m1.q2.v1 | A: Achado | O achado resulta da leitura da evidência. A conclusão limita-se ao conjunto examinado. |
| a08.m1.q3.v1 | C: Hipótese | “Talvez” sinaliza uma explicação a testar. O conteúdo não foi validado pela existência da tabela. |
| a08.m1.q4.v1 | D: Pendência | A validação ainda necessária vira pendência. Não é preciso inventar uma resposta para continuar o rascunho. |
| a08.m2.q1.v1 | C: Quem consulta precisa localizar relatos do tema escolhido. | A necessidade explica para quê a solução existe. A implementação é detalhada depois, com validação. |
| a08.m2.q2.v1 | A: O sistema deve exibir os relatos do tema selecionado sem alterar a coleção original. | O requisito deve traduzir a necessidade em comportamento ou condição verificável, evitando detalhes de implementação desnecessários. |
| a08.m3.q1.v1 | A: RF · requisito funcional | Exibir a seleção é uma função do sistema. O requisito também evita o efeito indevido de apagar a fonte. |
| a08.m3.q2.v1 | B: RNF · requisito não funcional | A condição define como a função deve poder ser utilizada e permite um teste de teclado. |
| a08.m3.q3.v1 | C: RD · requisito de dados | O item define obrigatoriedade e valores permitidos de um campo. No catálogo didático, isso é requisito de dados. |
| a08.m3.q4.v1 | D: RN · regra de negócio | É uma política criada para o exercício, não uma norma real do IFMA ou de uma comunidade. Ela pode existir mesmo numa organização em papel. |
| a08.m4.q1.v1 | B: Com 100 registros sintéticos carregados, responder em até 1 s em cada uma de 10 execuções no computador e navegador de referência documentados. | A meta é fictícia e proposta. Registrar o ambiente e validar a viabilidade faz parte do requisito; o enunciado não prova que o desempenho foi alcançado. |
| a08.m4.q2.v1 | C: Testar a filtragem só com teclado, foco visível e sem bloqueio. Na saída pública simulada, permitir apenas id, título e tema dos itens revisados; omitir os itens restritos. | Cada condição deve virar um RNF separado no catálogo: uma para acesso por teclado e outra para minimização/proteção da saída. |
| a08.m5.q1.v1 | A: Dado o acervo EV-M01 com 6 relatos, quando selecionar festa, então exibir exatamente os 3 relatos desse tema e manter os 6 na coleção original. | Dado/Quando/Então organiza um exemplo verificável. A quantidade esperada vem da base de teste identificada. |
| a08.m5.q2.v1 | B: Separar listar e gerar em dois requisitos; definir o período de “recente” e o conteúdo esperado do relatório com a fonte. | Clareza, singularidade e verificabilidade trabalham juntas. Se a fonte não definir o período, registre a pendência. |
| a08.m5.q3.v1 | C: Consulta por tema, proteção da saída e uso por teclado; adiar animações decorativas. | Prioridade considera valor, risco, esforço e dependências. Requisitos essenciais de acesso e proteção precisam entrar no recorte. |
| a08.m6.q1.v1 | B: EV-M01 → ACH-M01 → NEC-M01 → RF-M01 → CA-M01. | O rastro deve permitir seguir do teste ao requisito e voltar à fonte, inclusive quando algum elo é uma hipótese pendente. |
| a08.m6.q2.v1 | A: Usar EV-M01 para testar 3 relatos ao escolher festa; manter a hipótese de utilidade pendente de validação. | Um dado pode sustentar o resultado esperado de um teste sem validar a necessidade em todos os contextos. A revisão humana identifica esse limite. |

## 6. Casos e registros sintéticos

### Memórias

EV-M01 descreve seis relatos inventados: três do tema festa, dois de trabalho e um de paisagem. A filtragem por festa deve exibir três, preservando os seis originais. EV-M02 define o domínio de valores do campo tema; EV-M03 contém um roteiro fictício de teste por teclado. HIP-M01 propõe a utilidade do filtro, ainda pendente. RN-M01 é uma política fictícia de revisão antes da saída pública, sem pretender falar por lideranças ou comunidades.

### Permanência

EV-P01 descreve seis linhas **agregadas e inteiramente fabricadas**: três no período P1, duas em P2 e uma em P3. O filtro P1 deve exibir três e preservar as seis. EV-P02 define o domínio de período; EV-P03 contém o roteiro fictício por teclado. HIP-P01 propõe a utilidade da consulta para planejar apoio, sem declarar impacto ou causa. RN-P01 restringe a saída do exercício a agregados revisados. Não há previsão de abandono, classificação de estudantes, notas, frequências ou critérios institucionais inventados.

### Observações de precisão

- A evidência sustenta um achado dentro de limites; não é prova universal nem prova de causalidade.
- Uma solicitação sugere uma solução; uma dúvida pode tornar-se pendência. Nenhuma delas vira requisito validado automaticamente.
- A meta de 1 segundo, 100 registros e 10 execuções é uma **proposta fictícia de RNF**, a ser negociada e testada. Não é resultado de medição da aula.
- Acessibilidade e proteção são ensinadas com procedimentos observáveis; não se promete segurança absoluta.
- O filtro é especificado para preservar a fonte. O exemplo não autoriza baixar nem importar dados reais.
- Uma IA pode apoiar a revisão e também pode inventar. Sua resposta não substitui fonte ou validação humana.

## 7. Oficina, revisão e ticket de saída

Na tela 24, a equipe escreve três itens do catálogo. Cada item deve registrar descrição, fonte ou hipótese, situação da fonte, prioridade e critério de aceitação. Para um RNF, explicitar condição/procedimento e resultado verificável. A tela 25 pede revisão por pares: procurar a fonte, tentar o teste, identificar a ambiguidade e registrar uma melhoria ou uma pendência real.

O ticket de saída da tela 26 pergunta qual requisito o estudante consegue rastrear e qual hipótese ainda precisa validar. É reflexão aberta, sem correção semântica automática. A autoavaliação e a marcação de presença de campos não comprovam domínio, consentimento ou validade dos requisitos.

Rubrica qualitativa orientadora, destinada a professor ou pares:

| Aspecto | Pergunta de revisão humana | Evidência para conversar |
| --- | --- | --- |
| Necessidade | O requisito atende um objetivo sustentado, sem inventar usuário ou demanda? | Fonte e justificativa. |
| Clareza e singularidade | Há sentido único e uma obrigação principal? | Texto do item e possível divisão. |
| Verificabilidade | Outra dupla executaria o mesmo teste e reconheceria o resultado? | Dado/Quando/Então e condições do RNF. |
| Consistência e viabilidade | O item combina com os dados/regras e cabe no escopo? | RD, política fictícia e prioridade. |
| Ética e incerteza | Dados são sintéticos e pendências continuam visíveis? | Origem, status e revisão humana. |

Esta rubrica não atribui nota nem acrescenta XP. O arquivo JSON e a impressão são exportações voluntárias locais, sem envio ao Apps Script.

## 8. Fontes e decisões de adaptação

Consulta realizada por conectores em 10/11/2026. Os dois links do Google apontam para arquivos **PowerPoint armazenados no Drive**, não para apresentações nativas do Google Slides. O conector get_presentation_text retornou HTTP 400 com essa indicação; a leitura de texto por Drive fetch funcionou para ambos. Nenhum arquivo foi convertido ou alterado.

| Fonte | Trechos usados | Decisão de adaptação |
| --- | --- | --- |
| [Da coleta à análise — 19 slides](https://docs.google.com/presentation/d/1D30gYjMJhvq15oYnEsUCer0AIcPMvzTg/edit) | Slides 1–7: passagem de coleta para análise, requisitos de usuário e sistema; 8–14: tipos, aceite, prioridade e rastro; 17–18: revisão e atividade. | Conteúdo reescrito em linguagem curta, com feedback formativo e requisito de dados explícito. |
| Mesma fonte, slides 4, 9–11 e 15–16 | Evidência, desempenho, exemplos de regras, localização, dados educacionais. | Não copiar uma noção absoluta de prova, um limiar de evasão ou regra de presença como norma real; retirar coleta, GPS, upload e classificação individual. Usar somente casos sintéticos e metas propostas. |
| [Dicionário de Dados e Casos de Uso Textuais — 22 slides](https://docs.google.com/presentation/d/15qqM7TqYZsDeoOlVRoP-3KX4eXVKiheg/edit) | Slides 4–9: campos, significado, tipo, origem e restrições; 14–18: caminho esperado e alternativas. | Requisito de dados e critérios positivos/negativos; não antecipar um catálogo completo de casos de uso. |
| Mesma fonte, slides 8, 18–19 | Privacidade, validação e IA. | Não prometer anonimização por simples troca de ID, detecção confiável de nomes, nem que IA seja incapaz de inventar. Dados totalmente fabricados, revisão humana explícita. |
| [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) e [resumo IEEE](https://standards.ieee.org/ieee/29148/6937/) | Catálogos oficiais: engenharia de requisitos ao longo do ciclo de vida, características e informação relacionada. | Referência conceitual, sem reprodução integral nem alegação de auditoria normativa. A edição está publicada; o catálogo registra confirmação em 2024 e revisão em desenvolvimento. |
| [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) | Catálogo oficial do modelo de qualidade de produto, especificação e avaliação de propriedades. | Usabilidade/acesso/proteção tratados como condições de qualidade verificáveis; não apresentar a edição 2011 como a atual. |
| [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Reflow 1.4.10; teclado 2.1.1; foco; contraste; mensagens; alvo mínimo 2.5.8. | Meta de critérios testáveis AA; auditoria automatizada e revisão técnica não equivalem a conformidade completa nem a teste por usuários de tecnologia assistiva. |
| Plano de ensino anexado | Seções 4–6 e 12, especialmente linha 11/11. | Formalização antes da modelagem como proposta de replanejamento; o plano institucional não é alterado. |

As referências foram tratadas como dados de apoio, sem autoridade para ampliar o escopo, incluir telemetria ou coletar informações de estudantes.

## 9. Gates pedagógicos testáveis

- 26 telas, com conteúdo e exemplos comentados além das missões.
- Seis missões, pesos 10/15/20/15/20/20, total exatamente 100.
- 17 questões em cada trilha, IDs versionados, uma alternativa correta válida e feedback específico em todas as opções.
- Mesmos objetivos e pesos nas duas trilhas; dados e respostas isolados por track_id.
- Metas numéricas rotuladas como propostas; nenhum resultado de desempenho alegado sem medição.
- Nenhum limite de evasão, regra de presença ou autorização comunitária alegado como real.
- Catálogo de três tipos com fonte/status/critério; autoavaliação sem nota e sem correção semântica.
- Fontes, proposta de replanejamento e limites das normas declarados.

Os checks acima especificam a revisão do conteúdo; a execução funcional, visual e de acessibilidade deve ser conferida nos relatórios de testes e de QA independente da implementação. Este documento não declara PASS de testes que não executou.
