# Ficha Avaliativa — Aula 07: Da pergunta à evidência

**Produto:** Protocolo de Elicitação Testado — versão 1. **Ficha/schema/rubrica:** 1.0.0.

Ficha estática da equipe, com autoria individual, para PPI I — IFMA Campus Itapecuru-Mirim. A navegação estudantil está em HTML: `index.html` (interativa) e `papel.html` (conteúdo completo sem JavaScript). Este README destina-se à manutenção técnica.

## Uso

1. Abra `index.html` no portal ou por servidor de arquivos estáticos; todos os recursos são locais.
2. Cadastre identificação acadêmica mínima, trilha e integrantes. As duas trilhas compartilham os mesmos critérios e 100 XP.
3. Percorra as sete missões pelo índice ou pelos botões anterior/próxima. O botão **Conferir pendências** orienta o preenchimento sem impedir exportação parcial.
4. Em **Revisar e guardar**, baixe o JSON para continuar em outro momento/dispositivo ou abra a prévia de impressão. A impressão usa papel A4 e a opção **Salvar como PDF** do navegador.
5. A versão em branco não apaga respostas. Na prévia interativa, ela oferece pelo menos quatro espaços de autoria, ampliados ao número de integrantes cadastrados. Uma ficha parcial sem integrantes também inclui quatro espaços de identificação/autoria; um quadro com menos de três registros ganha espaços vazios na impressão. Essas áreas manuais não alteram o estado nem os XP. A versão estática tem quatro espaços e orienta imprimir cópias da autoria para equipes maiores.

O formulário funciona sem backend, login, telemetria, fonte remota, biblioteca de runtime ou etapa de build. Após carregar os arquivos estáticos, navegação, cálculos e exportações continuam sem conexão. A disponibilidade da página após fechar o navegador depende do armazenamento/cache do dispositivo; não há promessa de cache offline persistente nem service worker.

Nenhuma resposta é submetida automaticamente. O JSON/Markdown/PDF contém a identificação mínima e as respostas informadas; a equipe decide como entregar a cópia conforme orientação docente. Em computadores compartilhados, exporte um rascunho e use **Apagar todo o preenchimento** ao terminar.

## Pontuação e limites pedagógicos

| Missão | XP |
| --- | ---: |
| 1 — Definir a descoberta | 10 |
| 2 — Escolher as técnicas | 15 |
| 3 — Construir o protocolo | 20 |
| 4 — Gate ético e proveniência | 15 |
| 5 — Testar o roteiro | 20 |
| 6 — Quadro de evidências | 10 |
| 7 — Autoria individual | 10 |
| **Total** | **100** |

`rubric.js` é a única fonte executável de IDs e pesos. Cada critério tem rótulo público, peso e função determinística. A soma das missões e dos critérios é verificada ao carregar o módulo. Os critérios aparecem na interface, no Markdown e no documento de impressão.

A nota automática de processo é `XP / 10`, mostrada com uma casa decimal. O total de XP pode ter frações na missão 7: cada um dos cinco critérios vale `2 × integrantes com o campo completo / integrantes cadastrados`. Um nome apagado não remove o integrante do denominador. Remover um integrante exige confirmação, preserva IDs/autorias dos demais e recalcula a média. A interface apresenta completude individual sem ranking.

Campos vazios, espaços e opções padrão não pontuam. Apagar respostas reduz a pontuação. A entrevista começa com sete perguntas: seis famílias e o fechamento aberto, incluído no limite total de seis a oito. A pergunta final pré-preenchida não pontua antes de a equipe registrar sua finalidade. Exemplos e cartões não preenchem respostas automaticamente.

A missão 5 só alcança 20 XP com uma revisão explícita após o teste. A missão 6 exige um achado, uma hipótese e uma pendência completos, além de limitação e necessidades candidatas; cartões adicionais vazios são opcionais. O registro de uso de IA é opcional e não altera XP.

**Pontuação automática de completude e processo. A qualidade técnica e ética permanece sujeita à revisão docente.** Pontos não comprovam veracidade, qualidade, consentimento, autorização de coleta/publicação ou aprovação docente. A nota oficial **PPI1-3B não é calculada**: o plano descreve protocolo e catálogo, e a formalização em RF, RNF e requisitos de dados pertence à Aula 08. A revisão docente permanece **Pendente**; não existe controle que permita simular uma aprovação do professor.

Os XP de treino da apresentação da Aula 07 são separados. A ficha não lê sua storage key, não importa suas respostas e não soma seus pontos.

## Arquitetura e APIs de manutenção

Os módulos locais usam o mesmo padrão DOM seguro, tokens de cor, tipografia, campos, cartões, mensagens, navegação e impressão da ficha da Aula 06, com responsabilidades separadas. Os scripts de entrega externa da Aula 06 não são carregados, pois esta missão proíbe submissão.

