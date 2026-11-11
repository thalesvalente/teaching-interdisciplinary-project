# Contrato de API — Laboratório Vivo PPI I

Versão: **1.0.0**. Transporte transacional: **HtmlService + google.script.run**. O portal GitHub Pages não possui autoridade de gravação nem faz fetch/no-cors para o Apps Script.

## Identidade e contexto

O servidor resolve papel, participante e equipe pela sessão autenticada e por allowlist privada. E-mail, papel, equipe, nota ou carimbo de data enviados pelo navegador não são autoridade. Quando a identidade ativa está vazia, a API retorna `AUTHENTICATION_REQUIRED`; não substitui pelo usuário efetivo/proprietário do script.

Toda operação verifica o vínculo ambiente/projeto/planilha, o esquema e as permissões. O cliente não seleciona spreadsheet ID nem ambiente. Estudante acessa os próprios envios e progresso autorizado; docente/admin precisa constar na allowlist. A ausência de erro JavaScript ou uma tela preenchida não prova que houve gravação.

## Envelope de escrita

```json
{
  "schema_version": "1.0.0",
  "request_id": "pedido-unico-0001",
  "payload": {
    "lesson_id": "AULA08",
    "activity_id": "AULA08-FORMATIVA",
    "activity_version": "1.0.0",
    "track_id": "QUILOMBOLA",
    "criteria_version": "FORM-1.0.0",
    "answers": [{"question_id":"q_problema","answer_kind":"text","value":"Cenário fictício de exemplo"}],
    "reflection": "Reflexão de exemplo; rascunho incompleto.",
    "self_assessment": {"understood":false,"evidence_checked":false,"authorship_declared":false}
  }
}
```

Esse exemplo é estrutural e incompleto para submissão: a atividade exige as oito perguntas do catálogo. `saveDraft` admite campos de resposta não concluídos; `submitActivity` valida as perguntas obrigatórias e a reflexão.

`request_id` possui 8–128 caracteres alfanuméricos ou `_.:-`, iniciando por alfanumérico. O payload canônico é limitado a 60.000 bytes UTF-8, cada resposta a 4.000 caracteres e a reflexão a 3.000. O catálogo aceita no máximo 32 perguntas; a Aula 08 provisória usa oito. Tipos não previstos, chaves reservadas, controles inválidos, Unicode malformado e números não finitos são rejeitados.

`previous_submission_id` é exigido quando existe revisão anterior da mesma atividade/versão para o participante. `on_behalf_of` só pode ser usado por docente/admin para registro mediado de participante previamente validado; não concede autoridade ao aluno.

## Hashes e importação

O JSON é serializado recursivamente com chaves de objetos ordenadas; arrays preservam ordem; strings Unicode não são normalizadas silenciosamente. Dois hashes cumprem papéis distintos:

| Hash | Conteúdo | Uso |
| --- | --- | --- |
| `payload_hash` do arquivo | SHA-256 de `canonical(payload)` | Detectar alteração no transporte/importação |
| `payload_hash` no ledger | SHA-256 de `canonical({operation,actor_id,payload})` | Vincular replay ao ator e à operação autorizados |

O hash não autentica quem escreveu um arquivo. A importação offline valida versão, tamanho, estrutura e hash antes de preparar o envio. A API recalcula o hash; nunca aceita papel/equipe com base em um arquivo. A gravação ainda exige sessão autorizada e catálogo ativo.

`fixtures/submission-alfa.json` é um exemplo sintético com hash verificável, não um recibo de servidor. O contrato `ppi-aula08-v1.schema.json` é **PROVISÓRIO**, pois o arquivo correspondente não foi encontrado na main inspecionada. Não declara merge ou integração ativa da Aula 08.

## Operações obrigatórias

| Operação | Entrada | Resposta `data` | Autorização |
| --- | --- | --- | --- |
| `getBootstrap()` | Nenhuma | Versão, ambiente, fuso, flags, plano, viewer, activities, capabilities | Sessão permitida; sem IDs privados |
| `getActivityCatalog()` | Nenhuma | `{activities:[...]}` | Aluno recebe apenas atividades ativas |
| `saveDraft(envelope)` | Payload da atividade | Recibo versionado de rascunho | Autor válido ou mediação docente |
| `submitActivity(envelope)` | Payload completo | Recibo de envio com ID e hora servidor | Autor válido ou mediação docente |
| `getReceipt({submission_id})` | ID do recibo | Metadata, respostas, reflexão, autoavaliação e revisão de correção | Autor individual ou docente autorizado |
| `getTeamProgress({team_id?})` | Filtro opcional | `{team_id,items,total_formative_xp}` | Aluno só própria equipe; docente pode todas |
| `reviewSubmission(envelope)` | Payload de revisão abaixo | Decisão e revisão geradas pelo servidor | Docente/admin |
| `exportReport({format,team_id?})` | `JSON` ou `CSV` | `{filename,mime_type,content}` | Escopo filtrado pelo servidor |

Exportações operacionais contêm progresso formativo e metadados no escopo autorizado, com `official_grade:false`. O CSV desta versão não inclui notas nem respostas privadas. PDF do roteiro/recibo é produzido pela impressão da interface; o rascunho impresso é identificado como tal.

