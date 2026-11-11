# Aula 08 — guia pedagógico da versão com caso concreto visível

**Disciplina:** Prática Profissional Integrada I (IFMA Itapecuru-Mirim, 2026.2). **Público-alvo:** segundo ano do Técnico em Informática Integrado. **Duração de referência:** 50 minutos. **Natureza dos dados:** exclusivamente didática e fictícia. **Status:** revisão em branch, condicionada à QA; não substitui automaticamente plano SUAP ou avaliação formal.

## 1. Problema pedagógico corrigido

A revisão foi motivada por falhas identificadas na aula em 11/11/2026:

- O slide sobre **o que é requisito** apresentava seis itens numerados que, na verdade, eram um possível percurso de análise. A lista aparecia como se fizesse parte da definição. **A tela 4 agora distingue uma definição, um requisito concreto e uma frase vaga; a evolução da análise é ensinada em telas próprias.**
- A aula mencionava **uma ficha, um dicionário e um dossiê**, sem mostrar artefatos consultáveis. **A tela 3 agora apresenta efetivamente uma tabela com seis linhas em cada trilha.** A tabela pode ser reaberta nas missões e pela barra superior.
- Os exemplos mudavam o volume de dados para 100 registros sem fornecer uma base. **Os testes e critérios usam os seis itens exibidos**, inclusive o requisito de desempenho proposto.
- Siglas e identificadores apareciam antes dos conceitos. **A linguagem natural vem primeiro.** Códigos internos são explicados pelo glossário e não precisam ser memorizados.

O botão **Ver dados e evolução** abre a tabela e a sequência de decisões criadas pela própria aula. Não existe documento externo a encontrar. O botão **Entenda os códigos** serve apenas de apoio.

## 2. Material concreto da tela 3

### Trilha Memórias — acervo totalmente inventado

| Código | Tema | Título fictício | Revisado? |
| --- | --- | --- | --- |
| R01 | festa | Relato inventado A | Sim |
| R02 | festa | Relato inventado B | Sim |
| R03 | festa | Relato inventado C | Não |
| R04 | trabalho | Relato inventado D | Sim |
| R05 | trabalho | Relato inventado E | Sim |
| R06 | paisagem | Relato inventado F | Não |

**Observação apoiada nesta tabela:** existem três registros de festa, dois de trabalho e um de paisagem. **Hipótese:** filtrar por tema talvez facilite a consulta. **Pendência:** confirmar essa necessidade com partes interessadas autorizadas em uma situação real. **Critério de aceitação do filtro:** escolher festa deve exibir R01, R02 e R03 e manter os seis registros originais.

### Trilha Permanência — tabela totalmente inventada, sem dados individuais

| Linha | Período | Categoria fictícia | Quantidade fictícia | Revisado? |
| --- | --- | --- | ---: | --- |
| L01 | P1 (período 1) | Transporte | 8 | Sim |
| L02 | P1 (período 1) | Material | 5 | Sim |
| L03 | P1 (período 1) | Apoio pedagógico | 7 | Não |
| L04 | P2 (período 2) | Transporte | 6 | Sim |
| L05 | P2 (período 2) | Material | 4 | Sim |
| L06 | P3 (período 3) | Apoio pedagógico | 9 | Não |

**Observação apoiada na tabela:** há três linhas P1, duas P2 e uma P3. **Hipótese:** consultar por período talvez ajude a comparar categorias de apoio. **Pendência:** confirmar a tarefa com uma equipe autorizada. **Critério de aceitação:** escolher P1 deve exibir L01, L02 e L03 sem excluir as demais linhas.

As quantidades são números inventados. Não representam alunos, diagnósticos de evasão, dados oficiais, fontes institucionalmente aprovadas ou resultados de visita. Uma linha agregada é um registro da tabela, não um estudante.

**Regra didática adicional:** para praticar proteção, a tabela possui a coluna Revisado?. O filtro interno pode listar qualquer linha; a publicação simulada só admite linhas marcadas Sim. Esta política foi inventada para o exercício.

## 3. Distinção fundamental de conceitos

**Requisito:** em paráfrase compatível com ISO/IEC/IEEE 29148:2018 e as definições históricas apresentadas no material docente de Pfleeger e de Nuseibeh/Easterbrook, é uma condição ou capacidade necessária para satisfazer um objetivo ou uma necessidade. Na linguagem da turma: algo que o sistema deve fazer ou respeitar e que precisa ser suficientemente claro para avaliar.

A definição responde **o que é requisito**; não é uma lista de etapas. A passagem da evidência ao requisito é uma **atividade de Engenharia de Requisitos**, ensinada separadamente com exemplos:

- **Evidência:** a tabela sintética que é mostrada e pode ser consultada.
- **Achado:** conclusão circunscrita àquela tabela, como três registros de festa.
- **Hipótese:** possível utilidade do filtro, ainda sem validação com usuários reais.
- **Necessidade candidata:** localizar registros sem percorrer todos.
- **Requisito de usuário:** serviço esperado pela pessoa, formulado de forma compreensível.
- **Requisito funcional:** filtrar por tema ou período sem alterar a coleção.
- **Requisito não funcional:** condição de teclado ou tempo de resposta proposta.
- **Requisito de dados:** valores aceitos no campo usado no filtro.
- **Regra de negócio fictícia:** somente itens revisados podem ser publicados.
- **Critério de aceitação:** dado/quanto/então com os mesmos seis registros.
- **Verificação:** conferir se o filtro executa exatamente o especificado.
- **Validação:** avaliar se a solução resolve uma necessidade real — ainda pendente.

**Alerta pedagógico:** passar no teste com registros inventados não valida a utilidade do sistema para pessoas reais.

