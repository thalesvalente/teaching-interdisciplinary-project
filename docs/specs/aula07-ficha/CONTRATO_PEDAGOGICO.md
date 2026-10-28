# Aula 07 — contrato pedagógico e de pontuação

Missão: `PPI-A07-FICHA-AVALIATIVA-IMPLEMENT-MA-01`. Versão do contrato: **1.0.0**. Data: 2026-10-27.

## 1. Produto e alcance

**Ficha Avaliativa — Aula 07: Da pergunta à evidência.** Produto: **Protocolo de Elicitação Testado — versão 1**.

A ficha registra a investigação da equipe, o teste do protocolo e a autoria individual. A automação verifica presença, opções válidas e relações estruturais. Não verifica se a resposta é verdadeira, tecnicamente adequada, eticamente suficiente ou autorizada. Esses juízos pertencem à revisão humana.

São admitidas duas trilhas, com a mesma estrutura e rubrica: **Mapa de Memórias Quilombolas** e **EDA/Permanência Estudantil**. A escolha muda ajuda, exemplos e cenário; não muda pesos nem quantidade mínima de produtos.

Aviso obrigatório na tela e nos documentos exportados:

> Pontuação automática de completude e processo. A qualidade técnica e ética permanece sujeita à revisão docente.

## 2. Fontes verificadas e precedência

| ID | Fonte | Localização e fato usado |
| --- | --- | --- |
| F01 | Repositório no início da missão | `thalesvalente/teaching-interdisciplinary-project`, SHA `dc5ed18ebdab8dea9035f56a8f3bdedb2520af68`, árvore `c517e16770ed329ad7353571279b2b1072b8e3d3`. |
| F02 | Ficha da Aula 06 | `lessons/aula-06-etica-protecao-dados/FICHA_PROTOCOLO.md`, seções “Ficha: XP de preparação”, “Impressão, PDF e rascunho” e “Decisões pedagógicas e proteção de dados”; `ficha.js`, declaração `MISSIONS` e `XP_DESCRIPTION`. Precedente de cálculo pelo preenchimento atual, exportação parcial e revisão docente. |
| F03 | Aula 07 | `lessons/aula-07-da-pergunta-a-evidencia/index.html`, slides `s05`, `s08`–`s09`, `s11`–`s13`, `s15`–`s16`, `s18`, `s20`, `s22`–`s24` e `s26`. Seis missões/100 XP de treino independentes, técnicas centrais, seis famílias, triangulação, registro investigativo, ética e IA. |
| F04 | Plano de ensino anexado | `plano_ensino_pratica_profissional_integrada_i_2026_2_suap(1).md`, seções 4–6, 8.1–8.2 e 12. Cabeçalho e fechamento declaram `DRAFT_WITH_PENDING`. SHA-256 do arquivo disponibilizado: `a118dc407ef3b287cc9a8c080520695baadff14559af4452435146d471b17655`. |
| F05 | Missão aprovada para execução nesta conversa | `PPI-A07-FICHA-AVALIATIVA-IMPLEMENT-MA-01(1).md`, blocos CONTEXTO, DADOS §§2–9 e SAIDA. SHA-256: `df2a37fc47fdd5ccf44f74f6f4c263121c88399453ec3d647b77b4fa16899d7e`. |
| F06 | Anexo citado, indisponível nesta execução | `Pasted text(7).txt` não foi disponibilizado. Nenhum conteúdo lhe é atribuído. |

Os paths de F02/F03 se referem a F01. A decisão operacional de F05 exige nova ficha separada e não autoriza editar os slides. O plano permanece rascunho; esta entrega não aprova calendário, composição de avaliação nem cadastro SUAP.

