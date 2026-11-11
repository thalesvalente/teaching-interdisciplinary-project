# Implantação privada do Laboratório Vivo

## Estado desta entrega

O código foi preparado e testado localmente com serviços simulados. O projeto nativo Google Apps Script e a URL `/exec` **não são criados por estes arquivos**. A criação, OAuth, implantação e teste do navegador precisam de execução real no editor Google. Uma pasta `.gs` no Drive não substitui um projeto Apps Script. Este roteiro funciona no navegador e não exige Codex Local nem `clasp`.

Planilhas, IDs, títulos, nonce e permissões reais devem ser obtidos do recibo privado fornecido ao responsável. Não publique esse recibo, propriedades, e-mails de login ou URLs privadas no repositório, Issues, PRs, Actions ou console.

## 1. Criar os dois projetos novos

1. Entre com a conta docente autorizada em [Google Apps Script](https://script.google.com/) e escolha **Novo projeto**. Nomeie `PPI I — Laboratório Vivo 2026.2 — QA — NOVO`.
2. Crie os arquivos `.gs` de `apps-script/` com os mesmos nomes e copie seu conteúdo exato. Inclua `Setup.gs`, `Schema.gs` e todos os módulos. Crie os três arquivos HTML `Index`, `Styles` e `Client`, preservando o conteúdo dos respectivos `.html`.
3. Nas configurações do projeto, habilite a exibição do manifesto `appsscript.json` e substitua-o pelo arquivo desta entrega. Ele usa V8, `America/Fortaleza`, execução pelo implantador e acesso `MYSELF`.
4. Registre o ID real do projeto exibido nas configurações, sem publicá-lo. Não use o ID da planilha como se fosse o do projeto.
5. Crie outro projeto nativo novo, com título inequívoco de **PRODUÇÃO**, e copie somente os arquivos de código. Registre outro Script ID. Cada projeto deve ter suas próprias propriedades, nonce, planilha, logs e implantação. A produção continuará sem estudantes, gravações ou endpoint liberado.

Não altere projetos de Desenvolvimento Web nem scripts vinculados à planilha histórica.

## 2. Configurar propriedades privadas do QA

Em **Configurações do projeto → Propriedades do script**, adicione as quatro chaves de `private-properties.example.json`. Cada valor é uma string; os valores das chaves terminadas em `_JSON` são JSON válido, preenchido somente nas propriedades privadas.

| Chave | Valor exigido |
| --- | --- |
| `PPI_BINDING_JSON` | Objeto com o ID do novo QA, `environment: "QA"`, Script ID real deste projeto, nonce exclusivo do QA e título exato conferido por readback. |
| `PPI_PROTECTED_IDS_JSON` | Lista de pelo menos três IDs distintos: PPI histórica, QA Web e **nova produção**. O destino QA não pode constar dessa lista. |
| `PPI_IDENTITIES_JSON` | Mapeamento do e-mail Google autenticado do responsável para `active: true`, `role: "ADMIN"`, `participant_id: "DOCENTE-QA"` e um pseudônimo. Não use e-mails fictícios como se autenticados fossem. |
| `PPI_WRITES_ENABLED` | String `false` inicialmente. |

O e-mail só fica nas propriedades. A API devolve pseudônimo/código e nunca usa e-mail, papel ou equipe fornecidos pelo navegador como autoridade. `Session.getActiveUser().getEmail()` vazio bloqueia a operação; não há fallback para a identidade do implantador.

Na produção, use `environment: "PRODUCTION"`, o Script ID/nonce/título da nova produção e negue os dois recursos históricos mais o **novo QA**. Não copie propriedades preenchidas de QA para produção.

## 3. Inicialização segura, ainda sem ativação

1. Confira no novo QA os cabeçalhos das 15 abas, `Config.environment = QA`, `schema_version = 1.0.0`, timezone `America/Fortaleza` e localidade **Brasil / `pt_BR`**. Não use outra planilha como contingência.
2. A `Config.spreadsheet_id` precisa estar vazia ou conter o mesmo ID do destino. `Config.binding_nonce` precisa estar vazia ou coincidir exatamente com o nonce privado. Um valor diferente bloqueia a inicialização; não limpe ou sobrescreva para contornar o bloqueio.
3. No editor, selecione `initializeBinding_` e execute. Autorize os escopos solicitados somente após conferir a conta e o projeto novo. A função é privada para `google.script.run` e não é invocada pela interface.
4. O retorno sanitizado deve indicar `initialized: true`, `writes_enabled: false`, `student_access_enabled: false`, `browserRoundTrip: false` e `connected_qa: "NOT_RUN"`. Ela valida ID, título, projeto, ambiente, nonce, denylist, identidade ADMIN, cabeçalhos, timezone e locale antes das gravações. Registra somente um evento de inicialização, sem IDs privados/nonce no retorno.
5. Repetir a inicialização retorna `NO_OP` quando os mesmos valores já estão gravados. Qualquer execução também fecha as flags que estivessem abertas. Não existe acionamento automático, migração, envio de e-mail ou compartilhamento público.

As fórmulas nativas usam nomes de função em inglês e **ponto e vírgula**, conforme a localidade `pt_BR`. O arquivo XLSX usa a gramática invariável do Excel com vírgulas. Não copie uma fórmula XLSX diretamente para `formulaValue` nativo sem a conversão correspondente. O backend rejeita outra localidade.

## 4. Implantar somente o QA privado

1. Selecione **Implantar → Nova implantação → App da Web**. Mantenha **Executar como: eu (implantador)** e **Quem tem acesso: somente eu**. Esse é o modo mediado pelo docente para homologação.
2. Conclua OAuth e copie a URL real terminada em `/exec`. Não use uma URL prevista, `/dev`, um arquivo HTML local ou o resultado de um teste Node como prova de implantação.
3. Abra a URL no navegador com a mesma conta autorizada. `getBootstrap` deve reconhecer o pseudônimo docente, `environment: QA`, as atividades e as flags ainda fechadas. Se retornar `AUTHENTICATION_REQUIRED`, permaneça no modo offline/mediado: não troque para `ANYONE_ANONYMOUS` para “resolver” o problema.
4. Mantenha o endpoint privado fora do GitHub Pages. O portal público só receberá um link operacional depois de segurança, privacidade, identidade e round-trip QA passarem e houver autorização de publicação.

Executar como o usuário que acessa pode exigir permissões desse usuário sobre a planilha; este projeto não concede escrita direta aos estudantes. A eventual ampliação a um domínio institucional exige teste real de identidade e autorização independente. Tokens de estudante não fazem parte desta versão.

## 5. Round-trip sintético obrigatório

Habilite **apenas no projeto QA** `PPI_WRITES_ENABLED = true` e `Config.writes_enabled = true`. Mantenha `student_access_enabled = false`, acesso `MYSELF` e nenhuma identidade estudantil real. Faça a coleta no navegador; uma chamada no editor é apenas um teste de função e não comprova o round-trip da interface.

| Passo | Ação e evidência que devem ser guardadas privadamente |
| --- | --- |
| Catálogo | Na interface docente, aprovar explicitamente a rubrica formativa com referência sintética e ativar `AULA08-FORMATIVA` versão `1.0.0`. Não aprovar plano institucional real nesta homologação. |
| Envio | Preencher conteúdo fictício para `EST-ALFA-01` / Equipe Alfa; usar `on_behalf_of` mediado pelo docente. Enviar pela interface e guardar `submission_id`, `request_id`, hashes, timestamp e ambiente devolvidos pelo servidor. |
| Readback | Conferir a linha em `Submissoes`, dez respostas incluindo reflexão/autoavaliação, `Idempotencia.COMMITTED`, auditoria e progresso somente no QA. |
| Replay | Repetir o mesmo `request_id` e payload; resultado `NO_OP`, sem nova submissão, resposta ou avaliação. Repetir após interrupção conserva o pedido exato e repara somente a transação/derivados necessários. |
| Conflito | Com o mesmo request, alterar um campo; resultado `CONFLICT`, original intacto, evento/linha de conflito sem respostas sensíveis. |
| Correção | Carregar o recibo e registrar revisão individual por critério. Uma decisão `PROPOSTA` ou `EM_REVISAO` não gera nota oficial. Atividade formativa nunca vira N3/N4. |
| Nota em QA | Para testar o fluxo oficial, aprovar sinteticamente rubricas dos seis itens, cadastrar um plano **QA** versionado com referência `SYNTHETIC-QA-ONLY-...`, ativar o item oficial, enviar fixture, propor e aprovar por critério. Conferir os itens e totais da nova QA; jamais usar essa aprovação como confirmação institucional da produção. |
| Isolamento | Conferir que a produção segue vazia, flags fechadas e outro ID. Testar papel de estudante em conta QA autorizada somente se o modo real de autenticação estiver disponível; caso contrário registrar `NOT_RUN`, sem trocar a role recebida no navegador. |
| Encerramento | Fechar `PPI_WRITES_ENABLED`, `Config.writes_enabled` e acesso discente. Restaurar `Config.plan_status = RASCUNHO` e referência vazia quando concluir o ensaio de notas. Preservar recibos sintéticos para auditoria. |

Para os comandos administrativos, use os envelopes de `docs/CONTRATO-API.md` e os métodos em `Administration.gs`. `approvePlan` exige seis versões de atividade/rubrica, critérios aprovados e somas de dez pontos por etapa. Ele registra `plan_items_json`, seis limites `plan_max_PPI1-*` e `plan_approval_request_id`; a marca APROVADO só é materializada após o commit. `revokePlan` fecha o plano e impede que um replay antigo o reative. Referências institucionais reais exigem a decisão humana correspondente.

**Falha parcial:** Sheets não oferece uma transação ACID entre as abas. O ledger é gravado antes dos efeitos, a marca `COMMITTED` vem depois do recibo completo, o evento de sucesso vem após a marca, e progresso/notas são derivados só de registros confirmados. Um erro pode deixar uma operação pendente. Preserve o pedido original e repita-o; não apague ledger, invente outro request ou trate erro de rede como sucesso. Nenhum endpoint HTTP `no-cors` é utilizado.

## 6. Produção: gate separado

Crie/inicialize o projeto nativo de produção com as flags fechadas e sem estudantes. Não implante endpoint de produção nesta etapa. Além de todo o vínculo anterior, o backend só libera escrita de produção quando houver propriedade privada `PPI_PRODUCTION_GATE_JSON` com `approved: true`, o nonce exato, referência da autorização, `connected_qa_pass: true` e `privacy_pass: true`. Estes campos registram decisões/evidências externas: o código não prova que o teste aconteceu. Eles não constam como aprovados no exemplo desta entrega.

O plano da disciplina começa `RASCUNHO`. A aprovação de QA não é reaproveitada. Produção não recebe notas anteriores, N1/N2 fabricadas, médias anuais, logs ou tokens do QA. As fontes antigas ficam exclusivamente em leitura.

## 7. Evidências que faltam antes de declarar implantado

- Dois Script IDs nativos distintos e readback de configuração por ambiente.
- URL `/exec` QA real, com acesso privado e conta autenticada verificada.
- Recibo criado pela interface, linhas QA conferidas e replays/conflito registrados.
- Correção docente, proposta/aprovação sintética e reconciliação de notas/auditoria.
- Testes reais das permissões e do fluxo de estudante, quando a implantação oferecer identidade verificável.
- Autorização separada para qualquer publicação/produção; CI e PR aprovados não substituem esse gate.

## Referências oficiais consultadas

- [Projetos Apps Script](https://developers.google.com/apps-script/guides/projects): um projeto é uma coleção nativa de arquivos de código/HTML e recursos.
- [Scripts independentes](https://developers.google.com/apps-script/guides/standalone): criação por Novo projeto no editor.
- [Web Apps](https://developers.google.com/apps-script/guides/web): implantação, permissões e distinção entre `/dev` e implantação versionada.
- [Manifesto de Web Apps](https://developers.google.com/apps-script/manifest/web-app-api-executable): `MYSELF` restringe a execução ao implantador.
- [Session](https://developers.google.com/apps-script/reference/base/session): identidade ativa pode estar vazia conforme o contexto.
- [Comunicação HTML/servidor](https://developers.google.com/apps-script/guides/html/communication): `google.script.run` e funções privadas terminadas em `_`.
- [LockService](https://developers.google.com/apps-script/reference/lock/lock-service): serialização por projeto.
