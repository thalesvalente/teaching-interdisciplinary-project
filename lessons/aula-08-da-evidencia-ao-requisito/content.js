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
        "lead": "A ISO/IEC/IEEE 29148:2018 relaciona requisitos às condições e capacidades necessárias para alcançar objetivos.",
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
      source: 'EV-M01', sourceDescription: 'Tabela da tela 3: seis relatos inventados, três sobre festas, dois sobre trabalho e um sobre paisagens.', fixtureOverview: 'Seis relatos inventados: três sobre festas, dois sobre trabalho e um sobre paisagens. Não há nomes ou locais reais.',
      finding: 'Na tabela há três relatos com tema festa, dois com tema trabalho e um com tema paisagem.', hypothesis: 'Talvez filtrar por tema ajude alguém a encontrar um relato.', pending: 'Precisamos perguntar a quem usaria o acervo se o filtro por tema ajuda na tarefa.',
      need: 'A pessoa que consultaria o acervo deseja encontrar relatos de um tema sem percorrer todos os registros.', rf: 'Ao escolher um tema, o sistema deve mostrar somente os relatos daquele tema e preservar a coleção completa.',
      rnf: 'A pessoa deve conseguir selecionar o filtro só pelo teclado, com foco visível e sem bloqueio.',
      rd: 'Na tabela fictícia, o campo tema é obrigatório e aceita apenas festa, trabalho ou paisagem.',
      rule: 'Regra fictícia da atividade: somente relatos marcados como revisados poderiam ser publicados.',
      accept: 'Dada a tabela da tela 3, quando escolher o tema festa, então exibir R01, R02 e R03 e conservar os seis registros originais.',
      filter: 'festa', count: '3 relatos', total: '6 relatos', dataset: 'acervo sintético', noun: 'relatos',
      protect: 'Na publicação simulada, mostrar somente código, título e tema dos relatos com Revisado = Sim.',
      unsafe: 'Exibir coordenadas exatas e nomes reais para deixar o mapa completo.',
      sourceRd: 'Tela 3: coluna Tema; tela 12: regra didática sobre seus valores permitidos.',
      sourceRnf: 'Tela 16: condição de acessibilidade proposta para o filtro; a necessidade externa não foi validada.',
      next: 'Derivar os campos tema, título e status de revisão; depois discutir suas relações.'
    },
    permanencia: {
      label: 'Permanência / Evasão Estudantil', shortLabel: 'Permanência', description: 'Painel de contagens sintéticas agregadas, sem matrícula, nome, frequência ou nota individual.', prefix: 'P',
      source: 'EV-P01', sourceDescription: 'Tabela da tela 3: seis linhas fictícias, três do período 1, duas do período 2 e uma do período 3.', fixtureOverview: 'Seis linhas de exemplo: três do período 1 (P1), duas do período 2 (P2), uma do período 3 (P3). Cada linha resume um grupo, não uma pessoa.',
      finding: 'Na tabela há três linhas do período 1, duas do período 2 e uma do período 3.', hypothesis: 'Talvez consultar por período ajude a comparar categorias de apoio.', pending: 'Precisamos perguntar à equipe autorizada se consultar por período ajudaria sua tarefa.',
      need: 'A equipe que usaria o painel deseja localizar linhas agregadas de um período, sem identificar estudantes.', rf: 'Ao escolher um período, o sistema deve mostrar somente as linhas daquele período e preservar a tabela completa.',
      rnf: 'A pessoa deve conseguir selecionar o filtro só pelo teclado, com foco visível e sem bloqueio.',
      rd: 'Na tabela fictícia, o campo período é obrigatório e aceita P1 (1), P2 (2) ou P3 (3).',
      rule: 'Regra fictícia da atividade: somente linhas agregadas revisadas poderiam ser publicadas.',
      accept: 'Dada a tabela da tela 3, quando escolher P1 (período 1), então exibir L01, L02 e L03 e conservar as seis linhas originais.',
      filter: 'P1', count: '3 linhas', total: '6 linhas', dataset: 'tabela sintética', noun: 'linhas agregadas',
      protect: 'Na publicação simulada, mostrar somente período, categoria e quantidade das linhas com Revisado = Sim.',
      unsafe: 'Exibir matrículas e notas individuais para descobrir quem vai abandonar o curso.',
      sourceRd: 'Tela 3: coluna Período; tela 12: regra didática sobre P1, P2 e P3.',
      sourceRnf: 'Tela 16: condição de acessibilidade proposta para o filtro; a necessidade externa não foi validada.',
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
    { code: 'D0 a D11', term: 'Fases do exemplo', meaning: 'Identificadores internos da evolução nesta mesma página; o aluno acompanha as etapas pelos títulos por extenso.' },
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
  function buildCaseTable(c,id){
  if(id==="M")return{
    title:"Seis relatos inventados para o exercício",
    intro:"Nenhum relato foi coletado. Os títulos A–F e os temas são dados criados nesta aula para praticar análise e requisitos.",
    columns:[{key:"code",label:"Registro"},{key:"theme",label:"Tema"},{key:"title",label:"Título fictício"},{key:"review",label:"Revisado?"}],
    rows:[
      {code:"R01",theme:"festa",title:"Relato inventado A",review:"Sim"},
      {code:"R02",theme:"festa",title:"Relato inventado B",review:"Sim"},
      {code:"R03",theme:"festa",title:"Relato inventado C",review:"Não"},
      {code:"R04",theme:"trabalho",title:"Relato inventado D",review:"Sim"},
      {code:"R05",theme:"trabalho",title:"Relato inventado E",review:"Sim"},
      {code:"R06",theme:"paisagem",title:"Relato inventado F",review:"Não"}],
    filterLabel:"festa",expectedCodes:["R01","R02","R03"],
    summary:"Há seis relatos fictícios: três de festa, dois de trabalho e um de paisagem."
  };
  return{
    title:"Seis linhas agregadas inventadas para o exercício",
    intro:"A tabela não representa nenhuma turma. As quantidades e categorias foram inventadas; L01–L06 são códigos de linhas, não de estudantes.",
    columns:[{key:"code",label:"Linha"},{key:"period",label:"Período"},{key:"category",label:"Categoria fictícia"},{key:"count",label:"Quantidade"},{key:"review",label:"Revisado?"}],
    rows:[
      {code:"L01",period:"P1 (período 1)",category:"Transporte",count:"8",review:"Sim"},
      {code:"L02",period:"P1 (período 1)",category:"Material",count:"5",review:"Sim"},
      {code:"L03",period:"P1 (período 1)",category:"Apoio pedagógico",count:"7",review:"Não"},
      {code:"L04",period:"P2 (período 2)",category:"Transporte",count:"6",review:"Sim"},
      {code:"L05",period:"P2 (período 2)",category:"Material",count:"4",review:"Sim"},
      {code:"L06",period:"P3 (período 3)",category:"Apoio pedagógico",count:"9",review:"Não"}],
    filterLabel:"P1 (período 1)",expectedCodes:["L01","L02","L03"],
    summary:"Há seis linhas agregadas inventadas: três do período 1, duas do período 2 e uma do período 3. As quantidades não representam estudantes reais."
  };
}
  function teachingOverrides(c,id,userRequirement,caseTable) {
 const selector=id==="M"?"o tema festa":"o período 1 (P1)";
 const expected=id==="M"?"R01, R02 e R03":"L01, L02 e L03";
 return {
   s02:{cards:[
     card("Quem usaria uma consulta?",id==="M"?"Uma pessoa interessada em um acervo de relatos fictícios.":"Uma equipe pedagógica fictícia que consulta dados agregados, não individuais."),
     card("Que material teremos?",caseTable.summary),
     card("Nossa pergunta",`Como selecionar registros por ${id==="M"?"tema":"período"} sem perder os dados originais?`)
   ],note:"Esta situação e a tabela da próxima tela foram criadas para ensinar; nenhuma coleta externa ocorreu."},
   s03:{caseTable,note:"A tabela está aqui, nesta tela. Você poderá reabri-la pelo botão “Ver dados e evolução”."},
   s04:{cards:[
     card("Exemplo concreto do nosso caso",c.rf),
     card("Por que isso é requisito?",`O sistema tem uma obrigação observável: mostrar os registros de ${id==="M"?"um tema":"um período"} escolhido.`),
     card("O que ainda não basta?","“O aplicativo deve ser excelente”: a frase não indica um comportamento que possamos verificar.")
   ],note:"Pfleeger enfatiza capacidades do sistema; Nuseibeh/Easterbrook, necessidades das partes interessadas. Aqui traduzimos ambas em uma obrigação testável."},
   s05:{cards:[
     card("Evidência · o que existe no exercício",caseTable.summary),
     card("Achado · o que podemos concluir",c.finding),
     card("Hipótese · o que ainda não sabemos",c.hypothesis),
     card("Pendência · pergunta em aberto",c.pending)
   ],note:"A tabela sustenta o achado. Ela não comprova que o filtro é útil para pessoas reais."},
   s06:{cards:[
     card("Informação comprovável na tabela",c.finding),
     card("Necessidade candidata",c.need),
     card("Pergunta de validação",c.pending)
   ],note:"A utilidade do filtro é uma hipótese: só uma validação autorizada com partes interessadas poderia confirmá-la."},
   s08:{cards:[
     card("Necessidade: o objetivo",c.need),
     card("Requisito de usuário: o serviço esperado",userRequirement),
     card("Requisito de sistema: a obrigação",c.rf)
   ],note:"São três maneiras de detalhar a mesma situação, não três projetos desconectados."},
   s09:{cards:[
     card("1. Para quê?",c.need),
     card("2. Qual serviço?",userRequirement),
     card("3. O que o software fará?",c.rf)
   ],note:"Passamos de uma necessidade candidata a um comportamento que podemos testar com a tabela da tela 3."},
   s11:{cards:[
     card("O que o sistema faz · funcional",c.rf),
     card("Como ele deve funcionar · não funcional",c.rnf),
     card("Por que separar?","Podemos verificar se o filtro retorna dados corretos e, em outro teste, se funciona pelo teclado.")
   ],note:"São requisitos diferentes para a mesma função; a abreviação não é importante para compreender o conceito."},
   s12:{cards:[
     card("Dados necessários ao filtro",c.rd),
     card("Regra inventada de publicação",c.rule),
     card("Como a tabela ajuda?","Ela contém categorias e a coluna “Revisado?”. Filtrar internamente não significa autorizar divulgação pública.")
   ],note:"A política é hipotética e existe apenas nesta aula; nenhuma instituição ou comunidade a aprovou."},
   s13:{cards:[
     card("Enunciado que vamos revisar",c.rf),
     card("Resultado esperado",`Ao selecionar ${selector}, exibir apenas ${expected} e manter os seis registros originais.`),
     card("Uma questão ainda aberta",c.pending)
   ],note:"O requisito deve ter origem, redação clara e resultado que possa ser comparado com a tabela."},
   s15:{cards:[
     card("Frase vaga","“O filtro precisa ser muito rápido.”"),
     card("Como torná-la verificável","Proposta: com as seis linhas desta aula, resposta em até 1 segundo, em 10 tentativas no ambiente combinado."),
     card("Isso já foi medido?","Não. Um segundo é uma meta didática proposta; é necessário testá-la e validar sua viabilidade.")
   ],note:"O teste usa os seis registros que você pode consultar, sem inventar uma segunda base de dados."},
   s16:{cards:[
     card("Teste de acessibilidade",c.rnf),
     card("Teste de proteção",c.protect),
     card("Exemplo com a coluna Revisado?","Um registro marcado “Não” pode aparecer na consulta interna fictícia, mas não na publicação simulada.")
   ],note:"Acessibilidade e privacidade são condições distintas, cada uma com sua verificação."},
   s18:{lead:"Confira o resultado usando os códigos que aparecem na tabela da tela 3.",cards:[
     card("Dado · situação inicial","Temos seis linhas na tabela fictícia, já apresentada."),
     card("Quando · ação",`Selecionar ${selector} no filtro.`),
     card("Então · resultado",`Mostrar ${expected} e conservar os seis registros originais.`)
   ],note:"Esse é um critério de aceitação: se o resultado divergir, o requisito ainda não foi atendido."},
   s19:{cards:[
     card("Essencial agora","Filtrar, preservar a coleção, respeitar o teclado e impedir publicação indevida."),
     card("Para outra entrega","Adicionar filtros mais complexos, se a necessidade for validada."),
     card("Pode esperar","Efeitos decorativos sem benefício comprovado para a tarefa.")
   ],note:"Essas prioridades valem para o projeto inventado, não são regras de toda situação."},
   s21:{lead:"A ligação entre os documentos do exemplo responde: de onde surgiu a obrigação e como vamos conferi-la?",cards:[
     card("1. De onde veio?",`Da tabela fictícia: ${caseTable.summary}`),
     card("2. O que decidimos?",c.rf),
     card("3. Como vamos testar?",`Selecionar ${selector}; mostrar ${expected}, mantendo a tabela original.`)
   ],note:"“Ver dados e evolução” exibe a tabela e as decisões feitas nesta própria página. Não há arquivo externo."},
   s22:{cards:[
     card("Verificar: atende ao texto do requisito?",`Ao escolher ${selector}, aparecem ${expected}?`),
     card("Validar: a necessidade é real?",c.pending),
     card("Gerenciar mudança","Se a decisão mudar, revisar necessidade, requisito, dados e teste juntos.")
   ],note:"Passar no teste com dados inventados não confirma que a solução será útil na realidade."},
   s24:{lead:`Com a tabela de ${c.shortLabel} à vista, descreva uma função de consulta, uma condição de qualidade e os dados necessários.`,
     note:"Clique em “Ver dados e evolução” para conferir a tabela. O rascunho é local e sua qualidade será revisada por pessoas."},
   s25:{lead:"Compare seu catálogo com a tabela exibida nesta aula: as fontes, as funções e os testes combinam?",
     note:"Uma dupla verifica a clareza; o julgamento docente e a validação externa continuam separados."},
   s26:{example:`Próxima aula: usar os campos da tabela de ${c.shortLabel} para começar a modelar os dados.`,
     note:"O resultado é um catálogo preliminar sobre este caso inventado, não uma pesquisa concluída."}
 };
}
    function buildTrack(c) {
    const id = c.prefix;

    const userRequirement = id === 'M'
      ? 'Como visitante do acervo fictício, quero consultar relatos por tema para ler os itens pertinentes.'
      : 'Como integrante da equipe pedagógica fictícia, quero consultar linhas agregadas por período sem identificar alunos.';
    const caseTable = buildCaseTable(c,id);
    const dossierStages = [
      { id:'D0', slideId:'s03', title:'Tabela de dados mostrada na aula', artifactId:c.source, excerpt:caseTable.summary },
      { id:'D1', slideId:'s05', title:'Conclusão apoiada nos dados', artifactId:`ACH-${id}01`, excerpt:c.finding },
      { id:'D2', slideId:'s06', title:'Hipótese e pergunta aberta', artifactId:`HIP-${id}01`, excerpt:c.hypothesis+' '+c.pending },
      { id:'D3', slideId:'s08', title:'Necessidade e serviço esperado', artifactId:`RU-${id}01`, excerpt:userRequirement },
      { id:'D4', slideId:'s09', title:'Comportamento do sistema', artifactId:`RF-${id}01`, excerpt:c.rf },
      { id:'D5', slideId:'s12', title:'Definição de dados e regra fictícia', artifactId:`RD-${id}01`, excerpt:c.rd },
      { id:'D6', slideId:'s15', title:'Condição de desempenho proposta', artifactId:`RNF-${id}02`, excerpt:'Com as seis linhas exibidas, propor até 1 segundo em 10 tentativas; resultado não medido.' },
      { id:'D7', slideId:'s18', title:'Critério de aceitação com os seis registros', artifactId:`CA-${id}01`, excerpt:c.accept },
      { id:'D8', slideId:'s19', title:'Prioridades de trabalho', artifactId:`MVP-${id}01`, excerpt:'Primeiro: filtrar, preservar registros e garantir acesso e proteção.' },
      { id:'D9', slideId:'s21', title:'Ligações da fonte ao teste', artifactId:`TRACE-${id}01`, excerpt:`${c.source} → achado → necessidade → requisito → critério de aceitação.` },
      { id:'D10', slideId:'s24', title:'Catálogo que a equipe escreve', artifactId:`CAT-${id}01`, excerpt:'Um requisito funcional, um de qualidade e um de dados, com origem e teste.' },
      { id:'D11', slideId:'s25', title:'Revisão por outra equipe', artifactId:`REV-${id}01`, excerpt:'Verificar clareza e coerência entre a tabela, os requisitos e os testes.' }
    ];
    const narrativeOverrides = teachingOverrides(c,id,userRequirement,caseTable);
    const missionsById = {
      m1: { questions: [
        question('m1', 1, `Na tela 3 mostramos uma tabela criada para a aula. Chamamos seu registro de evidência (${c.source}). Que tipo de informação é essa tabela?`, categories('b'), 'b', 'A tabela que você viu na tela 3 é a evidência deste exercício. Ela permite conferir o conjunto inventado, não representa pessoas reais.', 'Distinguir evidência de interpretação.', c.source, 'Identifica o registro consultável e seu limite.'),
        question('m1', 2, `Depois de observar a tabela da tela 3, concluímos: “${c.finding}” Como chamamos uma conclusão apoiada nos dados?`, categories('a'), 'a', 'O achado resulta da leitura da evidência. A conclusão limita-se ao conjunto examinado.', 'Reconhecer um achado sustentado.', c.source, 'Relaciona a conclusão ao registro que a sustenta.'),
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
        question('m4', 1, 'Para a função de filtrar os seis registros da tela 3, qual proposta de desempenho pode ser verificada?', [
          option('a', 'O filtro deve responder imediatamente e nunca atrasar.', '“Imediatamente” e “nunca” não delimitam medida, carga ou ambiente.'),
          option('b', 'Com os seis registros da tabela desta aula, responder em até 1 segundo em cada uma de 10 tentativas no navegador de referência.', 'Operação, carga, medida, limite e ambiente estão declarados; a meta ainda precisa ser combinada.'),
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
        question('m5', 2, `A equipe escreveu “mostrar rapidamente todos os resultados bonitos e úteis” sobre o mesmo filtro. Como revisar essa frase?`, [
          option('a', 'Manter a frase: cada pessoa definirá depois o que significa bonito e útil.', 'Delegar a interpretação não elimina a ambiguidade e pode contrariar a necessidade.'),
          option('b', 'Separar o comportamento do filtro da meta de desempenho; para a função, indicar os registros esperados; para a qualidade, definir uma medida.', 'A revisão reduz a ambiguidade e deixa uma obrigação principal em cada item.'),
          option('c', 'Trocar “bonitos” por “modernos” e elevar a prioridade.', 'Apenas trocar o adjetivo não cria uma condição verificável.')
        ], 'b', 'A função do filtro é conferida pela tabela; o desempenho usa outra condição e outro teste. Separe as obrigações.', 'Detectar ambiguidade e múltiplas obrigações.', `REV-${id}01`, 'Divide obrigações e pede definições verificáveis.'),
        question('m5', 3, 'Há tempo para uma primeira entrega pequena. Qual conjunto atende melhor ao objetivo e aos limites do caso?', [
          option('a', 'Animações, ranking de pessoas e cores personalizadas.', 'O conjunto não resolve a consulta prioritária e o ranking expõe pessoas.'),
          option('b', 'Todas as funções imaginadas, mesmo sem fonte ou teste.', 'O escopo não cabe e inclui decisões sem necessidade sustentada.'),
          option('c', `Consulta por ${c.filter === 'festa' ? 'tema' : 'período'}, proteção da saída e uso por teclado; adiar animações decorativas.`, 'Preserva o objetivo, reduz riscos e mantém acesso; conveniências podem esperar.')
        ], 'c', 'Prioridade considera valor, risco, esforço e dependências. Requisitos essenciais de acesso e proteção precisam entrar no recorte.', 'Priorizar um escopo mínimo responsável.', `MVP-${id}01`, 'Preserva o propósito e as proteções no recorte.')
      ] },
      m6: { questions: [
        question('m6', 1, 'Qual sequência liga a tabela que vimos na tela 3 ao filtro e ao seu teste?', [
          option('a', `Requisito funcional (RF-${id}01) → opinião sem fonte → nota oficial.`, 'A cadeia perde a origem e mistura treinamento com avaliação oficial.'),
          option('b', `Evidência (${c.source}) → achado (ACH-${id}01) → necessidade (NEC-${id}01) → requisito (RF-${id}01) → teste (CA-${id}01).`, 'Cada etapa usa a mesma tabela, que pode ser reaberta em qualquer missão.'),
          option('c', 'Uma sugestão da IA → “fonte confirmada” → publicação automática.', 'A IA não confirma uma fonte nem autoriza publicar dados.')
        ], 'b', 'O rastro deve permitir seguir do teste ao requisito e voltar à fonte, inclusive quando algum elo é uma hipótese pendente.', 'Montar cadeia de rastreabilidade.', c.source, 'Relaciona os cinco elos sem inventar confirmação.'),
        question('m6', 2, 'Na revisão de pares, qual decisão preserva a coerência entre evidência e requisito?', [
          option('a', `Usar a tabela mostrada na tela 3 (${c.source}) para prever ${c.count} ao selecionar ${c.filter}; manter a utilidade como hipótese a confirmar.`, 'O teste usa a coleção conhecida e não transforma a hipótese sobre utilidade em fato.'),
          option('b', 'Usar o número de linhas como prova de que o sistema resolve todos os problemas do público.', 'A quantidade de registros não prova utilidade geral, causas ou impacto.'),
          option('c', 'Apagar a fonte e escolher um critério que sempre devolve “aprovado”.', 'Sem origem e resultado observável, o critério não verifica o requisito.')
        ], 'a', 'Um dado pode sustentar o resultado esperado de um teste sem validar a necessidade em todos os contextos. A revisão humana identifica esse limite.', 'Revisar fonte, requisito e critério em conjunto.', `${c.source} / HIP-${id}01`, 'Preserva resultado verificável e incerteza contextual.')
      ] }
    };
    return {
      label: c.label, shortLabel: c.shortLabel, description: c.description,
      slides: narrativeOverrides,
      missions: missionsById,
      dossierStages,
      caseTable,
      catalogExamples: {
        RF: { text: c.rf, source: c.source + ': ' + c.sourceDescription, sourceStatus: 'evidence', criterion: c.accept },
        RNF: { text: c.rnf, source: c.sourceRnf, sourceStatus: 'pending_hypothesis', criterion: 'Dado o filtro carregado e o ponteiro sem uso, quando navegar com Tab e selecionar a opção pelo teclado, então concluir a filtragem com foco visível e sem bloqueio de navegação.' },
        RD: { text: c.rd, source: c.sourceRd, sourceStatus: 'pending_hypothesis', criterion: `Dado um registro da tabela da tela 3, quando validar o campo ${c.filter === 'festa' ? 'tema' : 'período'}, então aceitar apenas os três valores apresentados e rejeitar outros valores ou campo vazio.` }
      },
      syntheticRecords: [
        { id: c.source, kind: 'evidence', description: c.sourceDescription },
        { id: `HIP-${id}01`, kind: 'hypothesis_pending', description: c.hypothesis },
        { id: `RN-${id}01`, kind: 'fictional_policy', description: c.rule }
      ]
    };
  }
  return {
    version: '1.0.0', contentRevision: '2026-11-11-pedagogia-3', criteriaVersion: '1.0.0', answerKeyVersion: '1.0.0', lessonId: 'ppi-aula08',
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
