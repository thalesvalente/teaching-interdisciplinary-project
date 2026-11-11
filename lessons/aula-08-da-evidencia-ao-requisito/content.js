/* PPI Aula 08 — conteúdo didático autoral, casos exclusivamente sintéticos. */
(function (root, factory) {
  'use strict';
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  if (root) root.PPI_A08_CONTENT = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const card = (title, text, tag) => ({ title, text, ...(tag ? { tag } : {}) });
  const option = (id, text, feedback) => ({ id, text, feedback });
  const question = (mission, n, prompt, options, correct, explanation, objective, evidence, criterion) => ({
    id: `a08.${mission}.q${n}.v1`, prompt, options, correct, explanation, objective, evidence, criterion
  });
  const slides = [
    { id: 's01', kind: 'cover', kicker: 'PPI I · Aula 08 · 50 minutos', title: 'Da evidência ao requisito', lead: 'Um caso, um dossiê: acompanhe cada decisão da primeira ficha ao catálogo final.', cards: [card('O desafio', 'Continuar o registro fictício da Aula 07, sem inventar necessidades.'), card('A entrega', '1 RF, 1 RNF verificável e 1 requisito de dados, ligados à fonte e a testes.')], note: '26 telas · 6 missões · 100 XP formativos. Exemplos e dados inteiramente fictícios.' },
    { id: 's02', kind: 'concept', kicker: 'Retomada · documento D0', title: 'O que já temos da Aula 07?', lead: 'Antes de escrever requisitos, precisamos da pergunta de investigação e de registros identificados.', cards: [card('Parte interessada', 'Pessoa ou organização afetada pelo sistema, por seu uso ou por suas decisões.'), card('Problema', 'Como localizar uma parte da coleção sem perder os registros originais?'), card('Documento D0', 'Uma ficha identificada e um pequeno conjunto de dados fictícios; ainda não é requisito.')], note: 'Retome a Aula 07: entrevista, observação e documentos são técnicas de elicitação; um pedido isolado não é prova de uma necessidade.' },
    { id: 's03', kind: 'concept', kicker: 'Escolha uma trilha', title: 'Um laboratório de decisões', lead: 'Escolha a trilha no topo. Os exemplos mudam e cada trilha guarda seu próprio percurso.', cards: [card('Memórias', 'Localizar relatos inventados por tema, sem nomes, vozes ou coordenadas reais.'), card('Permanência', 'Consultar contagens sintéticas por período, sem identificar estudantes.'), card('Limite comum', 'Nenhum caso autoriza coleta, contato externo ou decisões sobre pessoas.')], note: 'Casos fictícios para aprender requisitos; não são retratos de comunidades ou turmas reais.' },
    { id: 's04', kind: 'concept', kicker: 'Literatura · ISO/IEC/IEEE 29148:2018', title: 'Afinal, o que é um requisito?', lead: 'É uma declaração que expressa uma necessidade e as condições ou restrições associadas (29148, seção 3.1.19).', steps: ['Fonte identificada', 'Achado e limites', 'Necessidade validável', 'Requisito formulado', 'Critério verificável', 'Rastro e revisão'], cards: [card('Engenharia de Requisitos', 'Elicitar, analisar, especificar, verificar, validar e gerenciar requisitos ao longo do projeto.'), card('Dossiê vivo', 'A mesma situação fictícia será revisada e ampliada em cada etapa, de D0 a D11.')], note: 'Definição em paráfrase da ISO/IEC/IEEE 29148:2018. Referência complementar: SWEBOK v4, área Software Requirements.' },
    { id: 's05', kind: 'concept', kicker: 'D1 · registro e interpretação', title: 'O que sabemos e o que interpretamos?', cards: [card('Evidência', 'Registro identificado, consultável e delimitado por uma fonte.'), card('Achado', 'Conclusão sustentada pelo que foi examinado, sem extrapolar os dados.'), card('Hipótese', 'Explicação ou benefício esperado que ainda requer confirmação.'), card('Pendência', 'Questão, regra ou decisão que falta verificar com a parte interessada.')], note: 'Uma contagem observada na tabela de teste não comprova, por si, que um filtro será útil ao público.' },
    { id: 's06', kind: 'concept', kicker: 'D2 · hipótese e pendência', title: 'Separar pedido, necessidade e suposição', lead: 'O próximo passo do dossiê não é inventar uma função: é explicitar a incerteza.', cards: [card('Pedido de solução', '“Adicione um botão de busca.” Não explica qual problema precisa ser resolvido.'), card('Hipótese candidata', 'Talvez filtrar a coleção ajude a localizar o conteúdo desejado.'), card('Pergunta de validação', 'Quem consultará a coleção? Qual recorte resolve a tarefa de fato?')], note: 'Pendência registrada não é erro: é uma decisão que exige confirmação. Nenhuma hipótese é apresentada como observação real.' },
    { id: 's07', kind: 'mission', kicker: 'Missão 1 · 10 XP', title: 'Separe as pistas', missionId: 'm1', lead: 'Leia o registro e escolha a classificação que melhor representa sua função.' },
    { id: 's08', kind: 'concept', kicker: 'D3 · da necessidade à especificação', title: 'Necessidade, requisito de usuário e de sistema', cards: [card('Necessidade', 'Resultado que uma parte interessada precisa alcançar no contexto investigado.'), card('Requisito de usuário', 'Declaração do serviço ou resultado esperado em linguagem compreensível para essa pessoa.'), card('Requisito de sistema', 'Comportamento ou condição especificados com precisão suficiente para verificar sua implementação.')], note: 'São níveis de abstração distintos, conforme a engenharia de requisitos. A tecnologia escolhida pertence à etapa posterior de projeto.' },
    { id: 's09', kind: 'concept', kicker: 'D3–D4 · escrever sem perder a origem', title: 'Do problema ao requisito verificável', lead: 'Vamos manter a mesma fonte e documentar três frases: necessidade, requisito do usuário e obrigação do sistema.', cards: [card('NEC · problema', 'Identificar a parte relevante de uma coleção sem percorrê-la inteira.'), card('RU · serviço esperado', 'Quero consultar registros de uma categoria escolhida.'), card('RF · comportamento', 'O sistema deve exibir só os registros da categoria selecionada e preservar a coleção.')], note: 'O RF é candidato enquanto o benefício esperado não for validado com as partes interessadas. Um critério será anexado ao mesmo RF nas próximas telas.' },
    { id: 's10', kind: 'mission', kicker: 'Missão 2 · 15 XP', title: 'Reconheça a necessidade e o sistema', missionId: 'm2', lead: 'Escolha primeiro o objetivo do usuário e depois a especificação do sistema.' },
    { id: 's11', kind: 'concept', kicker: 'D4–D5 · função e qualidade', title: 'Que função? Sob quais condições?', cards: [card('Requisito funcional (RF)', 'Descreve comportamento, serviço ou transformação de informação exigida do sistema.'), card('Requisito não funcional (RNF)', 'Define qualidade ou restrição do produto, com medida, condição e teste quando aplicável.'), card('No nosso dossiê', 'Filtrar é a função. Navegação por teclado, tempo de resposta e proteção são condições distintas.')], note: 'Tipologia didática apoiada em Sommerville e SWEBOK v4. Qualidade do produto: ISO/IEC 25010:2023.' },
    { id: 's12', kind: 'concept', kicker: 'D5 · dados e regras do domínio', title: 'Que informação e qual política?', cards: [card('Requisito de dados (RD)', 'Define significado, domínio, obrigatoriedade e origem de um campo usado pelo RF.'), card('Regra de negócio (RN)', 'Política do contexto de trabalho, independentemente de existir software.'), card('No dossiê', 'O campo do filtro tem valores definidos; uma política fictícia exige revisão antes de divulgação.')], note: 'RD e RN são categorias complementares usadas neste catálogo didático, não uma taxonomia exclusiva da ISO 29148.' },
    { id: 's13', kind: 'concept', kicker: 'Revisão do D5 · qualidade da redação', title: 'Como distinguir requisito bom de frase vaga?', cards: [card('Clareza e singularidade', 'Uma obrigação principal, com termos definidos e sem interpretações concorrentes.'), card('Verificabilidade e consistência', 'É possível demonstrar atendimento? Não contradiz outra regra do mesmo caso?'), card('Necessidade e viabilidade', 'Há fonte ou hipótese marcada? A solução pode ser implementada no escopo proposto?')], note: 'A revisão de cada enunciado é feita antes da modelagem: evite “rápido”, “fácil”, “seguro” e “tudo” sem definir testes.' },
    { id: 's14', kind: 'mission', kicker: 'Missão 3 · 20 XP', title: 'Dê o nome certo a cada condição', missionId: 'm3', lead: 'Identifique RF, RNF, requisito de dados e regra de negócio pelo foco da frase.' },
    { id: 's15', kind: 'concept', kicker: 'D6 · RNF de desempenho', title: 'Corrigir “o filtro deve ser rápido”', lead: 'O mesmo RF agora recebe uma condição de desempenho, separada do comportamento.', cards: [card('Antes · vago', '“O filtro deve responder rapidamente.”'), card('Depois · testável', 'Com 100 registros sintéticos carregados, concluir a filtragem em até 1 s em cada uma de 10 tentativas.'), card('Condições pendentes', 'Registrar computador e navegador de referência; validar carga, meta e viabilidade com a equipe.')], note: 'Os 100 registros são uma carga adicional para teste de desempenho, não os 6 registros da evidência inicial. A meta ainda não foi medida.' },
    { id: 's16', kind: 'concept', kicker: 'Qualidade também é acesso e proteção', title: 'Quem consegue usar? O que pode aparecer?', cards: [card('Acesso', 'Concluir a filtragem só com teclado, com foco visível e sem ficar preso.'), card('Proteção', 'Na saída pública do caso fictício, revelar apenas campos explicitamente permitidos.'), card('Teste negativo', 'Tente o caminho proibido: dado restrito, opção ausente ou acesso não permitido.')], note: 'Não transforme “seguro” em promessa absoluta. Defina uma ameaça, uma condição e uma verificação.' },
    { id: 's17', kind: 'mission', kicker: 'Missão 4 · 15 XP', title: 'Conserte o requisito vago', missionId: 'm4', lead: 'Prefira condições mensuráveis e verificações de acesso e proteção.' },
    { id: 's18', kind: 'concept', kicker: 'D7 · critério de aceitação', title: 'Como provar que o RF foi atendido?', cards: [card('Dado', 'Estado inicial conhecido: os seis registros sintéticos da fonte identificada.'), card('Quando', 'O usuário selecionar o mesmo valor de filtro do requisito.'), card('Então', 'O sistema apresentará exatamente os registros esperados, mantendo os seis originais.')], note: 'O exemplo Dado/Quando/Então verifica o comportamento com uma base conhecida. Depois incluir caso vazio e dado inválido.' },
    { id: 's19', kind: 'concept', kicker: 'D8 · backlog e escopo mínimo', title: 'O que entra na primeira versão?', cards: [card('Essencial · Must', 'RF de consulta, RD de valores, teclado e regra de proteção da saída.'), card('Depois · Should', 'Combinar filtros adicionais, se a necessidade for confirmada.'), card('Fora da primeira versão · Could', 'Efeitos visuais sem contribuição comprovada à tarefa.')], note: 'Exemplo de priorização por valor, dependência, risco e esforço. Segurança e acessibilidade não são opcionais se necessárias ao uso.' },
    { id: 's20', kind: 'mission', kicker: 'Missão 5 · 20 XP', title: 'Defina o aceite e faça escolhas', missionId: 'm5', lead: 'Construa um teste claro, encontre a ambiguidade e priorize o mínimo útil.' },
    { id: 's21', kind: 'concept', kicker: 'D9 · matriz de rastreabilidade', title: 'Mostre como o documento foi construído', lead: 'Cada identificador liga a decisão ao registro que a justificou e ao teste que poderá verificar o resultado.', steps: ['EV: fonte', 'ACH: achado', 'NEC/RU: objetivo', 'RF: obrigação', 'CA: teste'], cards: [card('Volta à origem', 'Da falha em um teste, retorne ao requisito, à necessidade e à evidência para revisar a decisão.')], note: 'A hipótese sobre utilidade permanece pendente, mesmo quando um teste funcional com dados fictícios passa.' },
    { id: 's22', kind: 'concept', kicker: 'D9 · revisão e decisões pendentes', title: 'Verificação não é validação', cards: [card('Verificar', 'Conferir se o produto atende ao RF e ao critério escrito: o filtro retorna os registros esperados?'), card('Validar', 'Conferir se o RF responde à necessidade real: filtrar por essa categoria de fato ajuda quem usa?'), card('Gerenciar mudanças', 'Se a resposta mudar, registre motivo, versão, impacto em RF, RD, teste e rastro; preserve a hipótese pendente.')], note: 'A ISO 29148 inclui verificação, validação e gestão ao longo do ciclo. Sugestão de IA não equivale a confirmação de fonte.' },
    { id: 's23', kind: 'mission', kicker: 'Missão 6 · 20 XP', title: 'Feche a cadeia sem inventar elos', missionId: 'm6', lead: 'Monte o rastro correto e confira se fonte, requisito e critério combinam.' },
    { id: 's24', kind: 'catalog', kicker: 'D10 · oficina · 7 min', title: 'Complete o dossiê do mesmo caso', lead: 'Use EV-01 e o rastro construído: redija um RF, um RNF verificável e um RD. Compare com os exemplos; não copie automaticamente.', note: 'O formulário é um rascunho local. Identifique fonte, estado, prioridade e critério para cada requisito; a qualidade depende de revisão humana.' },
    { id: 's25', kind: 'review', kicker: 'D11 · revisão por pares · 3 min', title: 'Outra equipe audita seu dossiê', lead: 'O registro sustenta a necessidade? O RF e o teste conversam? Qual pendência ainda exige confirmação?', note: 'Revisão deve checar clareza, consistência, verificabilidade e limites das evidências. A nota oficial não é calculada automaticamente.' },
    { id: 's26', kind: 'exit', kicker: 'D11 · síntese · 5 min', title: 'Do mesmo registro a um catálogo rastreável', lead: 'Explique uma decisão documentada: fonte → achado → necessidade → RF/RNF/RD → critério → revisão.', note: 'Registre uma hipótese pendente no ticket de saída. A exportação ou impressão são voluntárias e locais; nenhuma nota oficial é criada.' }
  ];
  const missions = [
    { id: 'm1', title: 'Separe as pistas', xp: 10, slideId: 's07', objective: 'Distinguir achado, evidência, hipótese e pendência.' },
    { id: 'm2', title: 'Da necessidade ao sistema', xp: 15, slideId: 's10', objective: 'Relacionar o objetivo do usuário à especificação do sistema.' },
    { id: 'm3', title: 'Classifique com precisão', xp: 20, slideId: 's14', objective: 'Diferenciar RF, RNF, requisito de dados e regra de negócio.' },
    { id: 'm4', title: 'Qualidade que se verifica', xp: 15, slideId: 's17', objective: 'Escolher RNFs mensuráveis de desempenho, acesso e proteção.' },
    { id: 'm5', title: 'Aceite e prioridade', xp: 20, slideId: 's20', objective: 'Definir Dado/Quando/Então, reduzir ambiguidade e priorizar.' },
    { id: 'm6', title: 'Feche o rastro', xp: 20, slideId: 's23', objective: 'Relacionar evidência, achado, necessidade, requisito e critério.' }
  ];
  const contexts = {
    memorias: {
      label: 'Mapa de Memórias Quilombolas', shortLabel: 'Memórias', description: 'Acervo fictício de relatos, sem pessoas, narrativas ou locais reais.', prefix: 'M',
      source: 'EV-M01', sourceDescription: 'Ficha de teste fictícia v1: 6 relatos sintéticos; 3 de tema festa, 2 de trabalho e 1 de paisagem.',
      finding: 'A coleção de teste contém relatos de três temas.', hypothesis: 'Talvez agrupar por tema facilite a consulta de quem usa o acervo.', pending: 'Falta validar com o professor se tema é o melhor filtro para este objetivo.',
      need: 'Quem consulta precisa localizar relatos do tema escolhido.', rf: 'O sistema deve exibir os relatos do tema selecionado sem alterar a coleção original.',
      rnf: 'A filtragem deve ser concluída usando apenas o teclado, com foco visível e sem bloqueio de navegação.',
      rd: 'O campo tema é obrigatório e deve aceitar apenas festa, trabalho ou paisagem na base sintética v1.',
      rule: 'Política fictícia RN-M01: somente itens com revisão marcada como concluída podem entrar na saída pública do exercício.',
      accept: 'Dado o acervo EV-M01 com 6 relatos, quando selecionar festa, então exibir exatamente os 3 relatos desse tema e manter os 6 na coleção original.',
      filter: 'festa', count: '3 relatos', total: '6 relatos', dataset: 'acervo sintético', noun: 'relatos',
      protect: 'Na saída pública simulada, permitir apenas id, título e tema dos itens revisados; omitir os itens restritos.',
      unsafe: 'Exibir coordenadas exatas e nomes reais para deixar o mapa completo.',
      sourceRd: 'EV-M02: dicionário fictício v1 define tema obrigatório com três valores permitidos.',
      sourceRnf: 'EV-M03: roteiro fictício de teste solicita filtragem por teclado; a meta deve ser validada pelo professor.',
      next: 'Derivar os campos tema, título e status de revisão; depois discutir suas relações.'
    },
    permanencia: {
      label: 'Permanência / Evasão Estudantil', shortLabel: 'Permanência', description: 'Painel de contagens sintéticas agregadas, sem matrícula, nome, frequência ou nota individual.', prefix: 'P',
      source: 'EV-P01', sourceDescription: 'Tabela de teste fictícia v1: 6 linhas agregadas; 3 do período P1, 2 de P2 e 1 de P3.',
      finding: 'A tabela de teste contém linhas de três períodos.', hypothesis: 'Talvez consultar por período facilite o planejamento de ações de apoio.', pending: 'Falta validar com o professor se o recorte por período responde à decisão proposta.',
      need: 'A equipe precisa consultar contagens agregadas do período escolhido para planejar apoio.', rf: 'O sistema deve exibir as linhas agregadas do período selecionado sem alterar a tabela original.',
      rnf: 'A filtragem deve ser concluída usando apenas o teclado, com foco visível e sem bloqueio de navegação.',
      rd: 'O campo período é obrigatório e deve aceitar apenas P1, P2 ou P3 na base sintética v1.',
      rule: 'Política fictícia RN-P01: somente tabelas agregadas revisadas podem entrar na apresentação pública do exercício.',
      accept: 'Dada a tabela EV-P01 com 6 linhas, quando selecionar P1, então exibir exatamente as 3 linhas desse período e manter as 6 na tabela original.',
      filter: 'P1', count: '3 linhas', total: '6 linhas', dataset: 'tabela sintética', noun: 'linhas agregadas',
      protect: 'Na saída pública simulada, permitir apenas período, categoria e contagem agregada revisada; omitir qualquer identificador individual.',
      unsafe: 'Exibir matrículas e notas individuais para descobrir quem vai abandonar o curso.',
      sourceRd: 'EV-P02: dicionário fictício v1 define período obrigatório com três valores permitidos.',
      sourceRnf: 'EV-P03: roteiro fictício de teste solicita filtragem por teclado; a meta deve ser validada pelo professor.',
      next: 'Derivar os campos período, categoria e contagem; depois discutir suas relações.'
    }
  };
  const categories = (correct) => [
    option('a', 'Achado', correct === 'a' ? 'É uma interpretação sustentada pelo registro descrito.' : 'Achado é a conclusão obtida da análise, não qualquer tipo de informação.'),
    option('b', 'Evidência', correct === 'b' ? 'Há um registro identificável que pode ser consultado.' : 'Evidência é o registro que sustenta uma afirmação; uma suposição não vira registro confirmado.'),
    option('c', 'Hipótese', correct === 'c' ? 'A explicação está explicitamente apresentada como algo a confirmar.' : 'Hipótese é uma explicação ainda não confirmada; procure a incerteza sobre a interpretação.'),
    option('d', 'Pendência', correct === 'd' ? 'A frase aponta a validação que ainda falta fazer.' : 'Pendência nomeia uma informação, decisão ou validação ainda ausente.')
  ];
  function typeOptions(correct) {
    return [
      option('a', 'RF · requisito funcional', correct === 'a' ? 'O foco é o comportamento que o sistema deve oferecer.' : 'RF descreve ação, serviço ou comportamento do sistema.'),
      option('b', 'RNF · requisito não funcional', correct === 'b' ? 'O foco é uma condição de qualidade que limita a execução da função.' : 'RNF define uma qualidade ou limite observável do sistema.'),
      option('c', 'RD · requisito de dados', correct === 'c' ? 'O foco é o significado, obrigatoriedade ou domínio de valores de um campo.' : 'RD descreve o dado e suas restrições, não a política inteira do domínio.'),
      option('d', 'RN · regra de negócio', correct === 'd' ? 'É uma política fictícia do domínio, válida mesmo se a tarefa fosse feita em papel.' : 'RN é uma condição do domínio; ela pode motivar vários requisitos.')
    ];
  }
  function buildTrack(c) {
    const id = c.prefix;
    const missionsById = {
      m1: { questions: [
        question('m1', 1, `${c.source}: ${c.sourceDescription} Qual é o papel desse registro?`, categories('b'), 'b', 'A ficha/tabela identificada é a evidência do exercício. Ela permite conferir a coleção fictícia, mas não retrata uma comunidade ou turma real.', 'Distinguir evidência de interpretação.', c.source, 'Identifica o registro consultável e seu limite.'),
        question('m1', 2, `Após ler ${c.source}, a equipe conclui: “${c.finding}” Como classificar essa conclusão?`, categories('a'), 'a', 'O achado resulta da leitura da evidência. A conclusão limita-se ao conjunto examinado.', 'Reconhecer um achado sustentado.', c.source, 'Relaciona a conclusão ao registro que a sustenta.'),
        question('m1', 3, `A equipe escreve: “${c.hypothesis}” Qual é a classificação?`, categories('c'), 'c', '“Talvez” sinaliza uma explicação a testar. O conteúdo não foi validado pela existência da tabela.', 'Manter incerteza explícita.', `HIP-${id}01`, 'Não promove uma suposição a fato.'),
        question('m1', 4, c.pending + ' Essa informação deve ser registrada como:', categories('d'), 'd', 'A validação ainda necessária vira pendência. Não é preciso inventar uma resposta para continuar o rascunho.', 'Registrar uma pendência de validação.', `PEND-${id}01`, 'Identifica o que falta e não fabrica confirmação.')
      ] },
      m2: { questions: [
        question('m2', 1, 'Qual frase expressa melhor uma necessidade de quem vai usar a solução?', [
          option('a', 'O aplicativo deve usar uma biblioteca de gráficos famosa.', 'É uma escolha técnica antecipada; não explica o objetivo de quem usa.'),
          option('b', c.rf, 'É um comportamento do sistema. Procure a intenção da pessoa antes de escolher a solução.'),
          option('c', c.need, 'A frase descreve o objetivo de quem usa em linguagem compreensível.')
        ], 'c', 'A necessidade explica para quê a solução existe. A implementação é detalhada depois, com validação.', 'Distinguir necessidade do usuário de solução.', `NEC-${id}01`, 'Seleciona o objetivo da pessoa sem impor tecnologia.'),
        question('m2', 2, `Para atender à necessidade descrita, qual requisito de sistema é mais claro?`, [
          option('a', c.rf, 'A frase define a ação, os registros afetados e a preservação da fonte.'),
          option('b', 'O sistema deve ser incrível, completo e inteligente.', 'Os adjetivos não definem comportamento nem condição verificável.'),
          option('c', 'Quem usa precisa encontrar a informação certa.', 'É uma necessidade válida, mas ainda não especifica o comportamento do sistema.')
        ], 'a', 'O requisito deve traduzir a necessidade em comportamento ou condição verificável, evitando detalhes de implementação desnecessários.', 'Especificar comportamento do sistema.', `RF-${id}01`, 'Define operação, objeto e limite de efeito.')
      ] },
      m3: { questions: [
        question('m3', 1, c.rf + ' Qual é o foco desse item?', typeOptions('a'), 'a', 'Exibir a seleção é uma função do sistema. O requisito também evita o efeito indevido de apagar a fonte.', 'Classificar RF.', `RF-${id}01`, 'Reconhece o comportamento solicitado.'),
        question('m3', 2, c.rnf + ' Qual é o foco desse item?', typeOptions('b'), 'b', 'A condição define como a função deve poder ser utilizada e permite um teste de teclado.', 'Classificar RNF.', `RNF-${id}01`, 'Reconhece uma condição de qualidade verificável.'),
        question('m3', 3, c.rd + ' Qual é o foco desse item?', typeOptions('c'), 'c', 'O item define obrigatoriedade e valores permitidos de um campo. No catálogo didático, isso é requisito de dados.', 'Classificar requisito de dados.', `RD-${id}01`, 'Distingue domínio do campo de função e política.'),
        question('m3', 4, c.rule + ' Qual é o foco desse item?', typeOptions('d'), 'd', 'É uma política criada para o exercício, não uma norma real do IFMA ou de uma comunidade. Ela pode existir mesmo numa organização em papel.', 'Classificar regra do domínio sem inventar norma real.', `RN-${id}01`, 'Reconhece a política e mantém sua natureza fictícia.')
      ] },
      m4: { questions: [
        question('m4', 1, 'A equipe escreveu “o filtro deve ser rápido”. Qual proposta permite testar esse RNF?', [
          option('a', 'O filtro deve responder imediatamente e nunca atrasar.', '“Imediatamente” e “nunca” não delimitam medida, carga ou ambiente.'),
          option('b', 'Com 100 registros sintéticos carregados, responder em até 1 s em cada uma de 10 execuções no computador e navegador de referência documentados.', 'Operação, carga, medida, limite e ambiente estão declarados; a meta ainda precisa ser combinada.'),
          option('c', 'O filtro deve usar a tecnologia mais moderna disponível.', 'A tecnologia não determina sozinha o desempenho observado e pode mudar.')
        ], 'b', 'A meta é fictícia e proposta. Registrar o ambiente e validar a viabilidade faz parte do requisito; o enunciado não prova que o desempenho foi alcançado.', 'Tornar desempenho mensurável.', `RNF-${id}02`, 'Inclui condição, carga, métrica, limite e repetição.'),
        question('m4', 2, 'Qual par de condições trata de acesso e proteção de forma verificável?', [
          option('a', 'Ser fácil para todos e proteger qualquer coisa em qualquer situação.', 'São objetivos amplos, sem cenário nem forma de verificar.'),
          option('b', c.unsafe, 'O caso autoriza somente dados sintéticos e mínimos. Expor pessoas não é uma condição de qualidade aceitável.'),
          option('c', `Testar a filtragem só com teclado, foco visível e sem bloqueio. ${c.protect}`, 'Há dois testes distintos: completar a tarefa por teclado e conferir os campos/itens permitidos na saída.')
        ], 'c', 'Cada condição deve virar um RNF separado no catálogo: uma para acesso por teclado e outra para minimização/proteção da saída.', 'Especificar acesso e proteção sem promessas absolutas.', `RNF-${id}01 / RNF-${id}03`, 'Escolhe condições observáveis e separa duas obrigações no catálogo.')
      ] },
      m5: { questions: [
        question('m5', 1, `Qual critério verifica o RF de filtrar ${c.noun}?`, [
          option('a', c.accept, 'O estado inicial, a ação e o resultado esperado estão definidos.'),
          option('b', 'Dado que a tela abriu, quando a pessoa usar, então tudo deve funcionar bem.', 'Falta definir a ação e o resultado observável; “bem” é ambíguo.'),
          option('c', 'Dado que o sistema é bonito, quando terminar, então o usuário ficará feliz.', 'A frase não testa o filtro e usa julgamentos sem procedimento de avaliação.')
        ], 'a', 'Dado/Quando/Então organiza um exemplo verificável. A quantidade esperada vem da base de teste identificada.', 'Selecionar um critério Dado/Quando/Então.', `${c.source} → CA-${id}01`, 'Inclui dados conhecidos, ação e resultado exato.'),
        question('m5', 2, 'Qual revisão melhora “o sistema deve listar os dados recentes e gerar relatórios úteis”?', [
          option('a', 'Manter a frase: o desenvolvedor decidirá o sentido de recente e útil.', 'Delegar a interpretação não elimina a ambiguidade e pode contrariar a necessidade.'),
          option('b', 'Separar listar e gerar em dois requisitos; definir o período de “recente” e o conteúdo esperado do relatório com a fonte.', 'A revisão reduz a ambiguidade e deixa uma obrigação principal em cada item.'),
          option('c', 'Trocar “úteis” por “excelentes” e aumentar a prioridade.', 'Apenas trocar o adjetivo não cria uma condição verificável.')
        ], 'b', 'Clareza, singularidade e verificabilidade trabalham juntas. Se a fonte não definir o período, registre a pendência.', 'Detectar ambiguidade e múltiplas obrigações.', `REV-${id}01`, 'Divide obrigações e pede definições verificáveis.'),
        question('m5', 3, 'Há tempo para uma primeira entrega pequena. Qual conjunto atende melhor ao objetivo e aos limites do caso?', [
          option('a', 'Animações, ranking de pessoas e cores personalizadas.', 'O conjunto não resolve a consulta prioritária e o ranking expõe pessoas.'),
          option('b', 'Todas as funções imaginadas, mesmo sem fonte ou teste.', 'O escopo não cabe e inclui decisões sem necessidade sustentada.'),
          option('c', `Consulta por ${c.filter === 'festa' ? 'tema' : 'período'}, proteção da saída e uso por teclado; adiar animações decorativas.`, 'Preserva o objetivo, reduz riscos e mantém acesso; conveniências podem esperar.')
        ], 'c', 'Prioridade considera valor, risco, esforço e dependências. Requisitos essenciais de acesso e proteção precisam entrar no recorte.', 'Priorizar um escopo mínimo responsável.', `MVP-${id}01`, 'Preserva o propósito e as proteções no recorte.')
      ] },
      m6: { questions: [
        question('m6', 1, 'Qual cadeia mantém a relação entre origem, necessidade, requisito e verificação?', [
          option('a', `RF-${id}01 → opinião sem fonte → nota oficial.`, 'A cadeia perde a origem e mistura treinamento com avaliação oficial.'),
          option('b', `${c.source} → ACH-${id}01 → NEC-${id}01 → RF-${id}01 → CA-${id}01.`, 'Os IDs ligam registro, interpretação, objetivo, comportamento e teste.'),
          option('c', 'Uma sugestão da IA → “fonte confirmada” → publicação automática.', 'A IA não confirma uma fonte nem autoriza publicar dados.')
        ], 'b', 'O rastro deve permitir seguir do teste ao requisito e voltar à fonte, inclusive quando algum elo é uma hipótese pendente.', 'Montar cadeia de rastreabilidade.', c.source, 'Relaciona os cinco elos sem inventar confirmação.'),
        question('m6', 2, 'Na revisão de pares, qual decisão preserva a coerência entre evidência e requisito?', [
          option('a', `Usar ${c.source} para testar ${c.count} ao escolher ${c.filter}; manter a hipótese de utilidade pendente de validação.`, 'O teste usa a coleção conhecida e não transforma a hipótese sobre utilidade em fato.'),
          option('b', 'Usar o número de linhas como prova de que o sistema resolve todos os problemas do público.', 'A quantidade de registros não prova utilidade geral, causas ou impacto.'),
          option('c', 'Apagar a fonte e escolher um critério que sempre devolve “aprovado”.', 'Sem origem e resultado observável, o critério não verifica o requisito.')
        ], 'a', 'Um dado pode sustentar o resultado esperado de um teste sem validar a necessidade em todos os contextos. A revisão humana identifica esse limite.', 'Revisar fonte, requisito e critério em conjunto.', `${c.source} / HIP-${id}01`, 'Preserva resultado verificável e incerteza contextual.')
      ] }
    };
    return {
      label: c.label, shortLabel: c.shortLabel, description: c.description,
      slides: {
        s03: { lead: c.description, cards: [card(c.source + ' · evidência fictícia', c.sourceDescription), card('Hipótese a investigar', c.hypothesis), card('Objetivo do exercício', c.need)], note: 'Sem coleta real, contato externo ou dados de pessoas. Mudar de trilha não mistura respostas.' },
        s06: { example: c.sourceDescription, note: `${c.pending} A existência do registro não elimina essa pendência.` },
        s09: { cards: [card(`NEC-${id}01 · necessidade candidata`, c.need), card(`RF-${id}01 · requisito proposto`, c.rf), card(`CA-${id}01 · verificação`, c.accept)], note: 'A necessidade é candidata no caso didático; a equipe deve confirmar sua adequação antes de uma implementação real.' },
        s11: { cards: [card(`RF-${id}01 · comportamento`, c.rf), card(`RNF-${id}01 · acesso`, c.rnf), card('Por que são diferentes?', 'O RF define a resposta do sistema; o RNF limita uma condição em que ela deve funcionar.')] },
        s12: { cards: [card(`RD-${id}01 · dado`, c.rd), card(`RN-${id}01 · regra fictícia`, c.rule), card('Como se relacionam?', 'Uma regra de revisão pode gerar um RF de validação e restrições de proteção.')], note: 'A política é inventada para o exercício. Não é regra institucional nem decisão de uma comunidade real.' },
        s16: { cards: [card('Acesso verificável', c.rnf), card('Proteção verificável', c.protect), card('Dois itens no catálogo', 'Escreva um RNF para cada obrigação e teste também a tentativa de exibir algo restrito.')], note: 'Não há autenticação ou dados pessoais nesta aula. O cenário de proteção é apenas uma especificação fictícia.' },
        s18: { lead: c.accept, cards: [card('Dado', `${c.source}: ${c.total} em uma coleção conhecida.`), card('Quando', `Selecionar ${c.filter} no filtro.`), card('Então', `Exibir ${c.count} e preservar os ${c.total} da coleção original.`)], note: 'Crie também um critério para filtro sem resultado e para dado inválido. Não apague a coleção ao filtrar.' },
        s19: { cards: [card('Essencial agora', `Consultar ${c.noun}, preservar a fonte, garantir teclado e proteção da saída.`), card('Importante depois', 'Combinar filtros adicionais, se a necessidade for validada e o esforço couber.'), card('Pode esperar', 'Animações decorativas e temas visuais personalizados.')], note: 'A prioridade proposta deve ser justificada; não é uma regra fixa para qualquer projeto.' },
        s21: { steps: [`${c.source}: registro`, `ACH-${id}01: achado`, `NEC-${id}01: necessidade`, `RF-${id}01: requisito`, `CA-${id}01: critério`], example: c.accept, note: `Registre HIP-${id}01 como pendente. O resultado esperado do teste não prova utilidade fora deste cenário.` },
        s22: { example: `HIP-${id}01: ${c.hypothesis}`, note: c.pending + ' Não substitua a validação por uma resposta de IA.' },
        s24: { lead: `Produzam o catálogo da trilha ${c.shortLabel}. Usem ${c.source}, os registros fictícios complementares ou uma hipótese marcada como pendente.`, note: 'Os exemplos são ponto de partida, não respostas automaticamente aprovadas. Revise e escreva suas decisões.' },
        s25: { example: `Par coerente: ${c.source} + RF-${id}01 + CA-${id}01. Par incoerente: contagem de linhas + afirmação sobre todas as pessoas.`, note: 'Pergunte à outra dupla qual alteração deixaria o requisito testável. Registre a pendência quando não houver resposta.' },
        s26: { example: c.next }
      },
      missions: missionsById,
      catalogExamples: {
        RF: { text: c.rf, source: c.source + ': ' + c.sourceDescription, sourceStatus: 'evidence', criterion: c.accept },
        RNF: { text: c.rnf, source: c.sourceRnf, sourceStatus: 'evidence', criterion: 'Dado o filtro carregado e o ponteiro sem uso, quando navegar com Tab e selecionar a opção pelo teclado, então concluir a filtragem com foco visível e sem bloqueio de navegação.' },
        RD: { text: c.rd, source: c.sourceRd, sourceStatus: 'evidence', criterion: `Dado um registro da base v1, quando validar o campo ${c.filter === 'festa' ? 'tema' : 'período'}, então aceitar somente um dos três valores definidos no dicionário e rejeitar campo vazio ou outro valor.` }
      },
      syntheticRecords: [
        { id: c.source, kind: 'evidence', description: c.sourceDescription },
        { id: `EV-${id}02`, kind: 'evidence', description: c.sourceRd },
        { id: `EV-${id}03`, kind: 'evidence', description: c.sourceRnf },
        { id: `HIP-${id}01`, kind: 'hypothesis_pending', description: c.hypothesis },
        { id: `RN-${id}01`, kind: 'fictional_policy', description: c.rule }
      ]
    };
  }
  return {
    version: '1.0.0', criteriaVersion: '1.0.0', answerKeyVersion: '1.0.0', lessonId: 'ppi-aula08',
    tracks: { memorias: buildTrack(contexts.memorias), permanencia: buildTrack(contexts.permanencia) },
    slides, missions,
    sources: [
      { title: 'Modelagem de Sistemas — Da coleta à análise (slides 1–19)', url: 'https://docs.google.com/presentation/d/1D30gYjMJhvq15oYnEsUCer0AIcPMvzTg/edit', note: 'Referência didática consultada como PPTX pelo Drive; conceitos adaptados. Regras e dados sensíveis não foram copiados.' },
      { title: 'Dicionário de Dados e Casos de Uso Textuais (slides 4–9 e 14–18)', url: 'https://docs.google.com/presentation/d/15qqM7TqYZsDeoOlVRoP-3KX4eXVKiheg/edit', note: 'Usada para significado/origem/valores de dados e cenários alternativos, sem antecipar uma aula completa de casos de uso.' },
      { title: 'ISO/IEC/IEEE 29148:2018 — Requirements engineering', url: 'https://www.iso.org/standard/72089.html', note: 'Referência conceitual para necessidades, requisitos e gestão; catálogo público consultado, sem declaração de conformidade.' },
      { title: 'ISO/IEC 25010:2023 — Product quality model', url: 'https://www.iso.org/standard/78176.html', note: 'Modelo de qualidade de produto; propriedades devem poder ser especificadas e avaliadas.' },
      { title: 'W3C — WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/', note: 'Meta AA para critérios verificáveis, sem alegação de auditoria humana completa.' }
    ]
  };
});
