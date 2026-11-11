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
    {
        "id": "s01",
        "kind": "cover",
        "kicker": "Aula 08 · Prática Profissional Integrada · 50 minutos",
        "title": "Da observação ao requisito",
        "lead": "Hoje vamos trabalhar com um caso completo, desde os dados de exemplo até um requisito que podemos testar.",
        "cards": [
            {
                "title": "Um caso que você poderá consultar",
                "text": "Na tela 3 há uma tabela fictícia com seis registros. Ela será nossa fonte durante a aula."
            },
            {
                "title": "O que você produzirá",
                "text": "Uma função do sistema, uma condição de qualidade, um requisito de dados e seus testes."
            }
        ],
        "note": "Os exemplos foram criados para esta aula. Nada foi coletado de pessoas ou comunidades reais."
    },
    {
        "id": "s02",
        "kind": "concept",
        "kicker": "Etapa de preparação · contexto",
        "title": "Que problema vamos investigar?",
        "lead": "Escolha uma das duas histórias fictícias no campo Trilha, acima. A estrutura de aprendizado é a mesma.",
        "cards": [
            {
                "title": "Contexto",
                "text": "Vamos construir um pequeno sistema de consulta a registros de exemplo."
            },
            {
                "title": "Pergunta inicial",
                "text": "Como mostrar apenas os registros procurados sem perder a coleção original?"
            },
            {
                "title": "A fonte estará na tela seguinte",
                "text": "Primeiro conheceremos os dados. Só depois criaremos hipóteses e requisitos."
            }
        ],
        "note": "As histórias são simulações didáticas, não relatos de uma visita ou entrevista já realizada."
    },
    {
        "id": "s03",
        "kind": "case",
        "kicker": "Estudo de caso · dados disponíveis aqui",
        "title": "Esta é a tabela do nosso exercício",
        "lead": "Leia os seis registros fictícios. Esta tabela é nossa fonte e poderá ser reaberta em qualquer missão.",
        "note": "Consulte as linhas; você não precisa procurar um arquivo externo. Todos os campos e valores são inventados."
    },
    {
        "id": "s04",
        "kind": "concept",
        "kicker": "Conceito · Engenharia de Requisitos",
        "title": "Afinal, o que é um requisito?",
        "lead": "É uma condição ou capacidade necessária para atingir um objetivo, que o sistema deverá atender.",
        "cards": [
            {
                "title": "Em palavras simples",
                "text": "Um requisito diz o que a solução precisa oferecer ou respeitar."
            },
            {
                "title": "Um requisito deste caso",
                "text": "O sistema deve permitir filtrar os registros por uma categoria escolhida."
            },
            {
                "title": "Uma frase que ainda não é requisito claro",
                "text": "“O aplicativo deve ser excelente.” Como saber se isso foi atendido?"
            }
        ],
        "note": "Definição didática baseada na ISO/IEC/IEEE 29148:2018, Pfleeger (2004) e Nuseibeh/Easterbrook (2000)."
    },
    {
        "id": "s05",
        "kind": "concept",
        "kicker": "Entender a tabela · antes de propor solução",
        "title": "O que é fato e o que é interpretação?",
        "cards": [
            {
                "title": "Evidência",
                "text": "O registro que podemos consultar para conferir uma afirmação."
            },
            {
                "title": "Achado",
                "text": "A conclusão que os dados sustentam, sem extrapolar o que foi mostrado."
            },
            {
                "title": "Hipótese",
                "text": "Uma ideia que pode fazer sentido, mas ainda precisa ser confirmada."
            },
            {
                "title": "Pendência",
                "text": "Uma pergunta ou decisão para a qual ainda não temos resposta."
            }
        ],
        "note": "Na próxima missão, você identificará cada elemento usando os seis registros da tela 3."
    },
    {
        "id": "s06",
        "kind": "concept",
        "kicker": "Do registro ao problema",
        "title": "Um dado não vira requisito automaticamente",
        "lead": "Ter três registros de uma categoria não prova que alguém precisa de um filtro. É necessário distinguir informação e necessidade.",
        "cards": [
            {
                "title": "O que sabemos",
                "text": "A tabela possui registros organizados por categoria."
            },
            {
                "title": "O que imaginamos",
                "text": "Talvez seja útil consultar apenas uma categoria por vez."
            },
            {
                "title": "O que falta descobrir",
                "text": "Quem consultará? Para qual tarefa? A divisão por categoria realmente ajuda?"
            }
        ],
        "note": "A hipótese é útil para investigar, mas ainda não equivale a uma necessidade validada."
    },
    {
        "id": "s07",
        "kind": "mission",
        "kicker": "Missão 1 · 10 XP formativos",
        "title": "Leia a tabela e classifique",
        "missionId": "m1",
        "lead": "Use a tabela da tela 3 ou o botão “Ver dados do caso” para responder."
    },
    {
        "id": "s08",
        "kind": "concept",
        "kicker": "Transformação 1 · necessidade do usuário",
        "title": "Qual é o objetivo de quem usa?",
        "lead": "A mesma situação pode ser descrita como necessidade, serviço esperado e comportamento do sistema.",
        "cards": [
            {
                "title": "Necessidade",
                "text": "O resultado que a pessoa deseja alcançar."
            },
            {
                "title": "Requisito de usuário",
                "text": "O serviço que ela espera, descrito em linguagem próxima da sua."
            },
            {
                "title": "Requisito de sistema",
                "text": "O comportamento ou a condição que o software precisará cumprir."
            }
        ],
        "note": "A necessidade é candidata neste exercício; o uso real ainda dependeria de confirmação."
    },
    {
        "id": "s09",
        "kind": "concept",
        "kicker": "Transformação 2 · escrever o requisito",
        "title": "Um exemplo completo, três níveis",
        "lead": "Veja a evolução do mesmo filtro: objetivo → serviço esperado → obrigação do sistema.",
        "cards": [
            {
                "title": "Necessidade",
                "text": "Localizar os registros pertinentes sem ler a coleção inteira."
            },
            {
                "title": "Requisito de usuário",
                "text": "Quero escolher uma categoria e ver apenas os registros correspondentes."
            },
            {
                "title": "Requisito de sistema",
                "text": "O sistema deve exibir a seleção e manter todos os registros originais."
            }
        ],
        "note": "A ação concreta do sistema permitirá escrever um teste objetivo mais adiante."
    },
    {
        "id": "s10",
        "kind": "mission",
        "kicker": "Missão 2 · 15 XP formativos",
        "title": "Da necessidade à função",
        "missionId": "m2",
        "lead": "Identifique o objetivo da pessoa e o comportamento do sistema no mesmo exemplo."
    },
    {
        "id": "s11",
        "kind": "concept",
        "kicker": "Classificar requisitos · comportamento e qualidade",
        "title": "O que o sistema faz? Como deve funcionar?",
        "cards": [
            {
                "title": "Funcional",
                "text": "Descreve um comportamento do sistema, por exemplo filtrar registros."
            },
            {
                "title": "Não funcional",
                "text": "Descreve uma condição de qualidade: acessibilidade, segurança, desempenho."
            },
            {
                "title": "No nosso exemplo",
                "text": "Filtrar é a função; permitir o uso por teclado é uma condição de qualidade."
            }
        ],
        "note": "Na documentação, essas categorias são abreviadas como RF e RNF, mas não é preciso decorá-las."
    },
    {
        "id": "s12",
        "kind": "concept",
        "kicker": "Classificar requisitos · informações e regras",
        "title": "Quais dados serão usados? Que regra respeitar?",
        "cards": [
            {
                "title": "Requisito de dados",
                "text": "Define campos, significados, valores permitidos e origem dos registros."
            },
            {
                "title": "Regra de negócio",
                "text": "Política do contexto que poderia existir mesmo sem software."
            },
            {
                "title": "Aplicação ao caso",
                "text": "A categoria define o filtro; a revisão do registro determina se ele pode ser publicado."
            }
        ],
        "note": "A regra de publicação foi inventada para a atividade. Não é regra oficial de nenhuma instituição ou comunidade."
    },
    {
        "id": "s13",
        "kind": "concept",
        "kicker": "Qualidade da especificação",
        "title": "Como escrever sem gerar dúvidas?",
        "cards": [
            {
                "title": "Uma obrigação por frase",
                "text": "Evite misturar várias funções e qualidades em uma mesma declaração."
            },
            {
                "title": "Resultado que se pode conferir",
                "text": "Diga quais registros devem aparecer e quais devem permanecer guardados."
            },
            {
                "title": "Origem e consistência",
                "text": "A redação deve combinar com a tabela e com as regras já apresentadas."
            }
        ],
        "note": "Clareza, verificabilidade, necessidade e consistência ajudam a revisar uma especificação."
    },
    {
        "id": "s14",
        "kind": "mission",
        "kicker": "Missão 3 · 20 XP formativos",
        "title": "Diferencie os tipos de requisito",
        "missionId": "m3",
        "lead": "Classifique a função, a qualidade, os campos e a política do mesmo caso."
    },
    {
        "id": "s15",
        "kind": "concept",
        "kicker": "Qualidade verificável · desempenho",
        "title": "“Rápido” não é uma medida",
        "lead": "Para avaliar desempenho, devemos declarar a operação, os dados, o tempo esperado e como testar.",
        "cards": [
            {
                "title": "Vago",
                "text": "“O filtro deve ser rápido.”"
            },
            {
                "title": "Proposta de requisito verificável",
                "text": "Com os seis registros do exercício, filtrar em até 1 segundo, nas 10 tentativas feitas no navegador de referência."
            },
            {
                "title": "Ainda falta validar",
                "text": "A equipe precisa definir o ambiente de teste e confirmar se a meta é viável."
            }
        ],
        "note": "Um segundo é uma meta fictícia proposta, não uma medição feita nesta aula."
    },
    {
        "id": "s16",
        "kind": "concept",
        "kicker": "Qualidade verificável · acesso e proteção",
        "title": "O mesmo filtro precisa ser acessível e seguro",
        "cards": [
            {
                "title": "Acesso por teclado",
                "text": "A pessoa deve conseguir escolher a categoria e concluir o filtro sem usar mouse."
            },
            {
                "title": "Proteção da saída pública",
                "text": "Só registros marcados como revisados poderiam aparecer em uma publicação."
            },
            {
                "title": "Verificação",
                "text": "Testar teclado e tentar publicar um registro não revisado: ele deve ficar de fora."
            }
        ],
        "note": "Filtrar internamente não é o mesmo que publicar. As duas operações têm regras distintas."
    },
    {
        "id": "s17",
        "kind": "mission",
        "kicker": "Missão 4 · 15 XP formativos",
        "title": "Torne a qualidade verificável",
        "missionId": "m4",
        "lead": "Compare uma exigência vaga com condições concretas para o mesmo filtro."
    },
    {
        "id": "s18",
        "kind": "concept",
        "kicker": "Especificação de teste · critério de aceitação",
        "title": "Como saber se o filtro ficou correto?",
        "lead": "Um critério de aceitação descreve a situação inicial, a ação realizada e o resultado observável.",
        "cards": [
            {
                "title": "Dado",
                "text": "Existe uma coleção conhecida de seis registros."
            },
            {
                "title": "Quando",
                "text": "A pessoa escolhe a categoria indicada."
            },
            {
                "title": "Então",
                "text": "Aparecem exatamente os registros esperados, sem apagar os originais."
            }
        ],
        "note": "O exemplo usa os mesmos seis registros da tela 3; experimente conferir quais códigos aparecem."
    },
    {
        "id": "s19",
        "kind": "concept",
        "kicker": "Planejar a primeira entrega",
        "title": "O que é essencial agora?",
        "cards": [
            {
                "title": "Essencial",
                "text": "Filtrar corretamente, preservar a coleção e respeitar as proteções necessárias."
            },
            {
                "title": "Desejável depois",
                "text": "Oferecer filtros adicionais, se a necessidade for confirmada."
            },
            {
                "title": "Pode esperar",
                "text": "Animações e temas visuais que não mudam a tarefa principal."
            }
        ],
        "note": "Esta escolha organiza a lista de trabalho, também chamada de backlog: o conjunto de itens a implementar."
    },
    {
        "id": "s20",
        "kind": "mission",
        "kicker": "Missão 5 · 20 XP formativos",
        "title": "Escolha o teste e a prioridade",
        "missionId": "m5",
        "lead": "Verifique o mesmo filtro, revise uma frase ambígua e decida o mínimo útil."
    },
    {
        "id": "s21",
        "kind": "concept",
        "kicker": "Organizar a documentação",
        "title": "Como explicar de onde veio o requisito?",
        "lead": "Rastreabilidade é conseguir percorrer o mesmo caso da fonte até o teste — e voltar quando algo mudar.",
        "cards": [
            {
                "title": "Origem",
                "text": "Começamos com a tabela fictícia que você consultou."
            },
            {
                "title": "Decisão",
                "text": "A equipe registra o achado, a necessidade candidata e a obrigação do filtro."
            },
            {
                "title": "Verificação",
                "text": "O critério de aceitação confere o resultado usando aquela mesma tabela."
            }
        ],
        "note": "O botão “Ver dados e evolução” reúne o material mostrado nesta página. Não existe arquivo externo oculto."
    },
    {
        "id": "s22",
        "kind": "concept",
        "kicker": "Revisão crítica · duas perguntas",
        "title": "Verificar não é o mesmo que validar",
        "cards": [
            {
                "title": "Verificação",
                "text": "O sistema filtra exatamente as linhas que a especificação determinou?"
            },
            {
                "title": "Validação",
                "text": "Filtrar por essa categoria realmente ajuda a pessoa a resolver o problema?"
            },
            {
                "title": "Se a resposta mudar",
                "text": "Ajustamos necessidade, requisito e teste; preservamos o motivo da mudança."
            }
        ],
        "note": "Sem contato autorizado com pessoas reais, a validação da utilidade permanece pendente."
    },
    {
        "id": "s23",
        "kind": "mission",
        "kicker": "Missão 6 · 20 XP formativos",
        "title": "Ligue fonte, requisito e teste",
        "missionId": "m6",
        "lead": "Escolha a cadeia de decisões que usa a mesma tabela e não transforma hipótese em fato."
    },
    {
        "id": "s24",
        "kind": "catalog",
        "kicker": "Oficina · 7 minutos",
        "title": "Escreva os requisitos do seu caso",
        "lead": "Com a tabela visível no botão “Ver dados e evolução”, escreva uma função, uma condição de qualidade e um requisito de dados.",
        "note": "Cada item precisa de texto, origem e teste. O formulário é local; exemplos são apenas apoio à reflexão."
    },
    {
        "id": "s25",
        "kind": "review",
        "kicker": "Revisão em dupla · 3 minutos",
        "title": "Outra pessoa consegue testar seu requisito?",
        "lead": "Confiram juntos se cada enunciado combina com a tabela e se o teste deixa claro o resultado esperado.",
        "note": "Marcar o checklist registra uma autoavaliação, não uma aprovação automática."
    },
    {
        "id": "s26",
        "kind": "exit",
        "kicker": "Síntese · 5 minutos",
        "title": "Da tabela ao requisito que podemos testar",
        "lead": "Explique um exemplo completo: dado conhecido → conclusão → necessidade → requisito → teste.",
        "note": "As atividades usam dados inventados. Os pontos de treino não são nota oficial; a exportação é voluntária."
    }
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
      source: 'EV-M01', sourceDescription: 'Ficha fictícia: seis relatos, três sobre festas, dois sobre trabalho e um sobre paisagens.', fixtureOverview: 'Seis relatos inventados: três sobre festas, dois sobre trabalho e um sobre paisagens. Não há nomes ou locais reais.',
      finding: 'A coleção de teste contém relatos de três temas.', hypothesis: 'Talvez agrupar por tema facilite a consulta de quem usa o acervo.', pending: 'Falta validar com o professor se tema é o melhor filtro para este objetivo.',
      need: 'Quem consulta precisa localizar relatos do tema escolhido.', rf: 'O sistema deve exibir os relatos do tema selecionado sem alterar a coleção original.',
      rnf: 'A filtragem deve ser concluída usando apenas o teclado, com foco visível e sem bloqueio de navegação.',
      rd: 'O campo tema é obrigatório e aceita somente festa, trabalho ou paisagem na coleção fictícia.',
      rule: 'Política inventada para o exercício: só itens revisados poderiam aparecer numa divulgação pública.',
      accept: 'Dada a coleção fictícia com seis relatos, quando escolher o tema festa, então mostrar os três relatos de festa e preservar os seis originais.',
      filter: 'festa', count: '3 relatos', total: '6 relatos', dataset: 'acervo sintético', noun: 'relatos',
      protect: 'Na saída pública simulada, mostrar somente código, título e tema dos itens revisados; omitir os itens restritos.',
      unsafe: 'Exibir coordenadas exatas e nomes reais para deixar o mapa completo.',
      sourceRd: 'EV-M02: dicionário fictício v1 define tema obrigatório com três valores permitidos.',
      sourceRnf: 'EV-M03: roteiro fictício de teste solicita filtragem por teclado; a meta deve ser validada pelo professor.',
      next: 'Derivar os campos tema, título e status de revisão; depois discutir suas relações.'
    },
    permanencia: {
      label: 'Permanência / Evasão Estudantil', shortLabel: 'Permanência', description: 'Painel de contagens sintéticas agregadas, sem matrícula, nome, frequência ou nota individual.', prefix: 'P',
      source: 'EV-P01', sourceDescription: 'Tabela fictícia: seis linhas agregadas, três do período 1, duas do período 2 e uma do período 3.', fixtureOverview: 'Seis linhas de exemplo: três do período 1 (P1), duas do período 2 (P2), uma do período 3 (P3). Cada linha resume um grupo, não uma pessoa.',
      finding: 'A tabela de teste contém linhas de três períodos.', hypothesis: 'Talvez consultar por período facilite o planejamento de ações de apoio.', pending: 'Falta validar com o professor se o recorte por período responde à decisão proposta.',
      need: 'A equipe precisa consultar contagens agregadas do período escolhido para planejar apoio.', rf: 'O sistema deve exibir as linhas agregadas do período selecionado sem alterar a tabela original.',
      rnf: 'A filtragem deve ser concluída usando apenas o teclado, com foco visível e sem bloqueio de navegação.',
      rd: 'O campo período é obrigatório e aceita apenas P1 (período 1), P2 (período 2) ou P3 (período 3), todos fictícios.',
      rule: 'Política inventada para o exercício: só tabelas agregadas revisadas poderiam aparecer na apresentação pública.',
      accept: 'Dada a tabela fictícia com seis linhas, quando escolher o período 1 (P1), então mostrar as três linhas desse período e preservar as seis originais.',
      filter: 'P1', count: '3 linhas', total: '6 linhas', dataset: 'tabela sintética', noun: 'linhas agregadas',
      protect: 'Na saída pública simulada, permitir apenas período, categoria e contagem agregada revisada; omitir qualquer identificador individual.',
      unsafe: 'Exibir matrículas e notas individuais para descobrir quem vai abandonar o curso.',
      sourceRd: 'EV-P02: dicionário fictício v1 define período obrigatório com três valores permitidos.',
      sourceRnf: 'EV-P03: roteiro fictício de teste solicita filtragem por teclado; a meta deve ser validada pelo professor.',
      next: 'Derivar os campos período, categoria e contagem; depois discutir suas relações.'
    }
  };
  const glossary = [
    { code: 'EV', term: 'Evidência', meaning: 'Ficha, observação ou documento identificado que pode ser consultado para conferir uma afirmação.' },
    { code: 'ACH', term: 'Achado', meaning: 'Conclusão que podemos tirar da análise do registro, sem afirmar mais do que a fonte mostra.' },
    { code: 'HIP', term: 'Hipótese', meaning: 'Possível explicação ou benefício que ainda precisa de confirmação.' },
    { code: 'PEND', term: 'Pendência', meaning: 'Pergunta ou decisão ainda aberta, a ser validada antes de tratar a ideia como confirmada.' },
    { code: 'NEC', term: 'Necessidade', meaning: 'Problema ou objetivo de quem usará a solução.' },
    { code: 'RU', term: 'Requisito de usuário', meaning: 'Serviço esperado, escrito de modo compreensível para a pessoa que usará o sistema.' },
    { code: 'RF', term: 'Requisito funcional', meaning: 'O que o sistema deve fazer, como filtrar os registros.' },
    { code: 'RNF', term: 'Requisito não funcional', meaning: 'Condição de qualidade ou restrição: teclado, desempenho, proteção de informações.' },
    { code: 'RD', term: 'Requisito de dados', meaning: 'Definição dos dados usados, por exemplo os valores aceitos no campo período.' },
    { code: 'RN', term: 'Regra de negócio', meaning: 'Política do contexto que continuaria valendo mesmo sem o software.' },
    { code: 'CA', term: 'Critério de aceitação', meaning: 'Exemplo de teste com situação inicial, ação e resultado esperado.' },
    { code: 'D0 a D11', term: 'Etapas do dossiê', meaning: 'Numeração interna da evolução do documento. D0 é a ficha inicial e D11 é a revisão final.' },
    { code: 'M / P', term: 'Trilhas', meaning: 'M identifica Memórias; P identifica Permanência. Não são nomes nem códigos de pessoas.' },
    { code: 'R01 / L01', term: 'Registros do exercício', meaning: 'R é relato fictício numerado; L é linha agregada da tabela fictícia. Não representam indivíduos.' },
    { code: 'P1 / P2 / P3', term: 'Períodos fictícios', meaning: 'Período 1, período 2 e período 3. Servem apenas ao exemplo de Permanência.' },
    { code: 'MVP', term: 'Primeira entrega mínima', meaning: 'Menor conjunto útil de funcionalidades e proteções para começar.' },
    { code: 'TRACE / CAT / REV', term: 'Documentação', meaning: 'Códigos internos para rastro entre documentos, catálogo de requisitos e revisão, respectivamente.' },
    { code: 'XP', term: 'Pontos de experiência', meaning: 'Pontuação de treino pelas missões; não corresponde à nota escolar oficial.' }
  ];
  const categories = (correct) => [
    option('a', 'Achado', correct === 'a' ? 'É uma interpretação sustentada pelo registro descrito.' : 'Achado é a conclusão obtida da análise, não qualquer tipo de informação.'),
    option('b', 'Evidência', correct === 'b' ? 'Há um registro identificável que pode ser consultado.' : 'Evidência é o registro que sustenta uma afirmação; uma suposição não vira registro confirmado.'),
    option('c', 'Hipótese', correct === 'c' ? 'A explicação está explicitamente apresentada como algo a confirmar.' : 'Hipótese é uma explicação ainda não confirmada; procure a incerteza sobre a interpretação.'),
    option('d', 'Pendência', correct === 'd' ? 'A frase aponta a validação que ainda falta fazer.' : 'Pendência nomeia uma informação, decisão ou validação ainda ausente.')
  ];
  function typeOptions(correct) {
    return [
      option('a', 'Requisito funcional (RF)', correct === 'a' ? 'O foco é o comportamento que o sistema deve oferecer.' : 'RF descreve ação, serviço ou comportamento do sistema.'),
      option('b', 'Requisito não funcional (RNF)', correct === 'b' ? 'O foco é uma condição de qualidade que limita a execução da função.' : 'RNF define uma qualidade ou limite observável do sistema.'),
      option('c', 'Requisito de dados (RD)', correct === 'c' ? 'O foco é o significado, obrigatoriedade ou domínio de valores de um campo.' : 'RD descreve o dado e suas restrições, não a política inteira do domínio.'),
      option('d', 'Regra de negócio (RN)', correct === 'd' ? 'É uma política fictícia do domínio, válida mesmo se a tarefa fosse feita em papel.' : 'RN é uma condição do domínio; ela pode motivar vários requisitos.')
    ];
  }
  function buildTrack(c) {
    const id = c.prefix;

    const userRequirement = id === 'M'
      ? 'Como visitante do acervo fictício, quero consultar relatos por tema para ler os itens pertinentes.'
      : 'Como integrante da equipe pedagógica fictícia, quero consultar linhas agregadas por período sem identificar alunos.';
    const fixture = id === 'M'
      ? 'Seis relatos fictícios: R01, R02 e R03 sobre festas; R04 e R05 sobre trabalho; R06 sobre paisagem. R significa relato, e o número só identifica um registro.'
      : 'Seis linhas de grupos fictícios: L01, L02 e L03 do período 1 (P1); L04 e L05 do período 2 (P2); L06 do período 3 (P3). L significa linha de tabela; não é identificação de estudante.';
    const dossierStages = [
      { id:'D0', slideId:'s03', title:'Registro', artifactId:c.source, excerpt:fixture },
      { id:'D1', slideId:'s05', title:'Achado', artifactId:`ACH-${id}01`, excerpt:c.finding },
      { id:'D2', slideId:'s06', title:'Hipótese e pendência', artifactId:`HIP-${id}01`, excerpt:c.pending },
      { id:'D3', slideId:'s08', title:'Necessidade e requisito de usuário', artifactId:`RU-${id}01`, excerpt:userRequirement },
      { id:'D4', slideId:'s09', title:'Requisito funcional', artifactId:`RF-${id}01`, excerpt:c.rf },
      { id:'D5', slideId:'s12', title:'Dados e regra', artifactId:`RD-${id}01`, excerpt:c.rd },
      { id:'D6', slideId:'s15', title:'Qualidade mensurável', artifactId:`RNF-${id}02`, excerpt:'Carga de 100 registros; meta de 1 segundo em 10 execuções, ainda pendente de validação.' },
      { id:'D7', slideId:'s18', title:'Critério de aceitação', artifactId:`CA-${id}01`, excerpt:c.accept },
      { id:'D8', slideId:'s19', title:'Escopo mínimo', artifactId:`MVP-${id}01`, excerpt:'Consulta, domínio de dados, acesso e proteção; animações fora do primeiro recorte.' },
      { id:'D9', slideId:'s21', title:'Rastreabilidade', artifactId:`TRACE-${id}01`, excerpt:`${c.source} → ACH-${id}01 → NEC/RU-${id}01 → RF-${id}01 → CA-${id}01` },
      { id:'D10', slideId:'s24', title:'Catálogo mínimo', artifactId:`CAT-${id}01`, excerpt:'Registrar RF, RNF e RD com fonte, prioridade e critério verificável.' },
      { id:'D11', slideId:'s25', title:'Revisão por pares', artifactId:`REV-${id}01`, excerpt:'Revisar a redação; validar a necessidade com pessoas autorizadas em outra etapa.' }
    ];
    const narrativeOverrides = {
      s03: {
        kicker: 'Aula 07 → Aula 08 · exemplo de partida',
        lead: 'Vamos acompanhar a mesma ficha fictícia até chegar a requisitos que possam ser testados.',
        cards: [
          card('1. O registro que recebemos', c.fixtureOverview),
          card('2. O que conseguimos afirmar', c.finding, 'Achado: conclusão apoiada nos dados.'),
          card('3. O que ainda é só uma ideia', c.hypothesis, 'Hipótese: precisa ser confirmada.')
        ],
        note: `Tudo é inventado. Para localizar esta ficha no dossiê, usamos o código ${c.source}: evidência número 1 da trilha ${c.shortLabel}.`
      },
      s05: {
        cards: [
          card('Evidência: o registro', c.fixtureOverview),
          card('Achado: a conclusão', c.finding),
          card('Hipótese: a ideia a testar', c.hypothesis),
          card('Pendência: o que falta saber', c.pending)
        ],
        note: 'Observe: os dados mostram a distribuição, mas não demonstram que a consulta proposta será útil.'
      },
      s06: {
        cards: [
          card('Ideia ainda não comprovada', c.hypothesis),
          card('Pergunta em aberto', c.pending),
          card('Decisão responsável', 'Podemos escrever um requisito provisório, sem afirmar que a necessidade foi validada.')
        ],
        note: 'Uma sugestão de botão é uma possível solução, não uma prova do problema.'
      },
      s08: {
        cards: [
          card('Necessidade: o problema a resolver', c.need),
          card('Requisito de usuário: o serviço esperado', userRequirement),
          card('Próximo passo', 'Escrever o que o sistema deverá fazer para atender ao serviço esperado.')
        ],
        note: 'Primeiro compreendemos o objetivo da pessoa; só depois descrevemos a obrigação do software.'
      },
      s09: {
        cards: [
          card('Necessidade de quem consulta', c.need),
          card('Serviço esperado por quem usa', userRequirement),
          card('Comportamento que o sistema deve oferecer', c.rf)
        ],
        note: 'São três níveis do MESMO problema. O próximo passo é verificar o comportamento com a ficha inicial.'
      },
      s11: {
        cards: [
          card('Requisito funcional: o que o sistema faz', c.rf),
          card('Requisito não funcional: como deve funcionar', c.rnf),
          card('Mesma função, outra condição', 'O filtro continua igual. Agora exigimos que ele também funcione por teclado.')
        ],
        note: 'Na documentação, RF é requisito funcional e RNF é requisito não funcional; as siglas são apenas abreviações.'
      },
      s12: {
        cards: [
          card('Requisito de dados: campo e valores', c.rd),
          card('Regra de negócio: política fictícia', c.rule),
          card('Ligação com o filtro', 'O campo limita as opções da consulta. A regra determina o que poderia ser divulgado.')
        ],
        note: 'RD significa requisito de dados e RN significa regra de negócio. Os códigos documentais não são dados de alunos ou de comunidades.'
      },
      s13: {
        cards: [
          card('Requisito que vamos revisar', c.rf),
          card('Qual resultado permitiria testá-lo?', `Selecionar ${c.filter === 'P1' ? 'período 1 (P1)' : 'tema festa'}, mostrar ${c.count} e preservar ${c.total}.`),
          card('O que ainda falta confirmar?', c.pending)
        ],
        note: 'A redação precisa ser clara e verificar um resultado; a utilidade ainda requer confirmação.'
      },
      s15: {
        cards: [
          card('Função já definida', c.rf),
          card('Condição de desempenho proposta', 'Com 100 registros fictícios, o filtro deverá responder em até um segundo em 10 testes.'),
          card('Por que são 100 agora?', 'São dados extras para medir desempenho, diferentes dos seis registros usados na explicação.')
        ],
        note: 'A meta é uma proposta de requisito, não um resultado medido. É preciso definir o computador e validar a viabilidade.'
      },
      s16: {
        cards: [
          card('Acessibilidade: funcionar por teclado', c.rnf),
          card('Proteção: mostrar somente o permitido', c.protect),
          card('Como verificar?', 'Tentar acessar dados restritos e confirmar que eles não aparecem na saída pública simulada.')
        ],
        note: 'São duas condições distintas da mesma função, e cada uma precisa de um teste.'
      },
      s18: {
        lead: c.accept,
        cards: [
          card('Dado: situação inicial', `A ficha de exemplo contém ${c.total}.`),
          card('Quando: ação realizada', `A pessoa escolhe ${c.filter === 'P1' ? 'período 1 (P1)' : 'tema festa'}.`),
          card('Então: resultado esperado', `Aparecem ${c.count}, sem apagar os ${c.total}.`)
        ],
        note: 'Isto é um critério de aceitação: um exemplo verificável. Não comprova, sozinho, a utilidade para pessoas reais.'
      },
      s19: {
        cards: [
          card('Essencial na primeira versão', 'Consulta, dados corretos, uso por teclado e proteção da saída.'),
          card('Desejável depois', 'Adicionar outros filtros apenas se a necessidade for confirmada.'),
          card('Pode esperar', 'Efeitos visuais e personalizações não essenciais.')
        ],
        note: 'Priorizar é decidir o que fazer agora, considerando valor, riscos, esforço e dependências.'
      },
      s21: {
        steps: ['Evidência: registro', 'Achado: conclusão', 'Necessidade: objetivo', 'Requisito: obrigação', 'Critério: teste'],
        example: `Exemplo: selecionar ${c.filter === 'P1' ? 'o período 1' : 'o tema festa'} deve mostrar ${c.count} e preservar ${c.total}. A fonte é a ficha inicial.`,
        note: 'Os códigos ligam documentos. Consulte “Entenda os códigos”; não é preciso decorá-los.'
      },
      s22: {
        cards: [
          card('Verificar: o sistema faz o que foi escrito?', `Ao escolher ${c.filter === 'P1' ? 'período 1 (P1)' : 'festa'}, o filtro mostra ${c.count}?`),
          card('Validar: isso resolve a necessidade?', c.pending),
          card('Se algo mudar...', 'Revisamos juntos a fonte, o requisito, o campo e o teste. Mantemos o histórico.')
        ],
        note: 'Um teste passar não prova que o filtro é a melhor solução para quem o utilizará.'
      },
      s24: {
        lead: `Na trilha ${c.shortLabel}, continuem o mesmo exemplo: registrem a função do sistema, uma condição de qualidade e os dados necessários.`,
        note: 'Para cada requisito, escrevam o que ele exige, de onde surgiu, como testar e o que ainda precisa ser confirmado.'
      },
      s25: {
        note: 'Revisar em dupla não substitui validar com quem usará o sistema.'
      },
      s26: {
        example: c.next,
        note: 'A ficha inicial virou um catálogo rastreável. Os códigos são apenas etiquetas.'
      }
    };
    const missionsById = {
      m1: { questions: [
        question('m1', 1, `Na documentação, a ficha se chama ${c.source} (evidência número 1). ${c.sourceDescription} Qual papel ela desempenha?`, categories('b'), 'b', 'A ficha/tabela identificada é a evidência do exercício. Ela permite conferir a coleção fictícia, mas não retrata uma comunidade ou turma real.', 'Distinguir evidência de interpretação.', c.source, 'Identifica o registro consultável e seu limite.'),
        question('m1', 2, `Depois de ler a ficha do exercício, a equipe conclui: “${c.finding}” Como classificar essa conclusão?`, categories('a'), 'a', 'O achado resulta da leitura da evidência. A conclusão limita-se ao conjunto examinado.', 'Reconhecer um achado sustentado.', c.source, 'Relaciona a conclusão ao registro que a sustenta.'),
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
        question('m4', 1, 'A equipe escreveu “o filtro deve ser rápido”. Qual proposta permite testar esse requisito de desempenho?', [
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
        question('m5', 1, `Qual critério permite testar o requisito funcional de filtrar ${c.noun}?`, [
          option('a', c.accept, 'O estado inicial, a ação e o resultado esperado estão definidos.'),
          option('b', 'Dado que a tela abriu, quando a pessoa usar, então tudo deve funcionar bem.', 'Falta definir a ação e o resultado observável; “bem” é ambíguo.'),
          option('c', 'Dado que o sistema é bonito, quando terminar, então o usuário ficará feliz.', 'A frase não testa o filtro e usa julgamentos sem procedimento de avaliação.')
        ], 'a', 'Dado/Quando/Então organiza um exemplo verificável. A quantidade esperada vem da base de teste identificada.', 'Selecionar um critério Dado/Quando/Então.', `${c.source} → CA-${id}01`, 'Inclui dados conhecidos, ação e resultado exato.'),
        question('m5', 2, `A equipe quer ampliar o requisito funcional do filtro (código RF-${id}01) e escreve “listar registros recentes e gerar relatórios úteis”. Como revisar essa proposta?`, [
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
          option('a', `Requisito funcional (RF-${id}01) → opinião sem fonte → nota oficial.`, 'A cadeia perde a origem e mistura treinamento com avaliação oficial.'),
          option('b', `Evidência (${c.source}) → achado (ACH-${id}01) → necessidade (NEC-${id}01) → requisito (RF-${id}01) → teste (CA-${id}01).`, 'Os IDs ligam registro, interpretação, objetivo, comportamento e teste.'),
          option('c', 'Uma sugestão da IA → “fonte confirmada” → publicação automática.', 'A IA não confirma uma fonte nem autoriza publicar dados.')
        ], 'b', 'O rastro deve permitir seguir do teste ao requisito e voltar à fonte, inclusive quando algum elo é uma hipótese pendente.', 'Montar cadeia de rastreabilidade.', c.source, 'Relaciona os cinco elos sem inventar confirmação.'),
        question('m6', 2, 'Na revisão de pares, qual decisão preserva a coerência entre evidência e requisito?', [
          option('a', `Usar a ficha de exemplo (${c.source}) para prever ${c.count} ao escolher ${c.filter}; manter a utilidade como hipótese a confirmar.`, 'O teste usa a coleção conhecida e não transforma a hipótese sobre utilidade em fato.'),
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
        s26: { example: c.next },
        ...narrativeOverrides
      },
      missions: missionsById,
      dossierStages,
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
    slides, missions, glossary,
    sources: [
      { title: 'Modelagem de Sistemas — Da coleta à análise (slides 1–19)', url: 'https://docs.google.com/presentation/d/1D30gYjMJhvq15oYnEsUCer0AIcPMvzTg/edit', note: 'Referência didática consultada como PPTX pelo Drive; conceitos adaptados. Regras e dados sensíveis não foram copiados.' },
      { title: 'Dicionário de Dados e Casos de Uso Textuais (slides 4–9 e 14–18)', url: 'https://docs.google.com/presentation/d/15qqM7TqYZsDeoOlVRoP-3KX4eXVKiheg/edit', note: 'Usada para significado/origem/valores de dados e cenários alternativos, sem antecipar uma aula completa de casos de uso.' },
      { title: 'SWEBOK Guide v4.0a — Software Requirements', url: 'https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics', note: 'Categorias, definição, elicitação, análise, especificação, verificação e gestão; fonte IEEE Computer Society.' },
      { title: 'Nuseibeh e Easterbrook (2000) — Requirements Engineering: A Roadmap', url: 'https://www0.cs.ucl.ac.uk/staff/A.Finkelstein/fose/fdnuseibeh.pdf', note: 'Fonte acadêmica histórica sobre elicitação, análise, comunicação, acordo e evolução dos requisitos.' },
      { title: 'ISO/IEC/IEEE 29148:2018 — Requirements engineering', url: 'https://www.iso.org/standard/72089.html', note: 'Referência conceitual para necessidades, requisitos e gestão; catálogo público consultado, sem declaração de conformidade.' },
      { title: 'ISO/IEC 25010:2023 — Product quality model', url: 'https://www.iso.org/standard/78176.html', note: 'Modelo de qualidade de produto; propriedades devem poder ser especificadas e avaliadas.' },
      { title: 'W3C — WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/', note: 'Meta AA para critérios verificáveis, sem alegação de auditoria humana completa.' }
    ]
  };
});