## 4. Matriz de progressão das 26 telas

| Tela | Objetivo / pré-requisito | Evidência de aprendizagem |
| --- | --- | --- |
| 01 | Apresentar tarefa e produto sem mencionar documento oculto | Aluno consegue dizer o que produzirá |
| 02 | Contextualizar as duas histórias fictícias | Entende quem usaria a consulta e o problema a investigar |
| 03 | Mostrar material completo do caso, antes das missões | Lê seis registros e identifica categorias |
| 04 | Definir **requisito** com literatura e contraexemplo; sem enumeração gratuita | Explica o conceito e reconhece a obrigação de filtrar |
| 05 | Diferenciar fonte, achado, hipótese e pendência usando a tela 3 | Classifica afirmações com limites |
| 06 | Distinguir observação de necessidade candidata | Identifica a pergunta que requer validação |
| 07 | Missão 1 — aplicar o que foi ensinado nas telas 03–06 | Respostas justificadas e feedback |
| 08 | Ensinar necessidade, requisito de usuário e requisito de sistema | Relaciona níveis no mesmo problema |
| 09 | Exemplo guiado da transformação para comportamento do sistema | Lê a mesma obrigação em três níveis |
| 10 | Missão 2 — praticar níveis de especificação | Identifica necessidade e obrigação |
| 11 | Funcional versus não funcional no mesmo filtro | Distingue comportamento e condição de uso |
| 12 | Dados e regra de negócio na tabela existente | Reconhece valores e política fictícia |
| 13 | Clareza, consistência e verificabilidade | Propõe resultado esperado a partir da tabela |
| 14 | Missão 3 — classificar RF, RNF, dados e regra | Aplica os conceitos ensinados |
| 15 | Tornar desempenho mensurável sem base de dados oculta | Reconhece meta proposta e condições de teste |
| 16 | Acessibilidade e proteção, com coluna Revisado? | Explica duas verificações distintas |
| 17 | Missão 4 — revisar exigências vagas | Seleciona especificação verificável |
| 18 | Criar critério de aceitação para os seis registros | Prediz exatamente quais IDs aparecem |
| 19 | Delimitar prioridades para a primeira entrega | Justifica escopo mínimo |
| 20 | Missão 5 — aceitar, revisar frase vaga e priorizar | Distingue função e desempenho |
| 21 | Ensinar rastreabilidade e apontar explicitamente para a tabela e as decisões | Retorna do critério à fonte |
| 22 | Verificação versus validação do mesmo exemplo | Reconhece que necessidade real segue pendente |
| 23 | Missão 6 — selecionar cadeia coerente | Conecta fonte, necessidade, requisito e teste |
| 24 | Produzir catálogo mínimo local | Redige funcional, qualidade e dados, com origem e critério |
| 25 | Revisar por pares sem confundir com nota oficial | Identifica falhas e pendências |
| 26 | Sintetizar o caso e explicar a continuidade para modelagem | Relata a transformação completa |

### Ritmo orientativo para uma aula de 50 minutos

Retomada e tabela: **7 min**; conceito e interpretação: **8 min**; missões com explicações intercaladas: **20 min**; catálogo e revisão: **10 min**; síntese: **5 min**. O ritmo deve ser validado em sala; não é tempo medido.

## 5. Regras de qualidade pedagógica e técnica

1. Uma referência deve ser **mostrada antes** de ser usada como fonte de resposta. As duas tabelas são renderizadas integralmente na tela 3.
2. Toda missão deve permitir consultar a tabela **sem abandonar a questão**.
3. Toda afirmação quantitativa das telas deve estar calculável a partir das seis linhas mostradas; nenhuma segunda base invisível pode ser usada.
4. Toda regra fictícia deve permanecer explicitamente **fictícia**. Não inventar coleta, visita, aval comunitário ou confirmação institucional.
5. A definição de requisito deve ser distinguida do processo de Engenharia de Requisitos, com bibliografia e exemplo.
6. Toda sigla técnica deve ter nome legível; os códigos preservam rastreabilidade interna, não são pré-requisito de aprendizagem.
7. A versão para 1280×720, 1280×650, 390×844 e 320 px deve manter conteúdo visível; a tabela deve ter cabeçalhos acessíveis, sem rolagem horizontal indevida.
8. As 26 telas e as seis missões devem preservar **100 XP formativos**, sem nota oficial automática; as respostas abertas dependem de revisão humana.
9. O esquema JSON e a exportação voluntária, offline e local devem permanecer válidos.
10. QA automatizada inclui sequência pedagógica, existência dos dados, pré-requisitos antes de exercícios e ausência de fontes não exibidas. Uma validação pedagógica real ainda exige teste presencial.

## 6. Referências efetivamente utilizadas

- ISO/IEC/IEEE 29148:2018, *Life cycle processes — Requirements engineering*. https://www.iso.org/standard/72089.html.
- IEEE Computer Society, *SWEBOK Guide v4*, área *Software Requirements*. https://www.computer.org/education/bodies-of-knowledge/software-engineering.
- NUSEIBEH, B.; EASTERBROOK, S. *Requirements Engineering: A Roadmap*, 2000.
- PFLEEGER, S. L. Definição de requisito (2004), conforme material docente da disciplina fornecido no projeto.
- SOMMERVILLE, I. *Engenharia de Software*, 8. ed., Pearson, 2007.
- Materiais docentes anexados: *ES_Etapa_Analise.pdf*, *ES_Engenharia_Requisitos_parte_2.pdf* e *ES_02_Processo_Desenvolvimento_Software_Parte1.pdf*.

As formulações são paráfrases didáticas. Não se declara certificação normativa. O plano institucional e a cobertura anterior do semestre não foram modificados.
