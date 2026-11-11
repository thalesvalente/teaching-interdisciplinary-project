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
    { id: 's01', kind: 'cover', kicker: 'PPI I · Aula 08 · 50 minutos', title: 'Da evidência ao requisito', lead: 'Uma boa ideia precisa de origem, precisão e um jeito de conferir.', cards: [card('Sua missão', 'Transformar pistas em um catálogo mínimo de requisitos.'), card('Seu produto', '1 RF + 1 RNF verificável + 1 requisito de dados, todos com fonte e critério.')], note: '100 XP de treino. Não são nota oficial. Todos os exemplos são fictícios.' },
    { id: 's02', kind: 'concept', kicker: 'Retomada · 5 min', title: 'Antes de propor, o que sabemos?', lead: 'O material da Aula 07 reúne entrevista, observação e documentos. Agora vamos analisar seus possíveis resultados.', cards: [card('Pergunta de partida', '“Queremos um aplicativo melhor.” O que ainda falta saber?'), card('Converse em dupla', 'Quem precisa? Para quê? Qual registro sustenta isso?'), card('Resposta comentada', 'A frase indica uma solicitação vaga. Ela ainda não define uma necessidade verificável.')], note: 'Retome a investigação: um pedido de solução precisa de contexto, fonte e objetivo.' },
    { id: 's03', kind: 'concept', kicker: 'Escolha uma trilha', title: 'Um laboratório de decisões', lead: 'Escolha a trilha no topo. Os exemplos mudam e cada trilha guarda seu próprio percurso.', cards: [card('Memórias', 'Localizar relatos inventados por tema, sem nomes, vozes ou coordenadas reais.'), card('Permanência', 'Consultar contagens sintéticas por período, sem identificar estudantes.'), card('Limite comum', 'Nenhum caso autoriza coleta, contato externo ou decisões sobre pessoas.')], note: 'Casos fictícios para aprender requisitos; não são retratos de comunidades ou turmas reais.' },
    { id: 's04', kind: 'concept', kicker: 'O caminho da análise', title: 'Da pista ao teste', lead: 'O registro vem primeiro; a interpretação precisa continuar ligada a ele.', steps: ['Registro / observação', 'Achado + evidência', 'Necessidade', 'Requisito', 'Critério de aceitação', 'Rastro entre os IDs'], cards: [card('Não é uma receita automática', 'Volte à fonte quando houver dúvida, conflito ou nova informação.')], note: 'Evidência sustenta uma afirmação dentro de um contexto; não prova qualquer interpretação.' },
    { id: 's05', kind: 'concept', kicker: 'Quatro etiquetas', title: 'O que este registro permite dizer?', cards: [card('Achado', 'Uma conclusão relevante extraída do que foi examinado.'), card('Evidência', 'O registro identificável que sustenta o achado, com origem e limites.'), card('Hipótese', 'Uma explicação ou suposição ainda não confirmada.'), card('Pendência', 'Uma informação, decisão ou validação que ainda falta.')], note: 'Um registro pode servir como evidência de um achado, sem confirmar sua causa.' },
    { id: 's06', kind: 'concept', kicker: 'Nem toda fala vira requisito', title: 'Dúvida e pedido também têm lugar', lead: '“Não sabemos” é um resultado útil quando a lacuna fica registrada.', cards: [card('Solicitação', '“Inclua um botão de busca.” É uma proposta de solução: pergunte qual necessidade atende.'), card('Dúvida', '“Qual período deve aparecer?” É uma pergunta aberta que pode gerar uma pendência.'), card('Fonte com limite', 'Um teste fictício sustenta conclusões sobre aquele teste, não sobre toda a realidade.')], note: 'Ausência de dado não significa zero. Associação não comprova causa.' },
    { id: 's07', kind: 'mission', kicker: 'Missão 1 · 10 XP', title: 'Separe as pistas', missionId: 'm1', lead: 'Leia o registro e escolha a classificação que melhor representa sua função.' },
    { id: 's08', kind: 'concept', kicker: 'Do problema à intenção', title: 'Necessidade do usuário ≠ solução pronta', cards: [card('Necessidade / requisito de usuário', 'Descreve o objetivo em linguagem compreensível para quem usa.'), card('Requisito de sistema', 'Especifica comportamento ou condição que o sistema deverá atender.'), card('A ponte', 'Explique como o comportamento proposto ajuda a alcançar o objetivo.')], note: 'Detalhar não significa escolher uma tecnologia cedo demais. Valide a necessidade.' },
    { id: 's09', kind: 'concept', kicker: 'Exemplo comentado', title: 'Uma necessidade, uma resposta verificável', lead: 'Compare o objetivo da pessoa com o comportamento esperado do sistema.', cards: [card('Necessidade', 'Encontrar a informação pertinente sem percorrer toda a coleção.'), card('Requisito', 'O sistema deve filtrar os registros pela categoria escolhida.'), card('Verificação', 'Uma coleção conhecida permite prever exatamente quais registros aparecem.')], note: 'A fonte justifica a necessidade; o critério torna o comportamento observável.' },
    { id: 's10', kind: 'mission', kicker: 'Missão 2 · 15 XP', title: 'Reconheça a necessidade e o sistema', missionId: 'm2', lead: 'Escolha primeiro o objetivo do usuário e depois a especificação do sistema.' },
    { id: 's11', kind: 'concept', kicker: 'Tipos de requisito · parte 1', title: 'Função e qualidade', cards: [card('RF · funcional', 'Ação, serviço ou resposta que o sistema deve oferecer.'), card('RNF · não funcional', 'Qualidade ou limite observável: desempenho, acesso, proteção, compatibilidade.'), card('Uma função pode ter vários RNFs', 'Filtrar é uma função. Tempo de resposta e uso por teclado são condições de qualidade.')], note: 'Usabilidade e acessibilidade precisam de condições de teste. “Fácil” sozinho não basta.' },
    { id: 's12', kind: 'concept', kicker: 'Tipos de requisito · parte 2', title: 'Dados e regras do domínio', cards: [card('RD · requisito de dados', 'Define significado, formato, valores permitidos, origem ou obrigatoriedade de um dado.'), card('RN · regra de negócio', 'É uma política ou condição do domínio; pode existir mesmo sem software.'), card('Da regra ao comportamento', 'Uma regra de publicação pode gerar RFs de validação e RNFs de proteção.')], note: 'Aqui, RD é uma categoria didática do catálogo. Não é uma taxonomia exclusiva imposta pela ISO.' },
    { id: 's13', kind: 'concept', kicker: 'Qualidade da especificação', title: 'Seis perguntas para revisar', cards: [card('Clareza + singularidade', 'A frase tem um sentido claro e uma obrigação principal?'), card('Verificabilidade', 'Como observar se foi atendida?'), card('Viabilidade + necessidade', 'Cabe nos recursos? Atende um objetivo sustentado?'), card('Consistência', 'Concorda com os outros requisitos, regras e dados?')], note: 'Uma obrigação por item ajuda a revisar, priorizar e testar. Divida frases que misturam funções.' },
    { id: 's14', kind: 'mission', kicker: 'Missão 3 · 20 XP', title: 'Dê o nome certo a cada condição', missionId: 'm3', lead: 'Identifique RF, RNF, requisito de dados e regra de negócio pelo foco da frase.' },
    { id: 's15', kind: 'concept', kicker: 'RNF verificável', title: 'Troque “rápido” por um teste', lead: 'Declare operação, ambiente, carga, medida e limite.', cards: [card('Vago', '“O sistema deve ser muito rápido.”'), card('Proposta testável', 'Com 100 registros sintéticos já carregados, o filtro deve responder em até 1 s em cada uma de 10 execuções no computador de referência.'), card('Ainda falta combinar', 'Documentar o computador e o navegador de referência e validar a meta com a equipe.')], note: 'Os números são metas fictícias propostas, não resultados medidos nem garantias do protótipo.' },
    { id: 's16', kind: 'concept', kicker: 'Qualidade também é acesso e proteção', title: 'Quem consegue usar? O que pode aparecer?', cards: [card('Acesso', 'Concluir a filtragem só com teclado, com foco visível e sem ficar preso.'), card('Proteção', 'Na saída pública do caso fictício, revelar apenas campos explicitamente permitidos.'), card('Teste negativo', 'Tente o caminho proibido: dado restrito, opção ausente ou acesso não permitido.')], note: 'Não transforme “seguro” em promessa absoluta. Defina uma ameaça, uma condição e uma verificação.' },
    { id: 's17', kind: 'mission', kicker: 'Missão 4 · 15 XP', title: 'Conserte o requisito vago', missionId: 'm4', lead: 'Prefira condições mensuráveis e verificações de acesso e proteção.' },
    { id: 's18', kind: 'concept', kicker: 'Critério de aceitação', title: 'Dado · Quando · Então', cards: [card('Dado', 'O estado inicial e os dados conhecidos.'), card('Quando', 'A ação ou evento que dispara o comportamento.'), card('Então', 'O resultado observável, com conteúdo e limites definidos.')], note: 'Um critério não cobre tudo. Inclua também situações vazias, inválidas ou restritas quando aplicável.' },
    { id: 's19', kind: 'concept', kicker: 'Prioridade e escopo mínimo', title: 'O que precisa caber na primeira entrega?', cards: [card('Essencial agora', 'Sem isso, o objetivo principal ou uma proteção necessária falha.'), card('Importante depois', 'Agrega valor, mas existe uma alternativa temporária aceitável.'), card('Pode esperar', 'Conveniência com baixo impacto no objetivo atual.')], note: 'Decida por valor, risco, esforço e dependências. Privacidade e acesso não viram enfeite opcional.' },
    { id: 's20', kind: 'mission', kicker: 'Missão 5 · 20 XP', title: 'Defina o aceite e faça escolhas', missionId: 'm5', lead: 'Construa um teste claro, encontre a ambiguidade e priorize o mínimo útil.' },
    { id: 's21', kind: 'concept', kicker: 'Rastreabilidade', title: 'Cada requisito precisa de um caminho de volta', lead: 'IDs permitem explicar de onde veio, por que existe e como será verificado.', steps: ['EV-01: registro', 'ACH-01: achado', 'NEC-01: necessidade', 'RF-01: requisito', 'CA-01: critério'], cards: [card('Mão dupla', 'Da fonte, descubra os requisitos afetados. Do requisito, volte à fonte.')], note: 'Uma hipótese pode originar um requisito candidato, desde que ambos mantenham a validação pendente.' },
    { id: 's22', kind: 'concept', kicker: 'Incerteza visível', title: 'O que fazer quando a fonte não basta?', cards: [card('Fonte contraditória', 'Mantenha as versões e registre a divergência. Não escolha a mais conveniente.'), card('Hipótese pendente', 'Marque o requisito como candidato e descreva o que precisa ser validado.'), card('IA como apoio', 'Pode sugerir redação. Pode errar ou inventar. A fonte e a revisão humana continuam necessárias.')], note: 'Não envie dados pessoais para ferramentas. Uma resposta de IA não comprova uma necessidade real.' },
    { id: 's23', kind: 'mission', kicker: 'Missão 6 · 20 XP', title: 'Feche a cadeia sem inventar elos', missionId: 'm6', lead: 'Monte o rastro correto e confira se fonte, requisito e critério combinam.' },
    { id: 's24', kind: 'catalog', kicker: 'Oficina em equipe · 7 min', title: 'Seu catálogo mínimo', lead: 'Escrevam um RF, um RNF verificável e um requisito de dados. Usem somente o cenário sintético.', cards: [card('Para cada item', 'Descrição, ID da fonte, situação da fonte, prioridade e critério Dado/Quando/Então.'), card('Fonte ainda é hipótese?', 'Marque “hipótese pendente”. Registrar um texto não valida seu conteúdo.')], note: 'Este é um rascunho local, sem identificação obrigatória, correção semântica automática ou nota.' },
    { id: 's25', kind: 'review', kicker: 'Revisão em dupla · 3 min', title: 'Uma dupla escreve; outra tenta verificar', lead: 'Leiam o catálogo da equipe e procurem um ponto que ainda possa causar dúvida.', cards: [card('Confiram o rastro', 'A fonte realmente sustenta a necessidade e o requisito?'), card('Tentem o teste', 'O resultado esperado está claro? Existe um caso que deveria ser recusado?'), card('Revisem uma frase', 'Registrem o ajuste e o que ainda depende do professor ou de validação futura.')], note: 'O checklist é autoavaliação guiada. Somente a revisão humana pode julgar a qualidade da resposta aberta.' },
    { id: 's26', kind: 'exit', kicker: 'Síntese e ticket de saída · 5 min', title: 'Uma decisão que você consegue explicar', lead: 'Qual requisito você consegue rastrear? Que hipótese ainda precisa de validação?', cards: [card('Leve com você', 'Origem → necessidade → requisito → critério. Preserve dúvidas e limites.'), card('Próximo passo proposto', 'Usar o catálogo para orientar os dados e a modelagem lógica.'), card('Guarde seu percurso', 'Exporte ou imprima a síntese local. Você decide se e onde compartilhar.')], note: 'XP de treino, completude, avaliação docente e nota oficial são domínios diferentes.' }
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
