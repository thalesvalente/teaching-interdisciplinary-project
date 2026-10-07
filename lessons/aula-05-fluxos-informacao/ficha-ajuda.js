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
        'Etapa 1 · Da fonte histórica para a equipe do projeto',
        'Etapa 2 · Do registro preparado para a revisão'
      ],
      intro: [
        'Acompanhe como uma informação histórica entra no projeto. A equipe consulta uma fonte pública sobre Itamatatiua e usa esse material para registrar um evento no Mapa de Memórias.',
        'Depois acompanhe o registro produzido pela equipe. Outro integrante revisa a entrada antes de considerá-la pronta, comparando cada afirmação com a fonte.'
      ],
      hints: {
        recorte:['Retome o problema escolhido na Aula 3 para o Mapa de Memórias Quilombolas. Depois observe o exemplo histórico abaixo: a fundação da Associação de Mulheres de Itamatatiua, em 1989. Esse evento serve para praticar como uma memória documentada entra no projeto; não obriga sua equipe a escolher o mesmo evento.',[0,1,2],'Nossa equipe quer investigar ...'],
        origem1:['ORIGEM significa “de onde veio a informação”. Neste caso, procure a fonte pública que informa o ano de fundação e a origem da Associação de Mulheres de Itamatatiua. Não escreva apenas “internet”: identifique a fonte.',[0],'A origem da informação é ...'],
        destino1:['DESTINO significa “onde a informação passa a ser usada”. Neste exercício, a informação da fonte pública é usada no registro preparado para o Mapa de Memórias pela equipe do projeto.',[0,1],'O destino da informação nesta etapa é ...'],
        info1:['Quais fatos históricos a fonte pública apresenta? Registre o evento, o ano e a origem da associação sem acrescentar finalidades que a fonte não declara.',[0],'A fonte informa que, em 1989, ...'],
        canal1:['Por qual meio a equipe acessa essa informação? O caso indica um cadastro público na web, identificado como MuseusBr.',[0],'A equipe consulta a informação por meio de ...'],
        uso1:['Para que a equipe consulta essa fonte? Relacione a consulta à criação de uma entrada histórica no Mapa de Memórias, e não a uma solução tecnológica específica.',[0,1],'A informação será usada para ...'],
        origem2:['Na segunda etapa, a ORIGEM já não é a página pública: é o registro preparado para o mapa. Localize esse registro no caso.',[1],'A origem nesta etapa é ...'],
        destino2:['DESTINO é onde o registro chega para ser usado. Aqui ele chega à etapa de revisão da equipe antes de ser considerado pronto.',[2],'O destino nesta etapa é ...'],
        info2:['O que está sendo revisado? Descreva a entrada preparada para o mapa: evento, ano, comunidade, síntese e fonte.',[1,2],'O registro para revisão contém ...'],
        canal2:['Por qual meio essa informação circula na segunda etapa? No exercício, ela está registrada em uma entrada/ficha de memória do próprio projeto.',[1,2],'A informação circula por meio do ...'],
        uso2:['Para que serve a revisão? Ela existe para conferir se o texto do mapa permanece fiel ao que a fonte realmente sustenta antes de publicação.',[1,2],'A revisão serve para ...'],
        fonte:['Indique a fonte histórica usada e o registro do projeto que foi revisado. Aqui a fonte pública é o cadastro MuseusBr sobre a Associação de Mulheres de Itamatatiua.',[0,1,2],'Conferimos a informação histórica em ... e revisamos ...'],
        evidencia:['Escolha um trecho que sustente a memória registrada. Um bom exemplo é o trecho que informa a fundação em 1989 e a origem no clube de mães. Não transforme a organização da produção cerâmica em uma finalidade comercial exclusiva.',[0,2],'A fonte informa que ...'],
        limite:['Mostre o que a fonte consultada não permite afirmar. O material não apresenta, nesse trecho, o dia e o mês exatos da fundação nem diz que a associação foi criada exclusivamente para vender cerâmica.',[0,2],'Com esta fonte, ainda não podemos afirmar ...'],
        pergunta:['Transforme um limite da fonte em pergunta investigável. Pergunte que outra fonte poderia confirmar um detalhe necessário ao mapa, como a data completa ou outras versões da história da associação.',[0,2],'Que fonte poderíamos consultar para verificar ...?'],
        forca:['Quem revisa deve apontar o que ficou bem sustentado pela fonte: por exemplo, evento, ano e origem da associação. Se a revisão ainda não ocorreu, registre isso.',[0,1,2],'Ficou claro e apoiado pela fonte que ... / A revisão ainda não foi realizada.'],
        ajuste:['Peça à outra equipe que procure afirmações que vão além da fonte. O próprio caso mostra uma pergunta problemática: dizer que a associação foi criada para vender cerâmica seria acrescentar uma finalidade não informada.',[0,2],'Precisamos ajustar a frase ... porque a fonte apenas informa ...'],
        tarefa:['Planejem uma verificação pequena para uma memória do projeto: escolher um evento, localizar pelo menos uma fonte adequada, registrar o que ela sustenta e anotar o que ainda precisa de confirmação.',[0,1,2],'Vamos selecionar um evento e verificar ...'],
        responsavel:['Escolham na equipe quem localiza a fonte, quem registra a memória e quem revisa. Esses são papéis de trabalho da equipe, não personagens do evento histórico.',[],'Quem pesquisa ...; quem registra ...; quem revisa ...'],
        quando:['Combinem quando essa memória será revisada com a equipe e o professor. Se ainda não combinaram, escrevam “a combinar”.',[],'Vamos revisar ... / O momento ainda será combinado.'],
        pronto:['Definam uma condição verificável: a memória deve conter evento, data disponível, comunidade, síntese, fonte e limites claramente registrados.',[0,1,2],'Estará pronto quando o registro apresentar ...'],
        registro:['Digam o que ficará guardado: a ficha/entrada da memória, a referência da fonte e a anotação das dúvidas que ainda precisam ser investigadas.',[],'Vamos guardar ...']
      }
    },
    permanencia: {
      steps: [
        'Etapa 1 · A tabela chega à equipe',
        'Etapa 2 · A equipe prepara o resumo para a reunião'
      ],
      intro: [
        'Leia “Tabela de pedidos de apoio”. Localize o grupo que entrega os dados, o material entregue e quem o recebe. Descreva essa primeira troca; não invente quantidade de pedidos ou nomes de estudantes.',
        'Agora leia “Resumo para a reunião” e “Pergunta durante a reunião”. Compare a tabela e o resumo: o que deixou de aparecer? O caso não informa qual decisão foi tomada depois.'
      ],
      hints: {
        recorte:['Retome o problema escolhido na Aula 3 dentro de Permanência e Evasão Escolar. Explique a dificuldade que a equipe quer entender. A tabela e o resumo sem período ajudam a observar a circulação dos dados, mas não provam uma causa de evasão.',[0,1,2],'Nossa equipe quer entender como ...'],
        origem1:['ORIGEM é de onde os dados vêm. No trecho “Tabela de pedidos de apoio”, identifique o setor que fornece a tabela. Não invente nome de pessoa.',[0],'A origem dos dados é ...'],
        destino1:['DESTINO é onde a informação passa a ser usada. A tabela chega à equipe do projeto, que usará esses dados para preparar um resumo.',[0,1],'O destino da tabela nesta etapa é ...'],
        info1:['O que a tabela reúne e como esses dados estão separados? Escreva o conteúdo, não apenas “dados” ou “mensagem”. O caso não apresenta números: não invente quantidades.',[0],'A tabela contém ... organizados por ...'],
        canal1:['Qual material o setor usa para passar os dados à equipe? O caso cita uma tabela, mas não diz se foi enviada por e-mail ou impressa. Descreva só o meio que aparece no texto.',[0],'O material usado é ...; a forma de entrega ...'],
        uso1:['Leia também “Resumo para a reunião”. Para qual trabalho da equipe a tabela serve? Indique essa finalidade sem afirmar que algum estudante já recebeu apoio.',[0,1],'A equipe usa os dados para preparar ...'],
        origem2:['Na segunda etapa, a ORIGEM é o resumo preparado pela equipe a partir da tabela. Identifique esse novo registro, não o setor da etapa anterior.',[1],'A origem nesta etapa é ...'],
        destino2:['DESTINO é onde o resumo será usado: a reunião. Não é necessário inventar o nome ou cargo de quem participa.',[1,2],'O destino do resumo é ...'],
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
  const labels={origem:'ORIGEM · de onde vem',info:'INFORMAÇÃO · o que é',canal:'MEIO · onde aparece',destino:'DESTINO · onde chega/é usada',uso:'FINALIDADE · para que serve'};
  const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.!?]+$/,'').trim();
  function vague(id,value){
    const t=normal(value),base=id.replace(/[12]$/,'');
    if(['origem','destino'].includes(base)&&['emissor','emissario','receptor','destinatario','pessoa','alguem'].includes(t))return 'Vale detalhar: indique algo específico do material. Em ORIGEM, pode ser uma página, documento, setor, grupo ou pessoa. Em DESTINO, pode ser uma ficha, mapa, reunião, sistema, equipe, setor ou pessoa.';
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
    $('part-4').querySelector('h2').textContent='4 · Confira as duas etapas que vocês escreveram';
    $('part-4').querySelector('.section-note').textContent='Cada cartão mostra uma etapa do caminho: ORIGEM → INFORMAÇÃO/MEIO → DESTINO, com a FINALIDADE abaixo. Origem e destino não precisam ser pessoas. Dúvida registrada não é campo vazio.';
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
      if(d[1].length){help.append(node('p','Volte a estes trechos da situação de análise:','helper-label'));d[1].forEach(i=>{const [name,text]=cases[project].records[i];const q=node('blockquote');q.append(node('strong',name),node('p',text));help.append(q);});}
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
      if(!count){article.append(node('p','Esta etapa ainda não foi preenchida. Use as cinco partes: origem, informação, meio, destino e finalidade. Se o material não informar algo, registre a dúvida.','flow-empty'));}
      else{
        const route=node('div',undefined,'flow-route');
        const from=outputBox('origem'+i,'sender'),to=outputBox('destino'+i,'receiver');
        const content=node('div',undefined,'flow-message');content.append(outputBox('info'+i),outputBox('canal'+i));
        const arrow=()=>{const a=node('span',undefined,'flow-arrow');a.setAttribute('aria-hidden','true');return a;};
        route.append(from,arrow(),content,arrow(),to);article.append(route,outputBox('uso'+i,'purpose'));
        if(fieldIds.some(k=>vague(k,val(k))))article.append(node('p','Há uma expressão genérica nesta troca. Consulte as dicas de escrita junto aos campos para dizer quem participa, qual conteúdo circula e para que ele serve.','writing-tip'));
      }
      const link=node('a','Rever os campos da etapa '+i+' ↑','preview-link');link.href='#part-'+(i+1);article.append(link);root.append(article);
    }
  }
  function flagProjectChange(){const n=$('project-change-note');if(n){n.hidden=false;n.textContent='O projeto foi alterado. Suas respostas foram preservadas; confira se cada uma corresponde à nova situação antes de gerar o PDF.';}}
  function clearProjectWarning(){if($('project-change-note'))$('project-change-note').hidden=true;}
  window.PpiGuide=Object.freeze({update,renderFlow,flagProjectChange,clearProjectWarning,version:'2.6.0'});
})();