### Revisão docente

```json
{
  "schema_version":"1.0.0",
  "request_id":"revisao-exemplo-0001",
  "payload":{
    "submission_id":"sub-exemplo",
    "participant_id":"EST-ALFA-01",
    "decision":"PROPOSTA",
    "criteria_version":"FORM-1.0.0",
    "scores":[
      {"criterion_id":"understood","score":20},
      {"criterion_id":"evidence_checked","score":30},
      {"criterion_id":"authorship_declared","score":20}
    ],
    "justification":"Exemplo fictício de feedback; sem nota oficial.",
    "expected_revision":0
  }
}
```

`expected_revision=0` identifica ausência de revisão anterior. Nova decisão deve informar a revisão efetivamente lida; concorrência desatualizada não sobrescreve revisão docente. Cada valor fica entre zero e o máximo do critério vigente. A aprovação da atividade formativa não gera item oficial.

### Aprovação administrativa do plano

`approvePlan(envelope)` é operação de administração, não de aluno. Seu payload contém `plan_version`, `approval_ref` e `items:[{activity_id,activity_version,criteria_version}]` para os seis itens oficiais. O servidor valida versões, rubricas, limites e soma 10 por etapa. A referência administrativa é um registro humano; o script não verifica a validade jurídica/institucional do documento. O ledger só permite projetar um plano aprovado após conclusão da operação.

## Operações administrativas de catálogo e cadastro

Todas usam o mesmo envelope de escrita, lock, idempotência e verificação de papel. Não são executadas automaticamente ao abrir a página.

| Função | Payload | Papel |
| --- | --- | --- |
| `saveActivityVersion` | `{activity,rubric,change_reason}`; activity contém metadados e questions; rubric contém criterion_id/label/max_points | DOCENTE ou ADMIN |
| `approveRubric` | `{activity_id,activity_version,criteria_version,approval_ref}` | DOCENTE ou ADMIN |
| `activateActivity` | `{activity_id,activity_version,status:"ATIVA"|"ARQUIVADA"}` | DOCENTE ou ADMIN |
| `approvePlan` | `{plan_version,approval_ref,items}` | ADMIN |
| `revokePlan` | `{reason,plan_version}` | ADMIN |
| `registerTeam` | `{team_id,display_name,track_id}` | DOCENTE ou ADMIN |
| `registerParticipant` | `{participant_id,team_id,display_name,authorship_validated}` | DOCENTE ou ADMIN |

Versão existente não é sobrescrita. Ativar um item OFICIAL exige plano aprovado e rubrica da versão correspondente; formativa exige rubrica aprovada, sem associação automática a nota. `registerParticipant` não cria conta Google/login: o mapeamento de autenticação ainda precisa ser autorizado em Properties. A lista exata de campos administrativos está em `apps-script/Administration.gs`; a interface administrativa pode ser mediada pelo operador, sem liberar edição direta a alunos.

## Respostas e estados

Sucesso: `{ok:true,code:"OK"|"CREATED"|"NO_OP",data:{...}}`. Falha: `{ok:false,code:"CODIGO",error:{message:"Texto seguro"}}`. Sem stack, credenciais, identificação de login, IDs de documentos privados ou respostas educacionais nos erros.

| Caso | Resultado esperado | Efeito |
| --- | --- | --- |
| Request novo válido | CREATED / OK | Uma transação e recibo |
| Mesmo request/ator/operação/payload | NO_OP | Recibo original preservado; sem nova submissão |
| Mesmo request com payload alterado | CONFLICT | Registro de conflito; envio anterior preservado |
| Versão de atividade/rubrica diferente | VERSION_MISMATCH | Nenhuma submissão aceita |
| Arquivo alterado | PAYLOAD_HASH_MISMATCH | Importação recusada |
| Identidade indisponível | AUTHENTICATION_REQUIRED | Sem acesso transacional |
| Grupo/registro alheio | FORBIDDEN / NOT_FOUND_OR_FORBIDDEN | Sem exposição de conteúdo |
| Configuração/ID/ambiente ambíguo | BLOCKED_TARGET_AMBIGUOUS | Sem gravação |
| Flags desligadas | WRITES_DISABLED / STUDENT_ACCESS_DISABLED | Contingência offline |
| Falha parcial | Estado de reconciliação explícito | Sem recibo de sucesso inventado |

Helpers internos terminam em `_` e não compõem API de navegador. Isso não substitui autorização nas funções públicas. Toda escrita serializa pelo lock do projeto. Falha de rede com resultado desconhecido deve reenviar o mesmo request/payload; não criar outro ID apenas porque a confirmação demorou.

## Compatibilidade e verificação

JSON Schema documenta estrutura; testes do servidor verificam permissões, regras relacionais, idempotência e limites em bytes. Os cenários de mock não provam OAuth, identidade real, quotas, proteção nativa de planilha ou round-trip Web App. Essas propriedades pertencem ao gate F5.

Fontes: [Google — google.script.run](https://developers.google.com/apps-script/guides/html/communication), [Google — Session](https://developers.google.com/apps-script/reference/base/session), [Google — LockService](https://developers.google.com/apps-script/reference/lock/lock-service).
