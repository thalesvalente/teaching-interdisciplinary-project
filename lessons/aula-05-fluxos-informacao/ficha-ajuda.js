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
        '1ª troca · A equipe entrega a folha de consulta',
        '2ª troca · Um participante pergunta sobre o uso do material'
      ],
      intro: [
        'Primeiro acompanhe a entrega do material da oficina. A equipe do projeto prepara uma folha de consulta e a entrega a um participante. Compare essa folha com a ficha completa da memória para perceber qual orientação ficou de fora.',
        'Depois acompanhe a pergunta do participante à equipe. Ele quer saber se pode fotografar e publicar o material. O caso informa a pergunta, mas não informa a resposta nem o que aconteceu depois.'
      ],
      hints: {
        recorte:['Retome o problema que sua equipe escolheu na Aula 3 dentro de Memórias Quilombolas. Explique a dificuldade que vocês querem entender. A situação da oficina abaixo serve apenas para praticar como seguir uma informação; ela não obriga sua equipe a mudar o problema do projeto.',[0,1,2],'Nossa equipe quer entender como ...'],
        origem1:['Leia “Folha de consulta da oficina”. Quem preparou e entregou esse material? O texto identifica o grupo: use esse papel, em vez de escrever apenas “emissor”.',[1,2],'Quem envia a informação é ...'],
        destino1:['Leia “Pergunta do participante”. Quem recebeu a folha de consulta para acompanhar a atividade? Registre o papel indicado no texto, sem inventar nome de pessoa.',[2],'A folha de consulta é entregue a ...'],
        info1:['Compare “Ficha completa da memória” com “Folha de consulta da oficina”. Escreva o que aparece na folha e qual orientação importante não aparece nela.',[0,1],'A folha de consulta mostra ...; nela não aparece ...'],
        canal1:['Qual material leva essas informações da equipe até o participante? O caso nomeia esse material. Não troque por e-mail, aplicativo ou mensagem.',[1,2],'A informação é passada por meio da ...'],
        uso1:['Para que o participante recebe a folha? Volte ao trecho “Pergunta do participante”: ela foi entregue para acompanhar a atividade e consultar a memória durante a oficina.',[2],'O participante usa essa informação para ...'],
        origem2:['Na segunda troca, quem inicia a comunicação? Leia “Pergunta do participante” e identifique quem faz a pergunta.',[2],'Quem inicia a segunda troca é ...'],
        destino2:['A quem o participante dirige a pergunta sobre fotografar e publicar? Use o grupo indicado no próprio trecho.',[2],'A pergunta é dirigida à ...'],
        info2:['Escreva o conteúdo da pergunta feita pelo participante. Você pode resumir sem mudar o sentido: ele quer saber se pode fotografar e publicar o material.',[2],'O participante pergunta se ...'],
        canal2:['Como a pergunta é feita no caso? O texto diz que ela é feita oralmente durante a oficina. Registre esse meio, sem inventar aplicativo ou mensagem.',[2],'A pergunta é feita por meio de ...'],
        uso2:['Para que o participante faz a pergunta? Ele precisa esclarecer se tem autorização para fotografar e publicar o material.',[0,2],'A pergunta serve para esclarecer se ...'],
        fonte:['Indique os trechos que vocês realmente usaram. Para comparar conteúdo e orientação, use “Ficha completa da memória” e “Folha de consulta da oficina”; para a segunda troca, use “Pergunta do participante”.',[0,1,2],'Conferimos em ...'],
        evidencia:['Mostre o trecho que sustenta sua resposta. Uma boa evidência pode comparar o que existe na ficha completa com o que falta na folha de consulta ou citar a pergunta sobre fotografia e publicação.',[0,1,2],'O material informa que ...'],
        limite:['O caso para em um ponto importante: ele não informa a resposta dada ao participante nem diz se houve fotografia ou publicação depois. Escolha o limite relacionado ao que sua equipe escreveu.',[2],'Não é possível afirmar que ... porque o caso não informa ...'],
        pergunta:['Transforme o que ficou desconhecido em uma pergunta específica. Por exemplo, investigue qual resposta foi dada ou quais orientações precisam acompanhar um material antes de ser compartilhado.',[0,1,2],'Como podemos verificar ...?'],
        forca:['Quem revisa deve apontar algo que ficou claro na ficha: por exemplo, a diferença entre o que estava autorizado na ficha completa e o que apareceu na folha de consulta. Se a revisão ainda não ocorreu, registre isso.',[0,1],'Ficou claro que ... / A revisão ainda não foi realizada.'],
        ajuste:['Peça à outra equipe que confira se os dois fluxos têm atores, informação, meio e finalidade apoiados no caso. Registre uma melhoria concreta; não escreva apenas “está bom”.',[1,2],'Precisamos explicar melhor ... / A revisão ainda não foi realizada.'],
        tarefa:['Planejem uma próxima verificação ligada ao projeto: listar quais orientações de uso e autorização precisam acompanhar uma memória antes de consulta, fotografia ou publicação. Isso prepara a próxima aula sobre ética e consentimento; ainda não é uma tarefa de programar um app.',[0,1,2],'Vamos verificar quais orientações ...'],
        responsavel:['Escolham na própria equipe quem registra essa verificação e quem confere. Aqui o responsável é um papel da equipe de vocês, não um personagem da situação fictícia.',[],'Quem registra ...; quem confere ...'],
        quando:['Combinem com a equipe e o professor quando essa verificação será retomada. Se ainda não combinaram, escrevam “a combinar”; não inventem prazo.',[],'Vamos conferir ... / O momento ainda será combinado.'],
        pronto:['Definam uma condição que possa ser conferida: por exemplo, a equipe consegue listar as orientações que precisa confirmar e apontar de onde veio cada uma ou qual dúvida continua aberta.',[0,1,2],'Estará pronto quando conseguirmos mostrar ...'],
        registro:['Digam o que ficará guardado como evidência da próxima tarefa: por exemplo, uma lista revisada de orientações e dúvidas. Se ainda será produzida, marque como pendente.',[],'Vamos guardar ...; esse registro ainda está ...']
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
