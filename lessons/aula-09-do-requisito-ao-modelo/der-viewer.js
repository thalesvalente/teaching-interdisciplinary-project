/* Aula 09 — visualizador local, sem dependências, sem alterar o modelo/avaliação. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const viewer = byId('derViewerDialog'), legend = byId('derLegendDialog');
  const viewport = byId('derViewport'), canvas = byId('derCanvas'), stage = byId('derStage');
  const select = byId('derViewSelect'), zoomValue = byId('derZoomValue');
  const MIN = .1, MAX = 4;
  const blocks = {
    eda: [
      ['Estrutura acadêmica', ['CAMPUS','CURSO','ANO_CURRICULAR']],
      ['Turmas, estudantes e disciplinas', ['ANO_CURRICULAR','TURMA','ESTUDANTE','MATRICULA','DISCIPLINA']],
      ['Resultados por disciplina', ['MATRICULA','DISCIPLINA','DESEMPENHO']]
    ],
    memorias: [
      ['Comunidades, pontos e relatos', ['COMUNIDADE','PONTO_MEMORIA','RELATO']],
      ['Classificação por temas', ['RELATO','RELATO_TEMA','TEMA']],
      ['Fontes dos relatos', ['RELATO','RELATO_FONTE','FONTE']],
      ['Mídias dos relatos', ['RELATO','MIDIA']]
    ]
  };
  let views = [], zoom = 1, naturalWidth = 1, naturalHeight = 1, drag = null;
  const clamp = n => Math.max(MIN,Math.min(MAX,n));
  function openLegend() {
    if (!legend.open) legend.showModal();
  }
  function buildViews(kind) {
    const d = data(), result = [];
    if (kind === 'study') {
      const lesson = d.study[activeMission()];
      if (lesson.modelSvg) result.push({label:'Recorte do estudo', svg:lesson.modelSvg});
    }
    if (kind === 'question') {
      const i = current().index, g = d.questions[i].guide;
      const svg = current().hints[i] > 0 ? g.diagramFocused || g.diagram : g.diagram;
      if (svg) result.push({label:'Recorte desta questão',svg});
    }
    if (kind === 'evolution') {
      // O botão fica na solução já liberada; verificar também o estado.
      if (current().answers.slice(12).every((a,i)=>a===d.questions[12+i].correct))
        result.push({label:'Modelo evoluído',svg:d.newSvg});
    }
    result.push({label:'DER completo',svg:d.svg});
    for (const [label, ids] of blocks[state.track]) result.push({label,svg:d.svg,ids});
    return result;
  }
  function fitScale(widthOnly=false) {
    const w=Math.max(1,viewport.clientWidth-26)/naturalWidth;
    const h=Math.max(1,viewport.clientHeight-26)/naturalHeight;
    return clamp(widthOnly?w:Math.min(w,h));
  }
  function setZoom(n, anchor=true) {
    n=clamp(n);
    const before=canvas.getBoundingClientRect(), vp=viewport.getBoundingClientRect();
    const cx=vp.left+viewport.clientWidth/2, cy=vp.top+viewport.clientHeight/2;
    const ax=before.width?Math.max(0,Math.min(1,(cx-before.left)/before.width)):.5;
    const ay=before.height?Math.max(0,Math.min(1,(cy-before.top)/before.height)):.5;
    zoom=n;
    canvas.style.width=naturalWidth*zoom+'px';
    canvas.style.height=naturalHeight*zoom+'px';
    if(anchor){
      const after=canvas.getBoundingClientRect();
      viewport.scrollLeft+=after.left+ax*after.width-cx;
      viewport.scrollTop+=after.top+ay*after.height-cy;
    } else {viewport.scrollLeft=0;viewport.scrollTop=0;}
    zoomValue.textContent=Math.round(zoom*100)+'%';
    byId('derZoomIn').disabled=zoom>=MAX-.0001;
    byId('derZoomOut').disabled=zoom<=MIN+.0001;
  }
  function renderView() {
    const view=views[Number(select.value)]; if(!view)return;
    // SVGs são os mesmos artefatos estáticos e confiáveis do DATA da aula.
    const parsed=new DOMParser().parseFromString(view.svg,'image/svg+xml');
    const root=parsed.documentElement;
    if(root.localName!=='svg'||parsed.querySelector('parsererror')) {
      canvas.replaceChildren(document.createTextNode('Diagrama indisponível. Consulte a descrição textual.'));
      return;
    }
    const svg=document.importNode(root,true);
    svg.removeAttribute('width');svg.removeAttribute('height');
    canvas.style.width='100%';canvas.style.height='100%';
    canvas.replaceChildren(svg);
    if(view.ids){
      const ids=new Set(view.ids), graph=svg.querySelector('g.graph');
      if(graph){
        // Recorte geométrico do DER original: não cria nem altera cardinalidades.
        for(const node of graph.querySelectorAll('g.node')){
          if(!ids.has(node.querySelector('title')?.textContent))node.remove();
        }
        for(const edge of graph.querySelectorAll('g.edge')){
          const pair=(edge.querySelector('title')?.textContent||'').split('->');
          if(pair.length!==2||!pair.every(id=>ids.has(id)))edge.remove();
        }
        // Remova o fundo global do Graphviz para que o recorte não herde margens do DER completo.
        for(const child of [...graph.children])if(!child.matches('g.node,g.edge'))child.remove();
        graph.removeAttribute('transform');
        const b=graph.getBBox(), pad=15;
        if(b.width>0&&b.height>0)svg.setAttribute('viewBox',[b.x-pad,b.y-pad,b.width+2*pad,b.height+2*pad].join(' '));
      }
      svg.setAttribute('aria-label','Recorte do DER: '+view.label+'. Entidades: '+view.ids.join(', '));
    }
    const b=svg.viewBox.baseVal;
    naturalWidth=Math.max(1,b.width*4/3);naturalHeight=Math.max(1,b.height*4/3);
    // No celular, não começar com texto microscópico: a visão inicial pode exigir deslocamento.
    setZoom(Math.max(.8,Math.min(1.5,fitScale())),false);
    byId('derViewStatus').textContent=view.label;
  }
  function openViewer(kind) {
    views=buildViews(kind);
    select.replaceChildren(...views.map((view,i)=>{
      const option=document.createElement('option');option.value=String(i);option.textContent=view.label;return option;
    }));
    select.value='0';
    if(!viewer.open)viewer.showModal();
    renderView();
    select.focus();
  }
  document.addEventListener('click',e=>{
    const target=e.target.closest('button');
    if(!target)return;
    if(target.hasAttribute('data-der-legend'))openLegend();
    if(target.hasAttribute('data-der-open'))openViewer(target.dataset.derOpen);
    if(target.hasAttribute('data-der-close'))byId(target.dataset.derClose).close();
  });
  select.addEventListener('change',renderView);
  byId('derZoomIn').addEventListener('click',()=>setZoom(zoom*1.25));
  byId('derZoomOut').addEventListener('click',()=>setZoom(zoom/1.25));
  byId('derFit').addEventListener('click',()=>setZoom(fitScale(),false));
  byId('derFitWidth').addEventListener('click',()=>setZoom(fitScale(true),false));
  byId('derReset').addEventListener('click',()=>setZoom(1,false));
  viewport.addEventListener('keydown',e=>{
    if(e.key==='+'||e.key==='='||e.key==='-'){
      e.preventDefault();setZoom(e.key==='-'?zoom/1.25:zoom*1.25);
    }
  });
  viewport.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0||!stage.contains(e.target))return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
    viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');e.preventDefault();viewport.focus({preventScroll:true});
  });
  viewport.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    viewport.scrollLeft=drag.left+drag.x-e.clientX;
    viewport.scrollTop=drag.top+drag.y-e.clientY;
  });
  function stopDrag(){drag=null;viewport.classList.remove('dragging');}
  for(const event of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(event,stopDrag);
  viewer.addEventListener('close',stopDrag);
  window.addEventListener('resize',()=>{if(viewer.open)setZoom(zoom);});
})();
