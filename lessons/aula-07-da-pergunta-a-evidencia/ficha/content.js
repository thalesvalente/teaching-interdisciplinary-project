(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PPIContent=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const VERSION='1.0.0';
const NOTICE='Pontuação automática de completude e processo. A qualidade técnica e ética permanece sujeita à revisão docente.';
const DECLARATION='Os campos do projeto não contêm dados pessoais reais de entrevistados, estudantes ou membros da comunidade; usamos apenas identificação acadêmica mínima da equipe e situações sintéticas ou autorizadas.';
const CLOSING='Há algo importante que não perguntamos?';
const TITLES=['Preparar a equipe','Definir a descoberta','Escolher as técnicas','Construir o protocolo','Passar pelo gate ético','Testar o roteiro','Montar o quadro de evidências','Registrar autoria individual','Revisar e guardar'];
const TRACKS={memorias:{title:'Mapa de Memórias Quilombolas',tag:'Memória, autoria e decisão coletiva',intro:'Planejem como preservar memórias com autoria, validação comunitária e diferentes níveis de visibilidade. Nenhum relato aqui representa uma pessoa ou comunidade real.',scenario:'Cartão sintético M: em uma comunidade inteiramente fictícia, um relato de teste situa um encontro antes de outro, mas um registro inventado apresenta a ordem inversa. Um local é considerado sensível no cenário. A equipe deve registrar a divergência, limitar a visibilidade e pedir validação coletiva antes de propor publicação.',tips:['Perguntem quem pode validar uma interpretação e decidir coletivamente sobre publicação.','Imagem, voz e locais sensíveis exigem decisões específicas; não presumam autorização.','Fontes históricas e comunitárias podem apresentar versões diferentes de um relato.'],questions:['Como as memórias são preservadas neste cenário?','Quais papéis participam da decisão sobre um registro?','Como um relato passa da coleta à validação coletiva?','Que dificuldades aparecem ao registrar versões diferentes?','Que resultado indicaria uma preservação respeitosa da autoria?','Como podemos confirmar se entendemos o relato e os limites de uso?'],need:'Exemplo de necessidade candidata: representar níveis de visibilidade definidos coletivamente, ainda pendente de validação.'},permanencia:{title:'EDA/Permanência Estudantil',tag:'Dados agregados, contexto e decisão humana',intro:'Investiguem uma decisão pedagógica com indicadores sintéticos ou agregados. Definam localmente permanência, retenção e evasão antes de interpretar os dados.',scenario:'Cartão sintético P: uma tabela inventada informa totais agregados de acompanhamento por período. Há campos ausentes e uma definição ambígua de permanência. Um resumo fictício usa periodicidade diferente. A equipe deve registrar a limitação, identificar o responsável pelo dado e validar a interpretação antes de qualquer decisão pedagógica.',tips:['Verifiquem origem, responsável, significado dos campos e periodicidade dos dados.','Associação entre indicadores não demonstra causalidade. Não criem ranking individual punitivo.','Acesso restrito, anonimização e validação humana continuam necessários. Não usem nomes, matrículas, notas ou frequências reais.'],questions:['Que decisão pedagógica este indicador deve apoiar?','Quais papéis produzem e validam os indicadores agregados?','Como os totais são atualizados e com que periodicidade?','Que campos ausentes ou inconsistentes dificultam a interpretação?','Que resultado ajudaria a acompanhar a permanência sem punir indivíduos?','Como podemos confirmar o significado local de permanência, retenção e evasão?'],need:'Exemplo de necessidade candidata: esclarecer o significado e a periodicidade de um indicador agregado, ainda pendente de validação.'}};
const FIELDS={
m1:[['objective','O que a equipe precisa descobrir?'],['need','Por que essa informação é necessária?'],['decision','Que decisão do projeto depende dela?'],['source','Quem ou qual fonte pode responder?'],['assumption','O que ainda é somente suposição?']],
technique:[['source','Fonte'],['purpose','Finalidade'],['evidence','Evidência esperada'],['limitation','Limitação'],['justification','Justificativa da escolha']],
observation:[['activity','Atividade a observar'],['boundaries','Início e fim do processo'],['people','Pessoas ou papéis envolvidos'],['tools','Ferramentas utilizadas'],['transfers','Transferências de informação'],['delays','Esperas, atrasos, retrabalho ou improvisos'],['practice','Diferença entre procedimento formal e prática'],['record','Como registrar fatos sem julgamento']],
document:[['name','Nome da fonte'],['author','Autor ou responsável'],['version','Data e versão'],['purpose','Finalidade original'],['terms','Termos e campos importantes'],['rules','Regras encontradas'],['gaps','Lacunas e ambiguidades'],['restrictions','Restrições de acesso, reutilização ou publicação'],['unanswered','Perguntas que a fonte não responde']],
ai:[['tool','Ferramenta'],['purpose','Finalidade do uso'],['prompt','Prompt sanitizado'],['summary','Resumo da resposta'],['decision','O que foi aceito, rejeitado ou corrigido']],
ethicsChoice:[['authorization','Há autorização para a atividade?'],['explained','O objetivo foi explicado?'],['refusal','A pessoa pode recusar?'],['recording','Gravação é realmente necessária?'],['personal','Há nomes, imagens, voz, localização ou registros pessoais?'],['substitution','O dado pode ser substituído por exemplo sintético, agregado ou anonimizado?'],['ai','O conteúdo pode ser colocado em uma ferramenta de IA?']],
ethicsText:[['access','Quem pode acessar o registro?'],['validator','Quem valida a interpretação?'],['citation','Como a fonte será citada?'],['publication','O que não pode ser publicado?'],['risks','Quais riscos foram identificados?'],['mitigation','Qual mitigação será aplicada aos riscos?']],
m5:[['scenario','Cenário utilizado'],['roles','Papéis dos integrantes durante o teste'],['worked','Quais perguntas funcionaram?'],['confusing','Quais perguntas confundiram?'],['leading','Qual pergunta induziu resposta?'],['sensitive','Qual informação sensível foi percebida?'],['contradiction','Qual contradição foi encontrada?'],['difficulty','Dificuldade de tempo ou compreensão'],['change','Alteração realizada no roteiro após o teste'],['reason','Justificativa da alteração'],['before','Versão antes (ou trecho)'],['after','Versão depois (ou trecho)'],['summary','Síntese explícita da mudança (alternativa ao antes/depois)']],
evidence:[['raw','Registro bruto'],['source','Fonte'],['justification','Justificativa da confiança'],['validator','Quem precisa validar'],['relation','Relação com a dúvida central'],['restriction','Restrição de uso/publicação']],
author:[['contribution','Contribuição realizada'],['improvement','Pergunta ou decisão que ajudou a melhorar'],['risk','Risco ético ou técnico identificado'],['learning','Algo que ainda precisa aprender']]
};
const CATEGORIES=[['contexto','Contexto'],['pessoas','Pessoas / participantes'],['processo','Processo'],['problema','Problema'],['resultado','Resultado'],['validacao','Validação'],['fechamento','Fechamento aberto']];
const TECHNIQUES=[['entrevista','Entrevista'],['observacao','Observação'],['documental','Análise documental'],['questionario','Questionário (complementar)']];

/* Ajuda ao estudante: os IDs de campos e a rubrica permanecem iguais. */
const LABELS={
 m1:{objective:'Qual pergunta nosso projeto precisa responder?',need:'Por que vale a pena descobrir isso?',decision:'O que faremos com essa resposta?',source:'Quem ou o que poderia nos ajudar?',assumption:'O que estamos imaginando, mas ainda não sabemos?'},
 technique:{source:'Quem ou o que vamos consultar?',purpose:'O que queremos descobrir com esta técnica?',evidence:'O que esperamos anotar ou encontrar?',limitation:'O que esta técnica pode deixar de mostrar?',justification:'Por que escolhemos esta técnica?'},
 observation:{activity:'Qual atividade queremos observar?',boundaries:'Onde a atividade começa e termina?',people:'Quais funções ou papéis participam?',tools:'Quais materiais ou ferramentas são usados?',transfers:'Como a informação passa de uma etapa para outra?',delays:'Onde podem surgir esperas, erros ou retrabalho?',practice:'O que está previsto e o que acontece na prática?',record:'Como anotar os fatos sem dar opiniões?'},
 document:{name:'Qual documento vamos consultar?',author:'Quem produziu ou cuida do documento?',version:'Qual é a data ou versão do documento?',purpose:'Para que esse documento foi criado?',terms:'Quais palavras ou campos precisam de explicação?',rules:'Que regras ou orientações encontramos?',gaps:'O que está incompleto ou confuso?',restrictions:'Quem pode acessar ou compartilhar esse documento?',unanswered:'Que dúvida o documento não resolve?'},
 ai:{tool:'Qual ferramenta de IA foi usada?',purpose:'Para que usamos a IA?',prompt:'O que perguntamos à IA? (sem dados pessoais)',summary:'O que a IA respondeu, em resumo?',decision:'O que aproveitamos, corrigimos ou descartamos?'},
 ethicsChoice:{authorization:'Temos autorização para realizar essa atividade?',explained:'O objetivo foi explicado a quem participaria?',refusal:'A pessoa pode recusar sem ser prejudicada?',recording:'Precisamos mesmo gravar áudio ou vídeo?',personal:'O material pode conter dados pessoais?',substitution:'Podemos usar exemplos inventados ou dados sem identificação?',ai:'Podemos compartilhar esse conteúdo com uma IA?'},
 ethicsText:{access:'Quem poderá consultar os registros?',validator:'Quem deve conferir nossa interpretação?',citation:'Como vamos indicar de onde veio a informação?',publication:'Que informações não podem ser divulgadas?',risks:'O que poderia dar errado ou prejudicar alguém?',mitigation:'O que faremos para evitar esses problemas?'},
 m5:{scenario:'Qual situação inventada usamos no teste?',roles:'Quem fez cada papel na simulação?',worked:'Que pergunta ajudou a entender o cenário?',confusing:'Que pergunta ficou difícil de entender?',leading:'Alguma pergunta sugeriu a resposta?',sensitive:'Apareceu alguma informação que exigiria cuidado?',contradiction:'Encontramos informações que não combinavam?',difficulty:'O que foi difícil durante a simulação?',change:'O que mudamos no roteiro depois do teste?',reason:'Por que fizemos essa mudança?',before:'Como era a pergunta antes?',after:'Como ficou a pergunta depois?',summary:'Resuma a mudança, se não usou antes/depois'},
 evidence:{raw:'O que encontramos ou anotamos?',source:'De onde veio essa informação?',justification:'Por que damos esse nível de confiança?',validator:'Quem precisaria conferir?',relation:'Como isso ajuda a responder nossa pergunta?',restriction:'O que não podemos divulgar ou usar?'},
 author:{contribution:'O que você fez na atividade?',improvement:'Que pergunta ou decisão você ajudou a melhorar?',risk:'Que cuidado ou possível problema você percebeu?',learning:'O que você ainda precisa aprender?'}
};
for(const [group,translations] of Object.entries(LABELS)){
 const defs=FIELDS[group];
 for(const entry of defs){if(translations[entry[0]])entry[1]=translations[entry[0]];}
}
const GUIDANCE={
 'm1.objective':'Escrevam uma dúvida concreta, começando com “Como...?”, “Quem...?” ou “Quais...?”. Evitem escrever somente o nome do projeto.',
 'm1.need':'Digam qual problema pode ser entendido melhor quando responderem à pergunta.',
 'm1.decision':'Expliquem uma escolha que a equipe poderá fazer depois da investigação. Ainda não tomem a decisão como se estivesse confirmada.',
 'm1.source':'Indiquem um papel ou material fictício/autorizado, nunca nomes de pessoas entrevistadas sem autorização.',
 'm1.assumption':'Registrem algo que a equipe acha que acontece, mas precisa confirmar. Não apresentem palpite como fato.',
 'technique.source':'É a origem da informação: um papel (ex.: responsável pelo acervo), uma atividade ou um documento fictício/autorizado.',
 'technique.purpose':'Digam qual dúvida esta técnica ajudará a responder, não apenas “coletar dados”.',
 'technique.evidence':'Imaginem o resultado concreto: respostas anotadas, etapas observadas ou regras encontradas em um documento.',
 'technique.limitation':'Pensem no que pode faltar: uma entrevista depende da lembrança; observar uma tarefa não mostra todas as regras.',
 'technique.justification':'Comparem com outra opção. Ex.: “Entrevista ajuda a entender motivos; o documento ajuda a conferir regras”.',
 'observation.activity':'Escolham uma tarefa específica do cenário fictício, por exemplo guardar um registro ou atualizar uma tabela.',
 'observation.boundaries':'Indiquem o primeiro e o último passo. Ex.: “Começa quando o pedido chega; termina quando é arquivado”.',
 'observation.people':'Escrevam funções, não nomes. Ex.: pessoa que recebe o pedido e pessoa que confere.',
 'observation.tools':'Listem objetos, formulários ou programas usados na tarefa simulada.',
 'observation.transfers':'Descrevam como um papel, mensagem ou dado passa de uma pessoa ou etapa para outra.',
 'observation.delays':'Onde alguém teria de esperar, refazer algo ou improvisar? Se não houver no cartão, expliquem que não apareceu.',
 'observation.practice':'Comparem uma regra escrita com a sequência de passos no exemplo. Se não houver comparação possível, expliquem o motivo.',
 'observation.record':'Anotem ações que poderiam ser verificadas. Melhor “o formulário foi corrigido duas vezes” do que “a pessoa foi desatenta”.',
 'document.name':'Inventem um título para o documento de treino ou indiquem um material de acesso autorizado.',
 'document.author':'Informem a função responsável pelo material, sem expor dados pessoais.',
 'document.version':'Ex.: “Versão fictícia 1, sem data indicada”. Não inventem uma data como se fosse real.',
 'document.purpose':'Para que serviria esse registro? Ex.: organizar solicitações ou orientar o arquivamento.',
 'document.terms':'Citem uma palavra, campo ou sigla que precise ser definida. Ex.: “atendimento” e “estudante atendido”.',
 'document.rules':'Escrevam o que o documento diz, distinguindo isso do que vocês acham que deveria dizer.',
 'document.gaps':'Identifiquem uma informação que faltou, uma palavra ambígua ou duas instruções que não combinam.',
 'document.restrictions':'Digam se a consulta seria pública, restrita ou dependente de autorização. Não presumam permissão.',
 'document.unanswered':'Criem uma pergunta que o documento não responde e que precisará de outra fonte.',
 'ai.tool':'Se escolheram “Não utilizamos IA”, deixem estes campos opcionais vazios.',
 'ai.purpose':'Ex.: revisar a clareza de uma pergunta inventada, sem enviar informações pessoais.',
 'ai.prompt':'Se utilizaram, registrem apenas um pedido sem nomes, matrículas ou relatos privados.',
 'ai.summary':'Anotem uma sugestão da ferramenta; não a tratem como fato confirmado.',
 'ai.decision':'Digam quem conferiu a sugestão e o que a equipe mudou ou rejeitou.',
 'question.category':'Escolham o assunto da pergunta. No conjunto, contemplem contexto, pessoas, processo, problema, resultado e validação.',
 'question.text':'Uma boa pergunta é clara e não sugere a resposta. Ex.: “Como esse material é organizado?”',
 'question.purpose':'Expliquem em uma frase o que a resposta ajudará a descobrir.',
 'm4.decision':'Expliquem o motivo da opção. Se não há autorização, digam que a atividade real ficará suspensa e usem apenas simulação.',
 'm4.access':'Ex.: “Somente a equipe autorizada e o professor”, conforme a situação simulada; não criem permissões reais.',
 'm4.validator':'Indiquem um papel autorizado que precisaria conferir o significado dos registros.',
 'm4.citation':'Indiquem título, responsável e versão, quando existirem. Nunca inventem uma fonte real.',
 'm4.publication':'Ex.: nomes, imagens, vozes ou locais reservados não seriam divulgados sem autorização específica.',
 'm4.risks':'Pensem em exposição de dados, interpretação errada ou divulgação sem permissão.',
 'm4.mitigation':'Digam qual ação concreta reduz cada risco: usar exemplo fictício, retirar identificadores, restringir acesso ou pedir autorização.',
 'm5.scenario':'Descrevam em duas frases o cartão inventado que usaram. Não simulem entrevistas com dados de pessoas reais.',
 'm5.roles':'Ex.: uma pessoa lê o cartão, outra faz as perguntas e outra anota o que precisa melhorar.',
 'm5.worked':'Copiem uma pergunta do roteiro e expliquem por que ela ajudou.',
 'm5.confusing':'Se nenhuma confundiu, expliquem como verificaram isso na simulação.',
 'm5.leading':'Ex.: “Você concorda que o processo é ruim?” sugere uma resposta. Se não houve, expliquem.',
 'm5.sensitive':'Anotem o tipo de informação que exigiria proteção, nunca o dado sensível em si.',
 'm5.contradiction':'Ex.: dois registros fictícios apresentam valores ou ordens diferentes.',
 'm5.difficulty':'Ex.: faltou tempo para aprofundar uma resposta; se não houve dificuldade, expliquem como avaliaram.',
 'm5.change':'Descrevam uma mudança real no texto do roteiro após testar. Ela é necessária para completar esta missão.',
 'm5.reason':'Digam que problema do teste a mudança resolveu.',
 'm5.before':'Copiem a versão antiga de uma pergunta (sem dados reais).',
 'm5.after':'Copiem a versão melhorada, mais clara e neutra.',
 'm5.summary':'Alternativa ao antes/depois: descrevam claramente qual pergunta mudou e como ficou.',
 'evidence.raw':'Anotem uma frase ou fato do cartão fictício. Não misturem essa anotação com opinião.',
 'evidence.source':'Identifiquem qual cartão, fala simulada ou documento fictício trouxe a informação.',
 'evidence.justification':'Alta, média ou baixa? Expliquem se outra fonte confirma o registro ou se há contradição.',
 'evidence.validator':'Digam quem precisaria conferir o registro numa etapa autorizada.',
 'evidence.relation':'Expliquem em uma frase como o registro ajuda a dúvida da Missão 1.',
 'evidence.restriction':'Se poderia revelar identidade, voz ou local sensível, anotem a restrição sem copiar o conteúdo.',
 'author.contribution':'Use a primeira pessoa. Ex.: “Eu escrevi duas perguntas para o teste”.',
 'author.improvement':'Conte uma mudança específica na qual você participou.',
 'author.risk':'Ex.: “Percebi que a pergunta pedia uma informação pessoal”.',
 'author.learning':'Ex.: “Preciso aprender a formular perguntas sem sugerir respostas”.',
 'm6.limitation':'Expliquem uma dúvida ou contradição do cartão. Se não houver, digam por que não conseguiram identificá-la.',
 'm6.needs':'Escrevam algo que o futuro projeto talvez precise oferecer. Ainda não é um requisito aprovado; isso será trabalhado na Aula 08.'
};
function hintFor(path){
 const key=path.replace(/^m2\.techniques\.\d+\./,'technique.')
  .replace(/^m3\.questions\.\d+\./,'question.')
  .replace(/^m3\.observation\./,'observation.')
  .replace(/^m3\.document\./,'document.')
  .replace(/^m3\.ai\./,'ai.')
  .replace(/^m6\.records\.\d+\./,'evidence.')
  .replace(/^members\.\d+\./,'author.')
  .replace(/^m4\.(?:authorization|explained|refusal|recording|personal|substitution|ai)\.decision$/,'m4.decision');
 return GUIDANCE[key]||'';
}
const METHOD_HELP={
 entrevista:'Entrevista: fazer perguntas abertas para entender como alguém explicaria a atividade. Por enquanto, usem somente papéis fictícios.',
 observacao:'Observação: acompanhar os passos de uma tarefa simulada e anotar o que acontece, sem julgar.',
 documental:'Análise documental: ler uma fonte de treino ou autorizada e procurar regras, dúvidas e informações ausentes.',
 questionario:'Questionário: conjunto de perguntas por escrito; serve apenas como técnica complementar nesta atividade.'
};
const EXAMPLES={
 memorias:{
 1:[['Pergunta','Como decidir se um registro de memória fictício pode ser mostrado ao público?'],['Dúvida a confirmar','Ainda não sabemos quem deveria conferir o registro e decidir sua visibilidade.']],
 2:[['Principal: entrevista simulada','Conversar com o papel fictício de responsável pelo acervo para entender as decisões sobre acesso.'],['Complementar: documento','Ler uma regra fictícia de arquivamento para comparar o que foi dito com o que está escrito.']],
 3:[['Pergunta aberta','Como vocês decidem o que pode ser divulgado?'],['Observação sem julgamento','“A ficha foi conferida antes do arquivamento” é um fato possível; “a equipe foi descuidada” é opinião.'],['Documento','Uma instrução fictícia não explica quem valida a publicação: isso vira uma pergunta a esclarecer.']],
 4:[['Decisão segura','“Não há autorização para coletar relatos reais; faremos apenas simulação com materiais inventados.”'],['Cuidados','Não usar vozes, imagens, nomes ou locais reservados sem permissão específica.']],
 5:[['Pergunta inicial','“Você sempre guarda os relatos corretamente?”'],['Pergunta revisada','“Como os relatos são guardados e conferidos?”'],['Por quê?','A segunda não pressupõe que exista uma maneira “correta” conhecida.']],
 6:[['Achado','Dois registros fictícios apresentam datas diferentes para o mesmo acontecimento.'],['Hipótese','Talvez tenham usado critérios distintos; não sabemos.'],['Pendência','Descobrir, numa etapa autorizada, quem poderia conferir a divergência.']],
 7:[['Contribuição individual','“Eu organizei as perguntas e percebi que uma delas sugeria a resposta.”'],['Aprendizagem','“Ainda preciso aprender a diferenciar um relato de uma informação comprovada.”']]
 },
 permanencia:{
 1:[['Pergunta','Como descobrir se duas tabelas fictícias medem a mesma coisa?'],['Dúvida a confirmar','Uma tabela pode contar estudantes e outra, atendimentos. Não sabemos se os números podem ser comparados.']],
 2:[['Principal: análise documental','Ler duas tabelas inventadas e conferir nomes de campos, datas e definições.'],['Complementar: entrevista simulada','Perguntar ao papel fictício de responsável pelos dados como cada indicador foi calculado.']],
 3:[['Pergunta aberta','O que significa “estudante atendido” nesta tabela?'],['Observação sem julgamento','“O total foi copiado para outra planilha” descreve uma ação; “a equipe errou” é opinião.'],['Documento','Uma tabela fictícia não informa o período dos dados: anotem essa dúvida.']],
 4:[['Decisão segura','“Não temos autorização nem necessidade de acessar registros individuais; usaremos apenas números inventados.”'],['Cuidados','Não inserir nomes, matrículas, notas ou frequências reais na ficha nem em IA.']],
 5:[['Pergunta inicial','“A tabela está errada, não está?”'],['Pergunta revisada','“Como cada tabela calcula o total apresentado?”'],['Por quê?','A segunda pede uma explicação e não acusa ninguém.']],
 6:[['Achado','Uma tabela fictícia usa total mensal; outra usa total por período diferente.'],['Hipótese','Talvez a diferença se deva ao período, mas isso ainda não foi confirmado.'],['Pendência','Definir, com a fonte autorizada, o significado de cada indicador.']],
 7:[['Contribuição individual','“Eu comparei os campos das tabelas e identifiquei uma definição ausente.”'],['Aprendizagem','“Quero aprender a distinguir números de estudantes de números de atendimentos.”']]
 }
};
TRACKS.memorias.intro='Investiguem, por meio de situações inventadas, como guardar memórias com respeito a quem as conta e a quem decide sobre a divulgação.';
TRACKS.permanencia.intro='Investiguem tabelas inventadas sobre permanência estudantil. Antes de comparar números, descubram o significado de cada informação.';
TRACKS.memorias.scenario='Cartão de treino inventado: dois registros apresentam datas diferentes para o mesmo acontecimento. Um lugar citado deve ficar reservado. A equipe vai anotar a diferença, evitar divulgar o local e indicar quem precisaria conferir o registro em uma atividade autorizada.';
TRACKS.permanencia.scenario='Cartão de treino inventado: uma tabela conta estudantes, outra conta atendimentos, e os períodos são diferentes. Há campos sem explicação. A equipe vai anotar o que não pode ser comparado e dizer quem precisaria esclarecer os números. Não usem dados reais de estudantes.';
return {VERSION,NOTICE,DECLARATION,CLOSING,TITLES,TRACKS,FIELDS,CATEGORIES,TECHNIQUES,LABELS,hintFor,METHOD_HELP,EXAMPLES};
});
