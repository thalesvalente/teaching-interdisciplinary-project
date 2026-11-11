# Aula 08 — guia docente e dossiê progressivo (revisão pedagógica)

**Status:** proposta para revisão, sem publicação. **Baseline:** Aula 08 v1.0.0 (PR #10, `f38d70ffc20eb5bb00465456992a8c7b8bcc28f9`). **Natureza:** sequência didática sintética, com duas trilhas espelhadas. **Duração planejada:** 50 minutos.

## 1. Diagnóstico e fundamento da revisão

A primeira versão tinha boa cobertura de classificação, seis missões operacionais e catálogo com exportação, mas deixava a definição formal de requisito implícita e apresentava alguns exemplos genéricos sem ancoragem suficiente no mesmo problema. A versão revisada mantém o motor de treino, 26 telas, 17 questões por trilha e 100 XP formativos, mas **troca exemplos pontuais por um dossiê em construção** (D0–D11), cujo histórico fica disponível em **Dossiê e fontes**.

### Conceitos com autoria e fonte

| Conceito | Definição operacional apresentada à turma | Origem e ressalva |
| --- | --- | --- |
| Requisito | Declaração que traduz uma necessidade e explicita suas condições e restrições relevantes | Paráfrase de **ISO/IEC/IEEE 29148:2018, §3.1.19**; `https://www.iso.org/obp/ui?_escaped_fragment_=iso:std:iso-iec-ieee:29148:ed-2:v1:en`. |
| Engenharia de Requisitos | Atividades inter-relacionadas de elicitação, análise, especificação, verificação, validação, negociação, gestão e evolução de requisitos | ISO/IEC/IEEE 29148:2018; **Nuseibeh; Easterbrook (2000)**, *Requirements Engineering: A Roadmap*; SWEBOK v4.0a. |
| Definição alternativa | Requisito como característica do sistema ou capacidade necessária para alcançar objetivos; também pode ser entendido como propriedade do software necessária para enfrentar um problema | Síntese de **Pfleeger (2004)** e **SWEBOK (2004)** nas apresentações docentes `ES_Etapa_Analise.pdf`; fontes históricas, não cópia textual da obra. |
| Necessidade | Resultado ou problema da parte interessada, contextualizado em uma tarefa | Distinção didática que antecede requisitos; não equivaler automaticamente a solução já escolhida. |
| Requisito de usuário | Serviço ou resultado esperado, descrito em linguagem compreensível às pessoas do domínio | *ES_Etapa_Analise.pdf*, seção “Visões de Requisitos”; ISO 29148. |
| Requisito de sistema/software | Obrigação funcional ou restrição detalhada o suficiente para verificação | *ES_Etapa_Analise.pdf*, seção “Visões de Requisitos”; SWEBOK v4. |
| Requisito funcional (RF) | Serviço, comportamento ou transformação que o sistema deve executar | Sommerville, *Engenharia de Software*; SWEBOK v4; apresentação docente “Classificação dos Requisitos”. |
| Requisito não funcional (RNF) | Propriedade ou restrição do produto, cujo atendimento deve ser definido em condições avaliáveis | SWEBOK v4; ISO/IEC 25010:2023 fornece um modelo de qualidade de produto, não uma lista pronta de requisitos para qualquer projeto. |
| Requisito de dados (RD) | Significado, origem, domínio, obrigatoriedade e qualidade dos dados usados pela solução | Categoria didática **complementar**, não uma quarta categoria oficial exclusiva da ISO 29148. |
| Regra de negócio (RN) | Política do domínio aplicável mesmo sem a solução informatizada; pode originar RF, RD ou RNF | Conceito de modelagem do domínio; não confundir com requisito de software. |
| Verificação | Conferir conformidade da solução com a especificação escrita | Materiais docentes de processos e Engenharia de Requisitos. |
| Validação | Conferir se a solução e seus requisitos atendem à necessidade correta | Materiais docentes de processos e ISO 29148. |
| Rastreabilidade | Relação verificável entre fonte, necessidade, requisitos, critérios e mudanças | ISO 29148 e SWEBOK v4. |

**Nota terminológica:** a ISO/IEC 25010:2023 usa nove características do modelo de qualidade e revisa nomes usados na edição de 2011 (por exemplo, *interaction capability*). Não atribuir à norma um limite de um segundo ou uma política inventada para este exercício. A meta e a política são **propostas do cenário fictício**.

## 1.1 Correção de linguagem: explicar antes de abreviar

**Problema observado em 11/11/2026:** a primeira tela do exemplo começava por `EV-P01` / `EV-M01`, `ACH?` e `HIP?`, acompanhada de linhas como `L01=P1` e `R01=festa` **sem explicar o código no contexto**. Uma pessoa que não conhece a notação de Engenharia de Requisitos ficava obrigada a decodificar siglas antes de entender o conteúdo.

**Regra de apresentação:** começar pelo significado em linguagem natural, mencionar o código apenas como referência secundária, depois de explicá-lo. A aula passou a ter um botão constante **“Entenda os códigos”**, com glossário das duas trilhas, e o marcador de fase agora aparece como **“Etapa 1: registro”** em vez de `D0`. O identificador bruto continua disponível em “Dossiê e fontes”, para manter rastreabilidade.

### Exemplo correto para projeção — trilha Memórias

| Elemento | Texto mostrado ao aluno |
| --- | --- |
| Registro | **O registro que recebemos:** seis relatos inventados: três sobre festas, dois sobre trabalho e um sobre paisagens; sem nomes ou locais reais |
| Achado | **O que conseguimos afirmar:** a coleção de teste contém relatos de três temas |
| Hipótese | **O que ainda é só uma ideia:** talvez agrupar por tema facilite a consulta; isso precisa de confirmação |
| Código de referência (não título principal) | `EV-M01` significa *primeira evidência da trilha Memórias*; `R01–R06` são relatos numerados e fictícios |

### Exemplo correto para projeção — trilha Permanência

| Elemento | Texto mostrado ao aluno |
| --- | --- |
| Registro | **O registro que recebemos:** seis linhas fictícias: três do período 1, duas do período 2 e uma do período 3; cada linha resume um grupo, sem identificar estudantes |
| Achado | **O que conseguimos afirmar:** a tabela de teste contém linhas de três períodos |
| Hipótese | **O que ainda é só uma ideia:** talvez consultar por período ajude a planejar ações de apoio; isso precisa de confirmação |
| Código de referência (não título principal) | `EV-P01` significa *primeira evidência da trilha Permanência*; `L01–L06` são linhas de tabela; `P1/P2/P3` significam períodos 1/2/3 |

### Vocabulário que deve ser introduzido gradualmente

- **Evidência (EV):** registro consultável; **achado (ACH):** conclusão sustentada; **hipótese (HIP):** ideia ainda não comprovada; **pendência (PEND):** decisão ou pergunta aberta.
- **Necessidade (NEC):** problema da parte interessada; **requisito de usuário (RU):** serviço esperado; **requisito funcional (RF):** comportamento do sistema.
- **Requisito não funcional (RNF):** qualidade ou restrição; **requisito de dados (RD):** definição do campo; **regra de negócio (RN):** política do domínio; **critério de aceitação (CA):** exemplo de teste.
- **D0–D11:** etiquetas internas das etapas do dossiê, exibidas ao aluno como *Etapa 1–12*; **XP:** pontos formativos, sem equivalência com nota oficial.

**Mediação recomendada:** o professor lê a primeira ficha em linguagem comum e pergunta “O que isso mostra?” antes de introduzir o termo *achado*. Só então pergunta “O que ainda não podemos afirmar?” para ensinar *hipótese*. Os códigos entram como suporte à documentação, não como pré-requisito para entender o problema.

**QA adicional:** verificar ambos os cartões iniciais em 1280×720, 390×844 e 320 px; conferir vocabulário e leitura por teclado, preservando 26 telas, 100 XP, contratos e exportação local.

## 2. Duas trilhas, uma única estrutura narrativa

### Trilha M — Mapa de Memórias Quilombolas (inteiramente inventado)

- **EV-M01 (D0):** seis registros R01–R06, sendo R01–R03 = festa, R04–R05 = trabalho, R06 = paisagem. São rótulos didáticos, sem relatos reais, pessoas ou coordenadas.
- **ACH-M01 (D1):** os seis registros da ficha têm três valores distintos de tema.
- **HIP-M01 (D2):** talvez filtrar por tema facilite localizar relatos. **Não validada**.
- **PEND-M01:** confirmar quem consulta, se a divisão por tema ajuda, e quais itens podem aparecer publicamente.
- **NEC-M01 (D3):** quem consulta precisa encontrar os relatos de um tema escolhido.
- **RU-M01 (D3):** como visitante do acervo fictício, quero consultar relatos por tema para ler os itens pertinentes.
- **RF-M01 (D4):** o sistema deve exibir os relatos do tema selecionado sem modificar o conjunto original.
- **RD-M01 (D5):** `tema` obrigatório, com valores festa, trabalho e paisagem na base didática v1.
- **RN-M01 (D5):** política **fictícia**: só itens revisados podem integrar uma futura saída pública.
- **RNF-M01 (D5):** filtrar usando só teclado, com foco visível e sem bloqueio.
- **RNF-M02 (D6):** proposta de desempenho com 100 registros artificiais, até 1 s por tentativa em 10 execuções; ambiente e viabilidade pendentes. **Essa carga não é EV-M01.**
- **RNF-M03:** minimizar a exposição pública dos campos; o filtro interno e a saída pública são operações distintas.
- **CA-M01 (D7):** Dado EV-M01, quando selecionar festa, então obter os três relatos R01–R03 e preservar os seis originais.
- **MVP-M01 (D8):** filtro, domínio do campo, acesso e proteção; adiar animações.
- **TRACE-M01 (D9):** EV-M01 → ACH-M01 → NEC-M01/RU-M01 → RF-M01 → CA-M01; HIP-M01 segue pendente.

### Trilha P — Permanência/Evasão Estudantil (inteiramente inventado)

- **EV-P01 (D0):** seis linhas agregadas artificiais L01–L06, sendo L01–L03 = P1, L04–L05 = P2, L06 = P3, sem dados individuais.
- **ACH-P01 (D1):** três valores de período aparecem na ficha.
- **HIP-P01 (D2):** talvez consultar linhas por período ajude o planejamento de apoio. **Não validada**.
- **PEND-P01:** confirmar se esse recorte apoia a decisão da equipe; nenhum diagnóstico individual pode ser inferido.
- **NEC-P01 (D3):** equipe precisa consultar contagens agregadas do período selecionado.
- **RU-P01 (D3):** como integrante da equipe pedagógica fictícia, quero consultar linhas agregadas por período sem identificar alunos.
- **RF-P01 (D4):** o sistema deve exibir linhas do período selecionado sem modificar a tabela original.
- **RD-P01 (D5):** `período` obrigatório, com valores P1, P2 e P3 na base didática v1.
- **RN-P01 (D5):** política **fictícia**: só tabelas agregadas revisadas podem integrar a apresentação pública.
- **RNF-P01 (D5):** filtragem por teclado com foco e navegação sem bloqueio.
- **RNF-P02 (D6):** a mesma carga adicional de 100 itens artificiais para meta de desempenho pendente.
- **RNF-P03:** saída pública de campos agregados revisados; sem matrículas ou dados pessoais.
- **CA-P01 (D7):** Dado EV-P01, quando selecionar P1, então obter exatamente as linhas L01–L03 e preservar as seis originais.
- **MVP-P01 (D8):** consulta, domínio de período, acesso e proteção.
- **TRACE-P01 (D9):** EV-P01 → ACH-P01 → NEC-P01/RU-P01 → RF-P01 → CA-P01; HIP-P01 segue pendente.

**Atenção ética:** essas duas histórias são exemplos pedagógicos, **não representam necessidades levantadas em comunidade quilombola nem dados reais de estudantes do IFMA**. O professor não deve converter HIP em evidência ou alegar validação comunitária/institucional.

## 3. Versões cumulativas do mesmo dossiê

| Versão | Primeira tela | Alteração em relação à etapa anterior | Produto verificável |
| --- | ---: | --- | --- |
| D0 | 03 | Inserção da ficha sintética com seis registros e ID único | Registro EV-M01 ou EV-P01 |
| D1 | 05 | Extração de um achado, sem extrapolação | ACH-M01 ou ACH-P01 |
| D2 | 06 | Separação de hipótese e validação ainda necessária | HIP + PEND |
| D3 | 08 | Formulação da necessidade e requisito de usuário | NEC + RU |
| D4 | 09 | Especificação de comportamento do sistema | RF |
| D5 | 12 | Condições de acesso, campo e regra de negócio | RNF-01 + RD + RN |
| D6 | 15 | Definição de desempenho testável e ressalva de carga adicional | RNF-02 proposto |
| D7 | 18 | Critério observável com os mesmos seis registros | CA-01 |
| D8 | 19 | Priorização de escopo mínimo | MVP-01 |
| D9 | 21 | Vínculos entre fonte, necessidade, requisito e teste | TRACE-01 |
| D10 | 24 | Preenchimento do catálogo pelo estudante | CAT-01 (rascunho) |
| D11 | 25 | Revisão cruzada de coerência e pendências | REV-01 |

**Como operar:** cada tela apresenta, no identificador superior, a versão acumulada do dossiê. O controle **Dossiê e fontes** mostra o histórico, do primeiro registro à etapa atual. Essa sequência é **demonstrativa e não altera automaticamente o texto livre do estudante**. A oficina da tela 24 continua exigindo autoria da equipe, com consulta ao histórico.

### Missões dentro da mesma narrativa

- M1 (tela 07): separar EV, ACH, HIP e PEND **da ficha inicial**.
- M2 (tela 10): diferenciar NEC/RU da obrigação RF **do mesmo filtro**.
- M3 (tela 14): classificar RF/RNF/RD/RN **do mesmo caso**.
- M4 (tela 17): revisar desempenho, teclado e proteção **da mesma função**.
- M5 (tela 20): escrever aceite, detectar extensão ambígua do RF e priorizar **o mesmo produto**.
- M6 (tela 23): rastrear da EV até CA e preservar HIP como pendência.

Cada missão permanece formativa, com feedback e tentativas. A **qualidade do catálogo** é revista por humanos, sem nota oficial automática.

## 4. Critérios de aceite para esta revisão

1. Todas as 26 telas devem conservar um único problema por trilha; mudanças de trilha não misturam estados.
2. A definição formal da ISO 29148 deve aparecer **no slide**, e a diferença NEC/RU/RF deve ser exemplificada.
3. D0–D11 devem existir em ordem, com IDs estáveis e origem explícita; cada etapa acumula o trabalho anterior.
4. S09, S11, S12, S15, S18 e S21 devem usar **a mesma fonte e o mesmo RF**, alterando somente a dimensão estudada.
5. A questão M5-Q2 deve mencionar a **evolução do RF do caso**, não introduzir um projeto de relatórios sem contextualização.
6. Dado “100 registros” do desempenho deve estar explicitamente distinto da fonte inicial “6 registros”.
7. Verificação e validação devem ser distinguidas conceitualmente; metas e políticas fictícias não podem virar resultados medidos.
8. Não pode haver regressão de 100 XP, feedback, teclado, foco, impressão, exportação local ou esquema JSON 2020-12.
9. Reexecutar 25 testes anteriores, novos testes de continuidade e as verificações do navegador com Playwright em Chromium/Firefox/WebKit.
10. QA não autora deve avaliar conteúdo, conformidade documental, clareza, tamanho dos textos em projeção e limites éticos.

## 5. Referências e limites de atribuição

- **ISO/IEC/IEEE.** *29148:2018 — Requirements engineering*, especialmente seção 3.1.19. https://www.iso.org/standard/72089.html.
- **ISO/IEC.** *25010:2023 — Product quality model*. https://www.iso.org/standard/78176.html.
- **IEEE COMPUTER SOCIETY.** *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide)*, versão 4.0a; área Software Requirements. https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics.
- **NUSEIBEH, B.; EASTERBROOK, S.** *Requirements Engineering: A Roadmap*. 2000. https://www0.cs.ucl.ac.uk/staff/A.Finkelstein/fose/fdnuseibeh.pdf.
- **SOMMERVILLE, I.** *Engenharia de Software*, 8. ed., Pearson, 2007 (bibliografia no plano PPI). 
- **PFLEEGER, S. L.** Conceito de requisito (2004), conforme apresentação docente fornecida: `ES_Etapa_Analise.pdf`.
- **Materiais docentes fornecidos:** `ES_Etapa_Analise.pdf`, `ES_Engenharia_Requisitos_parte_2.pdf` e `ES_02_Processo_Desenvolvimento_Software_Parte1.pdf`.

Atribuições acima são paráfrases e síntese pedagógica. A definição, a classificação complementar RD/RN e os exemplos fictícios não significam que toda redação tenha sido copiada ou certificada pelas normas. O plano institucional e as Aulas 01–07 permanecem intocados.
