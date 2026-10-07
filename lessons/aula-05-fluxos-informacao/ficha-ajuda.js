/* Ajuda de leitura da ficha PPI 2.3.0.
   As orientações apontam para os registros existentes; não acrescentam fatos aos casos.
   Sem preenchimento automático, rede, avaliação de conteúdo ou persistência. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const val = id => $(id)?.value.trim() || '';
  const node = (tag, text, cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  // [Dica visível, índices dos registros de apoio, início de frase para completar]
  const GUIDES = {
    memorias: {
      steps: [
        '1ª troca · A cópia entregue para consulta',
        '2ª troca · O que acontece depois da entrega?'
      ],
      intro: [
        'Compare a ficha original com a cópia da oficina. Quais informações aparecem na cópia? O texto não identifica quem a preparou ou entregou: registre essa falta, sem inventar uma pessoa.',
        'Agora procure o que aconteceu depois que a cópia foi entregue. O caso não diz quem leu nem se houve publicação externa. É válido escrever o que não sabemos; não é preciso inventar uma segunda entrega.'
      ],
      hints: {
        recorte:['Retome o problema escolhido na Aula 3 dentro de Memórias Quilombolas. Explique a dificuldade que a equipe quer entender. A falta da orientação de uso na cópia é um ponto para observar nesta atividade, não uma obrigação de trocar o problema da equipe.',[0,1,2],'Nossa equipe quer entender como ...'],
        origem1:['Leia “Cópia para a oficina”. O texto informa quem preparou ou entregou a cópia? Escreva o papel apenas se ele aparecer no material. “Emissor” sozinho não identifica ninguém.',[2],'O material não informa quem ...'],
        destino1:['A cópia foi entregue para consulta na oficina. O texto identifica quem a recebeu ou leu? Separe o público a que o material se destina das pessoas que realmente o consultaram.',[2],'A cópia se destina à consulta ...; não sabemos quem ...'],
        info1:['Compare “Ficha original” e “Cópia para a oficina”. Escreva quais dados aparecem na cópia e qual orientação ficou de fora. “Mensagem” não explica o conteúdo.',[1,2],'Na cópia aparecem ...; nela não aparece ...'],
        canal1:['Que documento leva essas informações à oficina? Nomeie esse material. O caso não diz se a entrega foi por papel, e-mail ou aplicativo; não escolha um desses meios por conta própria.',[2],'As informações aparecem na ...; a forma de entrega não foi ...'],
        uso1:['Volte à orientação da ficha original. Em que situação ela permite usar a memória? Indique o uso permitido, sem confundir consulta na oficina com autorização para publicar fora dela.',[1,2],'Segundo a ficha original, a memória pode ser usada para ...'],
        origem2:['Depois da entrega da cópia, alguém leu ou passou as informações adiante? O caso não identifica essa pessoa nem confirma o repasse. Explique isso em vez de criar um novo emissor.',[2],'Não sabemos se alguém ...'],
        destino2:['O material confirma que outra pessoa recebeu a memória depois da consulta? Não invente um leitor ou um público de uma publicação que o caso não registra.',[2],'Não sabemos quem ...; o material só informa ...'],
        info2:['O caso não confirma um repasse posterior. Diga qual parte do caminho ainda precisa ser verificada, sem afirmar que o título, a categoria ou a orientação foram publicados.',[1,2],'Não sabemos se as informações ... foram repassadas.'],
        canal2:['Há no caso algum meio usado depois da entrega da cópia? Rede social, grupo de mensagens e conversa só podem ser citados como fatos se estiverem no material.',[2],'O caso não informa por qual meio ...'],
        uso2:['Sabemos o uso permitido na ficha original, mas não a intenção de um possível repasse. Separe a regra de uso do que alguém realmente fez depois.',[1,2],'O uso permitido é ...; sobre um uso posterior, não sabemos ...'],
        fonte:['Escreva os nomes dos materiais que vocês compararam. Para a orientação de uso, procure a ficha original; para o que chegou à oficina, procure a cópia.',[1,2],'Conferimos em ... e ...'],
        evidencia:['Mostre a diferença que dá apoio à resposta: o que a ficha original diz sobre uso e o que a cópia não traz. Não acrescente uma consequência, como publicação indevida, que não foi registrada.',[1,2],'A ficha original informa ...; a cópia ...'],
        limite:['Quais acontecimentos o texto não revela? Pense em quem leu, se houve publicação fora da oficina e quem fez a cópia. Escolha o limite que se relaciona à sua resposta.',[2],'Não é possível afirmar que ... porque o caso não informa ...'],
        pergunta:['Transforme uma falta de informação em pergunta. Você pode investigar a preparação da cópia, a presença da orientação ou a consulta do material. Não comece supondo que houve divulgação indevida.',[1,2],'Como podemos verificar se ...?'],
        forca:['Quem revisa deve apontar algo que ficou claro nesta ficha, por exemplo a diferença entre uso permitido e leitura comprovada. Não diga que a revisão aconteceu se ela ainda não foi feita.',[1,2],'Ficou claro que ... / A revisão ainda não foi realizada.'],
        ajuste:['Peça a quem revisa que confira se alguma frase inventa quem fez a cópia, quem a leu ou uma publicação. Registre a dúvida ou a melhoria realmente indicada pela outra equipe.',[2],'Precisamos explicar melhor ... / A revisão ainda não foi realizada.'],
        tarefa:['Planejem uma verificação pequena ligada à dúvida: comparar a orientação nos dois materiais ou combinar com o professor como conferir a preparação da cópia. Ainda não é uma tarefa de programar um app.',[1,2],'Vamos conferir ... comparando ...'],
        responsavel:['Escolham na sua equipe quem registra e quem confere essa verificação. Esse responsável é da atividade de vocês; não é uma pessoa que vocês precisam descobrir no caso.',[],'Quem registra ...; quem confere ...'],
        quando:['Combinem com a equipe e o professor quando comparar os materiais ou rever a pergunta. Se ainda não combinaram, escrevam “a combinar”; não inventem um prazo.',[],'Vamos conferir ... / O momento ainda será combinado.'],
        pronto:['Descrevam o que permitirá conferir a tarefa: por exemplo, a comparação registrada com os materiais usados e a dúvida que restou. “Quando terminar” não explica como conferir.',[1,2],'Estará pronto quando conseguirmos mostrar ...'],
        registro:['Digam o que guardarão: a comparação escrita, uma anotação revisada ou a pergunta combinada. Se ainda vão produzir isso, indiquem que está pendente.',[],'Vamos guardar ...; esse registro ainda está ...']
      }
    },
    permanencia: {
      steps: [
        '1ª troca · A tabela chega à equipe',
        '2ª troca · A equipe prepara o resumo para a reunião'
      ],
      intro: [
        'Leia “Tabela de pedidos de apoio”. Localize o grupo que entrega os dados, o material entregue e quem o recebe. Descreva essa primeira troca; não invente quantidade de pedidos ou nomes de estudantes.',
        'Agora leia “Resumo para a reunião” e “Pergunta durante a reunião”. Compare a tabela e o resumo: o que deixou de aparecer? O caso não informa qual decisão foi tomada depois.'
      ],
      hints: {
        recorte:['Retome o problema escolhido na Aula 3 dentro de Permanência e Evasão Escolar. Explique a dificuldade que a equipe quer entender. A tabela e o resumo sem período ajudam a observar a circulação dos dados, mas não provam uma causa de evasão.',[0,1,2],'Nossa equipe quer entender como ...'],
        origem1:['No trecho “Tabela de pedidos de apoio”, qual grupo entrega a tabela? Use o nome do papel que está no texto. Não responda apenas “emissor” e não invente o nome de uma pessoa.',[0],'Quem entrega a tabela é ...'],
        destino1:['Ainda em “Tabela de pedidos de apoio”, para quem o setor entrega o material? Registre quem recebe nessa primeira troca, não quem participa da reunião depois.',[0],'A tabela é entregue à ...'],
        info1:['O que a tabela reúne e como esses dados estão separados? Escreva o conteúdo, não apenas “dados” ou “mensagem”. O caso não apresenta números: não invente quantidades.',[0],'A tabela contém ... organizados por ...'],
        canal1:['Qual material o setor usa para passar os dados à equipe? O caso cita uma tabela, mas não diz se foi enviada por e-mail ou impressa. Descreva só o meio que aparece no texto.',[0],'O material usado é ...; a forma de entrega ...'],
        uso1:['Leia também “Resumo para a reunião”. Para qual trabalho da equipe a tabela serve? Indique essa finalidade sem afirmar que algum estudante já recebeu apoio.',[0,1],'A equipe usa os dados para preparar ...'],
        origem2:['Em “Resumo para a reunião”, quem prepara o novo documento? O papel de quem organiza o resumo não é o mesmo do setor que entregou a tabela.',[1],'Quem prepara o resumo é ...'],
        destino2:['O resumo é feito para uma reunião, e uma pessoa pergunta sobre o período. Indique esse público sem inventar cargos, nomes ou afirmar que todos receberam o resumo.',[1,2],'O resumo se destina a ...; o caso não identifica ...'],
        info2:['Compare tabela e resumo. Qual assunto o resumo apresenta? Que duas informações o trecho diz que foram deixadas de fora? Escreva essa diferença.',[0,1],'O resumo apresenta ...; nele não aparecem ...'],
        canal2:['Qual documento leva a informação à discussão da reunião? Não invente slides, aplicativo, projeção ou papel, pois o caso não descreve o formato do resumo.',[1,2],'A informação aparece no ...'],
        uso2:['A pergunta “A que período esse resumo se refere?” mostra o que uma pessoa precisa entender. Relacione o resumo a essa consulta, mas não afirme uma decisão ou efeito que o texto não conta.',[2],'O resumo serve para consultar ...; não sabemos qual decisão ...'],
        fonte:['Para comparar os dados e o contexto que falta, indique “Tabela de pedidos de apoio” e “Resumo para a reunião”. Cite a pergunta da reunião quando sua resposta tratar da dúvida sobre o período.',[0,1,2],'Conferimos nos trechos ...'],
        evidencia:['Qual frase prova que o resumo perdeu contexto? Localize o que foi omitido e a pergunta feita durante a reunião. Isso não prova que a reunião tomou uma decisão errada.',[1,2],'O trecho ... diz que ...'],
        limite:['O caso conta a decisão da reunião, os motivos dos pedidos ou o efeito sobre a permanência? Separe a falta de contexto observada desses acontecimentos que não são informados.',[1,2],'Não podemos concluir ... porque ...'],
        pergunta:['Formule uma pergunta sobre o período dos pedidos ou a origem dos dados do resumo. Ela deve ajudar a conferir o que falta, sem supor por que um estudante abandonou o curso.',[0,1,2],'Como conferir de qual ... vieram os dados do resumo?'],
        forca:['Quem revisa pode avaliar se ficou clara a diferença entre tabela recebida e resumo preparado. Registre um ponto real da revisão; se ela não aconteceu, diga isso.',[0,1],'Ficou clara a diferença entre ... / A revisão ainda não foi realizada.'],
        ajuste:['Peça a quem revisa que procure número, causa de evasão ou decisão inventada. Registre a melhoria realmente indicada, como explicar de qual material veio uma afirmação.',[1,2],'Precisamos indicar melhor ... / A revisão ainda não foi realizada.'],
        tarefa:['Escolham uma verificação pequena: comparar o resumo com a tabela para identificar o período e a fonte que precisam ser conferidos. Não inventem o período que não foi fornecido.',[0,1],'Vamos comparar ... para verificar ...'],
        responsavel:['Escolham quem da equipe compara os materiais e quem confere a anotação. Não é necessário indicar uma pessoa do setor pedagógico fictício.',[],'Quem compara ...; quem confere ...'],
        quando:['Combinem quando a equipe vai comparar tabela e resumo ou discutir a pergunta com o professor. Se o momento não foi combinado, registrem isso.',[],'Conferiremos ... / O momento ainda será combinado.'],
        pronto:['Digam que resultado permitirá conferir a tarefa: a comparação deve apontar o que tem fonte e o que ainda depende de confirmação. Não basta escrever “resumo pronto”.',[0,1],'Estará pronto quando a comparação indicar ...'],
        registro:['Escolham o que guardar da verificação: uma comparação escrita, os nomes dos materiais e a pergunta que ainda falta responder. Não apresentem um registro planejado como já produzido.',[],'Ficará guardado ...; ainda precisamos ...']
      }
    }
  };
  let prepared=false,records={},selected='';
  const ids=['origem','destino','info','canal','uso'];
  const labels={origem:'Quem envia',destino:'Para quem',info:'O que é enviado',canal:'Por onde / meio usado',uso:'Para quê / finalidade'};
  const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.!?]+$/,'').trim();
  function vague(id,value){
    const t=normal(value),base=id.replace(/[12]$/,'');
    if(['origem','destino'].includes(base)&&['emissor','emissario','receptor','destinatario','pessoa','alguem'].includes(t))return 'Vale detalhar: qual pessoa, papel ou grupo aparece no material? Se ele não for identificado, registre que o caso não informa.';
    if(base==='info'&&['mensagem','informacao','dados','recado','conteudo'].includes(t))return 'Vale detalhar: o que a mensagem ou documento diz? Escreva o conteúdo que circula, usando a dica do projeto.';
    if(base==='uso'&&['para saber','saber','para informar','informar','para conhecer','conhecer'].includes(t))return 'Vale detalhar: saber o quê, para fazer o quê? Ligue o uso à situação descrita no projeto.';
    return '';
  }
  function isUnknown(value){return /não sabemos|não informado|não foi informad|não está informad|não é informad|não se sabe|caso não (informa|diz|confirma)|material não (informa|diz|confirma)|a investigar|ainda não sabemos/i.test(value);}
  function prepare(){
    if(prepared)return;prepared=true;
    document.querySelectorAll('#activity-sections label.field').forEach(old=>{
      const input=old.querySelector('textarea'),id=input.id,title=old.querySelector('span').textContent;
      const card=node('div',undefined,'field-card');card.dataset.fieldId=id;card.id='field-'+id;
      const label=node('label',title);label.htmlFor=id;
      const hint=node('p',undefined,'project-hint');hint.id=id+'-hint';
      const warn=node('p',undefined,'writing-tip');warn.id=id+'-writing';warn.hidden=true;
      const details=node('details',undefined,'field-help');details.id=id+'-help';
      details.append(node('summary','Ver trecho e ajuda para escrever'),node('div',undefined,'help-content'));
      input.placeholder='Escreva com suas palavras. A dica está logo acima.';
      input.setAttribute('aria-describedby',hint.id+' '+warn.id);
      card.append(label,hint,input,warn,details);old.replaceWith(card);
      input.addEventListener('input',()=>writingTip(id));
    });
    ['recorte','info1','info2'].forEach(id=>$('field-'+id)?.classList.add('span-2'));
    for(let i=1;i<=2;i++){
      const section=$('part-'+(i+1)),grid=section.querySelector('.grid');
      ids.forEach(prefix=>grid.append($('field-'+prefix+i)));
      const context=node('div',undefined,'step-context');context.id='context-'+i;grid.before(context);
      const a=node('a','Conferir estas respostas no esquema ↓','preview-link');a.href='#part-4';grid.after(a);
    }
    $('part-4').querySelector('h2').textContent='4 · Confira as duas trocas que vocês escreveram';
    $('part-4').querySelector('.section-note').textContent='Cada cartão mostra uma troca. Não ligamos as duas automaticamente: o material precisa apoiar essa ligação. Dúvida registrada não é campo vazio; as setas não comprovam que alguém recebeu ou leu.';
    $('part-4').querySelector('#preview').className='flow-preview';
    const legend=node('p','O esquema organiza o texto da equipe; não verifica se as respostas estão corretas. Campos vazios e dúvidas permanecem visíveis.','flow-legend');
    $('preview').after(legend);
    const warning=node('p',undefined,'project-change-note');warning.id='project-change-note';warning.hidden=true;
    $('caseMaterial').before(warning);
  }
  function writingTip(id){const warn=$(id+'-writing');if(!warn)return;const t=vague(id,val(id));warn.textContent=t;warn.hidden=!t;}
  function update(project,cases){
    prepare();selected=project;records=cases;
    const guide=GUIDES[project];
    document.querySelectorAll('.field-card').forEach(card=>{
      const id=card.dataset.fieldId,input=$(id),hint=$(id+'-hint'),help=card.querySelector('.help-content'),d=guide?.hints[id];
      input.disabled=!guide;card.querySelector('details').hidden=!guide;help.replaceChildren();
      if(!guide){$(id+'-writing').hidden=true;hint.textContent='Selecione o projeto na identificação para ver a orientação deste campo.';return;}
      hint.textContent=d[0];
      if(d[1].length){help.append(node('p','Volte a estes trechos da situação fictícia:','helper-label'));d[1].forEach(i=>{const [name,text]=cases[project].records[i];const q=node('blockquote');q.append(node('strong',name),node('p',text));help.append(q);});}
      help.append(node('p','Ajuda de escrita — complete apenas o que você verificou ou combinou:','helper-label'),node('p',d[2],'sentence-starter'),node('p','Isso é uma orientação, não uma resposta preenchida. As dicas e os trechos de apoio não entram no PDF.','hint'));
      writingTip(id);
    });
    for(let i=1;i<=2;i++){
      const context=$('context-'+i);context.replaceChildren();
      context.append(node('p',guide?cases[project].title:'Primeiro escolha o projeto','kicker'),node('h3',guide?guide.steps[i-1]:'As orientações desta troca aparecerão aqui.'),node('p',guide?guide.intro[i-1]:'A escolha é única, na identificação da atividade.'));
    }
    $('part-6').querySelector('.section-note').textContent='Peçam a outra equipe que leia as respostas e os trechos de apoio, no mesmo dispositivo ou em papel. Registrem o que ela realmente conferiu. Se ainda não houve revisão, escrevam “Revisão ainda não realizada” nos dois campos; não marquem critérios não conferidos.';
    renderFlow();
  }
  function outputBox(id,cls){
    const value=val(id),base=id.replace(/[12]$/,''),unknown=isUnknown(value),box=node('div',undefined,'flow-cell '+(cls||'')+(!value?' missing':unknown?' uncertain':''));
    box.append(node('span',labels[base],'flow-label'),node('p',value||'Ainda não preenchido','flow-value'));
    if(unknown)box.append(node('small','Dúvida registrada','uncertainty-tag'));
    return box;
  }
  function renderFlow(){
    const root=$('preview');if(!root)return;root.replaceChildren();
    if(!GUIDES[selected]){root.append(node('div','Escolha o projeto e comece a preencher. O esquema será montado apenas com suas respostas.','flow-empty'));return;}
    for(let i=1;i<=2;i++){
      const fieldIds=ids.map(k=>k+i),count=fieldIds.filter(k=>val(k)).length;
      const article=node('article',undefined,'flow-card');
      const head=node('header',undefined,'flow-head');head.append(node('h3',GUIDES[selected].steps[i-1]),node('span',count+' de 5 campos preenchidos','fill-count'));article.append(head);
      if(!count){article.append(node('p','Esta troca ainda não foi preenchida. Descreva o que o caso mostra e escreva o que não sabemos quando faltar uma informação.','flow-empty'));}
      else{
        const route=node('div',undefined,'flow-route');
        const from=outputBox('origem'+i,'sender'),to=outputBox('destino'+i,'receiver');
        const content=node('div',undefined,'flow-message');content.append(outputBox('info'+i),outputBox('canal'+i));
        const arrow=()=>{const a=node('span',undefined,'flow-arrow');a.setAttribute('aria-hidden','true');return a;};
        route.append(from,arrow(),content,arrow(),to);article.append(route,outputBox('uso'+i,'purpose'));
        if(fieldIds.some(k=>vague(k,val(k))))article.append(node('p','Há uma expressão genérica nesta troca. Consulte as dicas de escrita junto aos campos para dizer quem participa, qual conteúdo circula e para que ele serve.','writing-tip'));
      }
      const link=node('a','Rever os campos da '+i+'ª troca ↑','preview-link');link.href='#part-'+(i+1);article.append(link);root.append(article);
    }
  }
  function flagProjectChange(){const n=$('project-change-note');if(n){n.hidden=false;n.textContent='O projeto foi alterado. Suas respostas foram preservadas; confira se cada uma corresponde à nova situação antes de gerar o PDF.';}}
  function clearProjectWarning(){if($('project-change-note'))$('project-change-note').hidden=true;}
  window.PpiGuide=Object.freeze({update,renderFlow,flagProjectChange,clearProjectWarning,version:'2.3.0'});
})();