| Arquivo | Responsabilidade |
| --- | --- |
| `content.js` | Versões, avisos, rótulos de campos, trilhas, exemplos sintéticos e categorias. |
| `model.js` | Estado, IDs estáveis, importação restrita, troca de trilha, resets e integrantes. |
| `rubric.js` | Contrato único de pontuação e cálculo puro. |
| `storage.js` | Salvamento/retomada local com erros tratados; estado da navegação separado. |
| `export.js` | JSON, Markdown escapado, nomes de arquivo e documento em DOM seguro. |
| `app.js` | Controles, navegação, foco, validação acessível e ligação dos módulos. |
| `schema.json` | JSON Schema 2020-12 versionado, sem consulta remota em runtime. |
| `ficha.css` | Tokens visuais da Aula 06, reflow, contraste, redução de movimento e A4. |
| `papel.html` | Ficha completa, estática, com espaços manuscritos e as duas trilhas. |

APIs CommonJS equivalentes aos globais do navegador:

```js
const Model = require('./model.js');
const Rubric = require('./rubric.js');
const Export = require('./export.js');
const state = Model.createEmpty();
Rubric.score(state); // xp: 0, grade: 0, status: 'Não iniciada'
const restored = Model.validateImport(Export.exportJSON(state));
```

`score()` retorna XP total, nota, progresso, estado, critérios por missão, pendências e completude de autoria. `switchTrack()` preserva somente os dados de identificação e os IDs/nomes/papéis dos integrantes; respostas de missões e autoria são apagadas após confirmação na interface. `resetMission()` preserva outras missões. `removeMember()` também limpa referências ao integrante removido em técnicas, teste e validação de IA.

## Schema, importação e segurança

- Tamanho máximo: **512 KiB**; profundidade: **12 níveis**; texto: **6.000 caracteres**; integrantes: **12**; técnicas: **4**; perguntas: **6–8**; registros de evidência: **20**.
- Todos os objetos de respostas têm chaves conhecidas; propriedades extras são rejeitadas. `__proto__`, `constructor` e `prototype` são recusados em qualquer profundidade.
- IDs devem ser únicos dentro das coleções, e referências de integrantes precisam apontar para IDs existentes. Há exatamente uma técnica principal.
- Enums, tipos, datas calendáricas e URLs HTTPS sem credenciais são validados. A identificação pode permanecer incompleta durante a atividade, com pendências claras.
- `exportedAt` e `score` são metadados opcionais previstos no envelope. São descartados; nenhum número de pontuação importado afeta o cálculo. Mesmo metadados passam pelos limites e pela busca de propriedades perigosas.
- Schema desconhecido é recusado com explicação. Não há migração silenciosa ou aceitação de rascunhos de outras aulas.
- O arquivo atual só é substituído após validação completa e confirmação. Cancelamento/erro não modifica respostas.
- Uma URL ainda em edição pode permanecer no rascunho local sem descartar o restante do preenchimento ao recarregar. A importação de arquivo e a exportação exigem HTTPS válido ou campo vazio; o erro é associado ao campo.
- Respostas são inseridas com `textContent` e controles nativos. Não há `eval`, HTML de usuário executável, conexão de rede ou submissão de formulário. Markdown e nomes de arquivo são escapados/sanitizados.
- `localStorage` usa `ppi-aula07-ficha-v1`; a chave `ppi-aula07-ficha-v1-ui` guarda somente etapa/contraste. Falha de quota ou disponibilidade mantém o estado em memória e recomenda baixar JSON. Um rascunho local corrompido é preservado, não apagado automaticamente.

## Acessibilidade, impressão e contingência

HTML semântico com landmarks, link para pular, labels/legends, foco visível, erro associado ao campo e resumo focável. Trocas de missão focam o título; inserções/remoções restauram foco em alvo útil. Confirmações destrutivas usam o diálogo nativo do navegador. O progresso usa anúncio debounced e mensagens textuais; não depende apenas de cor. Os controles funcionam por teclado, sem arrastar e soltar.

O layout tem reflow a 320 CSS px e não usa controles fixos sobre o conteúdo. Inclui alto contraste, `forced-colors` e `prefers-reduced-motion`. Na impressão, controles são removidos, respostas viram texto com quebras e pendências ficam explicitadas. A prévia preenchida, parcial ou em branco sempre identifica versão, data/hora local, trilha e limites da nota.

`papel.html` oferece todos os campos e rubricas mesmo se o JavaScript falhar. Sem JavaScript não há cálculo automático nem salvamento de respostas; o preenchimento é manuscrito ou em editor indicado pelo docente.

## Verificação

A suíte e os relatórios independentes pertencem a `tests/aula07-ficha/` e `docs/reviews/aula07-ficha/`. Execute a partir da raiz do repositório:

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:aula07-ficha
```

Os scripts exatos da suite e as evidências executadas são definidos pelo coordenador e pelo QA. Este documento não declara conformidade WCAG completa, revisão humana docente ou resultado de teste não executado. Testes automatizados de acessibilidade cobrem apenas os critérios detectáveis pelas ferramentas.