Links para a base: [ficha da Aula 06](https://github.com/thalesvalente/teaching-interdisciplinary-project/blob/dc5ed18ebdab8dea9035f56a8f3bdedb2520af68/lessons/aula-06-etica-protecao-dados/FICHA_PROTOCOLO.md) e [Aula 07](https://github.com/thalesvalente/teaching-interdisciplinary-project/blob/dc5ed18ebdab8dea9035f56a8f3bdedb2520af68/lessons/aula-07-da-pergunta-a-evidencia/index.html).

## 3. Três resultados distintos

| Resultado | Escala | O que significa | Limite |
| --- | --- | --- | --- |
| XP dos slides | 0–100, seis missões | Treino formativo sem identificação. | Não compõe, importa nem soma à ficha. |
| XP e nota automática da ficha | 0–100 XP; nota `XP / 10`, uma casa decimal | Completude e registro do processo desta atividade em sete missões. | Não certifica qualidade, consentimento, autorização ou domínio individual. |
| Revisão docente | Pendente; conclusão depende de ato humano externo | Análise técnica, ética, autoria e adequação das evidências. | Concluir a ficha não conclui a revisão. Não há autenticação docente nem certificação nesta aplicação. |
| Nota oficial PPI1-3B | Até 3,0 no plano fornecido | Composição do instrumento curricular, com dimensão individual. | **Não é calculada automaticamente por esta ficha.** |

F04 §8.2 registra para PPI1-3B: técnica/evidência **1,0**, RF/RNF/dados **1,0**, rastreabilidade/ética **0,6** e autoria individual **0,4**. Essa composição não é a rubrica automática abaixo. A Aula 07 termina no protocolo testado, quadro de evidências e necessidades candidatas. A formalização em RF, RNF e requisitos de dados pertence à Aula 08. A ficha não preenche o componente de catálogo por aproximação nem converte sua nota para 3,0.

## 4. Regras comuns do motor

1. A fonte executável de verdade é o módulo de rubrica versionado da ficha. Esta especificação descreve os mesmos critérios; não cria uma segunda implementação.
2. Um texto só está registrado quando `trim()` não fica vazio. Comprimento, palavras-chave e eloquência não dão pontos adicionais nem comprovam qualidade. Opções padrão e valores fora do enum não pontuam.
3. Cada critério abaixo recebe seu peso quando a condição observável estiver completa, salvo M7, calculada proporcionalmente por autoria. Campos agrupados são explicitados na rubrica visível, sem bônus ocultos.
4. Exemplos, placeholders, categorias sugeridas, abertura de telas e fechamento pré-exibido não pontuam sozinhos. O estudante precisa registrar as respostas e finalidades correspondentes.
5. A soma dos tetos é invariável: `10 + 15 + 20 + 15 + 20 + 10 + 10 = 100`. Não redistribuir pesos em função das missões respondidas ou da trilha.
6. Toda edição, remoção, importação ou reset recalcula a partir das respostas atuais. Um arquivo importado nunca determina a nota.
7. A importação valida versão, estrutura, limites, IDs e vínculos antes de substituir dados. Erros preservam a ficha atual.
8. Nome da equipe, data, trilha, integrantes/papéis, declaração de privacidade e link opcional não dão XP. Erros de identificação continuam pendentes e impedem “Completa para revisão”, mesmo com 100 XP.
9. Estado sem respostas é “Não iniciada”; registro parcial é “Em andamento”; “Completa para revisão” exige **100 XP, identificação mínima válida e ausência de erro estrutural**. Nenhum status equivale a autorização para coleta ou publicação.
10. O progresso ponderado deriva de XP/100. A nota é XP/10 e a exibição tem uma casa decimal. Arredondamento de exibição não transforma resposta pendente em completa.
11. JSON, Markdown e impressão permitem respostas parciais e listam as pendências. A ficha em branco apresenta todos os campos e os mesmos pesos, com espaço para escrita.
12. Não há ranking, bônus por uso de IA, comparação pública entre integrantes nem submissão automática.

## 5. Critérios estáveis

### Missão 1 — Definir a descoberta: 10 XP

| ID | XP | Registro observável |
| --- | ---: | --- |
| `m1-objective` | 2 | O que a equipe precisa descobrir, formulado como dúvida/objetivo da coleta. |
| `m1-need` | 2 | Por que essa informação é necessária. |
| `m1-decision` | 2 | Que decisão do projeto depende dela. |
| `m1-source` | 2 | Quem ou qual fonte pode responder, sem identificar terceiros reais. |
| `m1-assumption` | 2 | O que ainda é suposição; ausência de suposição precisa ser declarada e explicada. |

### Missão 2 — Escolher as técnicas: 15 XP

| ID | XP | Registro observável |
| --- | ---: | --- |
| `m2-main` | 5 | Técnica principal entre entrevista, observação e análise documental, com fonte, finalidade, evidência esperada, limitação e responsável válido. |
| `m2-complement` | 5 | Ao menos uma técnica complementar distinta da principal. Todas as complementares selecionadas registram fonte, finalidade, evidência esperada, limitação e responsável. Questionário é permitido aqui. |
| `m2-reasons` | 5 | Justificativa registrada para a técnica principal e para cada complementar selecionada; existência de escolhas válidas é pré-condição. |

Responsáveis referenciam integrantes por IDs estáveis; renomear alguém preserva o vínculo. Remover alguém não transfere sua autoria/responsabilidade para o próximo da lista: vínculos afetados ficam pendentes até nova decisão.

### Missão 3 — Construir o protocolo: 20 XP

| ID | XP | Registro observável |
| --- | ---: | --- |
| `m3-interview` | 6 | De seis a oito perguntas totais, todas com texto, categoria válida e finalidade preenchidos. |
| `m3-categories` | 1 | As perguntas completas cobrem contexto, pessoas/participantes, processo, problema, resultado e validação. Categoria isolada sem pergunta/finalidade não conta. |
| `m3-closing` | 1 | Fechamento aberto explícito “Há algo importante que não perguntamos?” presente no roteiro e com finalidade registrada pela equipe. |
| `m3-observation` | 6 | Oito registros: atividade; início/fim; pessoas/papéis; ferramentas; transferências; esperas/atrasos/retrabalho/improvisos; formal versus prática; registro de fatos sem julgamento. |
| `m3-document` | 6 | Nove registros: fonte; autoria/responsabilidade; data/versão; finalidade original; termos/campos; regras; lacunas/ambiguidades; restrições; perguntas não respondidas. |

**Decisão de contagem:** o fechamento faz parte do total de seis a oito perguntas. O roteiro inicial oferece sete posições: seis famílias e fechamento. Pode-se acrescentar uma oitava. Como cada pergunta tem uma categoria, completar simultaneamente as seis famílias e o fechamento requer sete ou oito registros. Seis perguntas podem ser guardadas como rascunho parcial; a interface não inventa equivalência semântica entre categorias.

Alertas de pergunta fechada, dupla, indutiva ou acusatória orientam a revisão. Não concedem nem retiram XP por um suposto julgamento automatizado de conteúdo. O registro opcional de IA oferece “Não utilizamos IA” sem perda; quando declarada, documenta ferramenta, finalidade, prompt sanitizado, resumo, aceites/rejeições/correções e validação humana. Saída de IA não vira evidência da realidade.

### Missão 4 — Gate ético e de proveniência: 15 XP

| ID | XP | Registro observável |
| --- | ---: | --- |
| `m4-consent` | 3 | Situação de autorização, explicação do objetivo e possibilidade de recusa, acompanhadas das decisões ou pendências registradas. |
| `m4-minimize` | 3 | Decisões sobre necessidade de gravação, presença de dados pessoais e substituição por dados seguros, com justificativa e mitigação correspondentes. |
| `m4-access` | 3 | Quem pode acessar e quem valida a interpretação. |
| `m4-provenance` | 3 | Como citar a fonte e o que não pode ser publicado. |
| `m4-ai-risk` | 3 | Decisão sobre colocar conteúdo em IA e registro do risco/mitigação aplicável. |

Um clique em “sim” ou “não” não satisfaz um grupo que pede decisão/mitigação. Registrar “pendente” com encaminhamento é pedagogicamente legítimo e não autoriza prosseguir em campo. A automação não atesta que existe consentimento válido ou que a mitigação é suficiente. “Não utilizamos IA” no registro opcional não dispensa decidir no gate ético se o conteúdo pode ou não ser compartilhado com uma ferramenta.

### Missão 5 — Testar o roteiro: 20 XP

| ID | XP | Registro observável |
| --- | ---: | --- |
| `m5-scenario` | 4 | Tipo sintético/cartão autorizado, cenário utilizado e papéis dos integrantes no teste. A autorização é declaração de origem, não atestação automática. |
| `m5-questions` | 4 | Perguntas que funcionaram, confundiram e induziram; se nada foi observado em alguma dimensão, registrar a ausência e sua razão. |
| `m5-findings` | 4 | Informação sensível percebida e contradição encontrada, ou registro explícito contextualizado de ausência. |
| `m5-difficulty` | 4 | Dificuldade de tempo/compreensão observada ou registro contextualizado de ausência. |
| `m5-revision` | 4 | Alteração explícita após teste, justificativa e versões antes/depois ou síntese da mudança. |

Sem revisão registrada, o teto desta missão é **16 XP**. A automação confere o registro da alteração; o professor julga se ela foi pertinente e se o teste ocorreu. Não fabricar problema, sensibilidade ou contradição para obter pontos.

### Missão 6 — Quadro de evidências: 10 XP

Cada cartão possui ID estável, registro bruto, fonte, classificação válida, confiança alta/média/baixa com justificativa, quem valida, relação com a dúvida central e restrição de uso/publicação. “Fonte preenchida” não significa fonte confirmada pela aplicação.

| ID | XP | Registro observável |
| --- | ---: | --- |
| `m6-finding` | 2 | Ao menos um cartão completo classificado como achado e com fonte registrada. |
| `m6-hypothesis` | 2 | Ao menos um cartão completo classificado como hipótese não confirmada. |
| `m6-pending` | 2 | Ao menos um cartão completo classificado como pendência. |
| `m6-limit` | 2 | Divergência/limitação explicitamente registrada; se o cenário não a contiver, justificar a ausência. Não apagar divergências presentes no cenário. |
| `m6-needs` | 2 | Necessidade candidata registrada em bloco separado, rotulado como pendente de validação e destinado à futura formalização na Aula 08. |

“Evidência” é uma classificação permitida, além das três classes mínimas. Não há coluna formal de RF/RNF nem requisito formal implicitamente aprovado.

### Missão 7 — Autoria individual: 10 XP

| ID | Máximo | Registro por integrante |
| --- | ---: | --- |
| `m7-contribution` | 2 | Contribuição realizada. |
| `m7-improvement` | 2 | Pergunta ou decisão que ajudou a melhorar. |
| `m7-risk` | 2 | Risco ético ou técnico identificado. |
| `m7-learning` | 2 | Algo que ainda precisa aprender. |
| `m7-reviewed` | 2 | Confirmação de que revisou o resultado da equipe. |

Se `N` é a quantidade de integrantes cadastrados e ativos, cada critério recebe `2 × quantidade de registros completos daquele critério / N`. Com `N = 0`, todos recebem zero. O máximo permanece 10; cada integrante completo contribui com `10/N` para a missão. A tela mostra completude individual sem ranking. Arredondar somente a apresentação numérica, preservando o cálculo e o estado de completude.

Adicionar integrante aumenta o denominador; a missão pode perder pontos até que a nova autoria seja preenchida. Remover integrante exige confirmação, remove apenas seu registro e repondera os restantes; não comprova que essa pessoa deixou de participar. Essa limitação exige revisão docente da composição da equipe. Apagar um nome não pode apagar silenciosamente a autoria nem retirar o registro ativo do denominador.

## 6. Equivalência das trilhas

| Dimensão | Mapa de Memórias Quilombolas | EDA/Permanência Estudantil | Invariante avaliado |
| --- | --- | --- | --- |
| Dúvida/decisão | Preservação, autoria, versão e visibilidade de uma memória fictícia. | Decisão pedagógica e significado local de indicadores sintéticos. | Mesmos cinco registros da descoberta. |
| Fontes/técnicas | Fala simulada, prática de registro e documento fictício. | Fala simulada, fluxo de atualização e documento/tabela sintética. | Uma técnica principal, complemento e justificativas. |
| Protocolo | Seis famílias contextualizadas; validação comunitária e publicação coletiva. | Seis famílias contextualizadas; origem, periodicidade e validação humana. | Mesma contagem de perguntas, observação e auditoria documental. |
| Ética | Imagem/voz, autoria coletiva, locais sensíveis, níveis de visibilidade. | Acesso restrito, minimização, agregação/anonimização e uso não punitivo. | Mesmas decisões e justificativas do gate, 15 XP. |
| Teste | Cartão explicitamente fictício sem relato, nome ou localização real. | Cartão explicitamente sintético sem matrícula, frequência ou nota real. | Papéis, achados do teste e revisão explícita. |
| Evidências | Versões divergentes e validação comunitária pendente. | Campos ausentes/inconsistentes; associação não comprova causalidade. | Achado, hipótese, pendência, limitação e necessidade candidata. |
| Autoria | Contribuições de cada integrante. | Contribuições de cada integrante. | Mesmas cinco dimensões e fórmula. |

Trocar de trilha preserva apenas identificação acadêmica compatível. Respostas da investigação, teste, evidências e autoria vinculada ao conteúdo exigem limpeza confirmada ou armazenamento separado claramente identificado. É proibido transportar respostas incompatíveis silenciosamente ou ganhar XP pela troca. Rascunho exportado antes da troca permite preservar o percurso anterior.

## 7. Exemplos de recálculo

- Estado inicial e campos apenas com espaços: **0 XP; nota 0,0**.
- Descoberta completa: **10 XP; nota 1,0**. Apagar a fonte de M1: **8 XP; nota 0,8**.
- Todas as missões registradas, exceto revisão do teste: **96 XP; nota 9,6**, com M5 pendente.
- Duas autorias cadastradas, uma completa e outra vazia: M7 = **5/10 XP**. Completar a segunda: **10/10 XP**.
- Importar o mesmo conjunto de respostas com um número de XP adulterado produz a mesma nota calculada das respostas; o número adulterado não tem autoridade.
- Chegar a **100 XP** não calcula PPI1-3B, não conclui revisão docente e não elimina pendência de identificação.

## 8. Gate pedagógico G1

O contrato satisfaz G1 quando os tetos somam exatamente 100, as duas trilhas usam os mesmos critérios, M4 exige decisões, M5 exige revisão, M7 preserva autoria por ID e nenhuma formulação promete correção semântica. O cumprimento pelo produto exige verificação do módulo, interface e exportações; o contrato sozinho não é prova de execução, acessibilidade ou aprovação docente.
