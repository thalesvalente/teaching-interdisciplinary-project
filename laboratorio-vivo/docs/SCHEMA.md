# SCHEMA — Laboratório Vivo PPI I

Versão do contrato: **1.0.0**. Período: **2026.2**. Fuso de apresentação: **America/Fortaleza**. O plano institucional permanece **RASCUNHO**; a estrutura não regulariza etapas anteriores.

## Autoridade e isolamento

`contracts/sheets-schema.json` contém o dicionário legível por máquina e a ordem exata dos cabeçalhos. `fixtures/workbook-production.json` contém a estrutura inicial sem registros de estudante; `workbook-qa-delta.json` só pode ser aplicado à cópia nova e saneada destinada ao QA. Identificadores privados dos documentos pertencem ao recibo restrito da execução e às Script Properties de cada projeto. Não há ID padrão, planilha ativa implícita nem fallback para fontes antigas.

São mantidas 15 abas: cada uma corresponde a uma entidade, projeção ou controle com ciclo de vida distinto. Unir respostas a submissões repetiria metadados por pergunta; unir rubrica a avaliação misturaria regra e decisão; unir auditoria ao ledger impediria distinguir eventos de deduplicação. As abas de notas e progresso são projeções protegidas, não novas fontes de verdade. A navegação normal ocorre pela interface; o docente não precisa editar as 15 abas.

## Convenções

- Primeira linha: cabeçalhos estáveis; congelamento de uma linha e filtros. Não inserir títulos acima da linha 1.
- `*_id`: identificador de sistema opaco ou código sintético; nunca CPF ou matrícula como chave técnica.
- Datas: texto ISO 8601 emitido no servidor; UI apresenta no fuso do projeto. O relógio do navegador não determina autoria nem ordem.
- `null`/célula vazia significa ausência. Não transformar ausência de avaliação em zero.
- Decisão de avaliação/item: `PROPOSTA`, `EM_REVISAO`, `APROVADA` ou `DEVOLVIDA`. Estado do plano: `RASCUNHO` ou `APROVADO`.
- Booleans são booleanos no contrato e serializados sem ambiguidade na planilha. `Config` usa texto `true`/`false` com `value_type=boolean`.
- Texto de usuário entra como string, com proteção para `=`, `+`, `-`, `@` inclusive após espaços/controles. Fórmulas confiáveis são geradas somente pelo sistema.
- Campos JSON são strings JSON restritas. Não avaliar código, expressões ou fórmulas contidas neles.
- Esquema é versionado; cabeçalho desconhecido, faltante ou fora de ordem bloqueia gravação até reconciliação.

## Tabelas e campos

### 1. Config

Configuração pública não secreta e políticas de ativação.

Chave: `config_key`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `config_key` | string | obrigatório; chave |
| `config_value` | string | Validado segundo operação e catálogo |
| `value_type` | string | string / boolean / integer / json |
| `version` | string | Validado segundo operação e catálogo |
| `approval_status` | string | RASCUNHO / APROVADA |
| `updated_at` | string | date-time |
| `updated_by` | string | Validado segundo operação e catálogo |

### 2. Atividades

Catálogo versionado; nenhuma equivalência implícita de atividade formativa com nota.

Chave: `activity_id + activity_version`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `activity_id` | string | obrigatório; chave |
| `activity_version` | string | obrigatório; chave |
| `lesson_id` | string | Validado segundo operação e catálogo |
| `stage` | integer | 3 / 4; ≥ 0 |
| `track_id` | string | QUILOMBOLA / PERMANENCIA / AMBOS |
| `title` | string | Validado segundo operação e catálogo |
| `kind` | string | FORMATIVA / OFICIAL |
| `official_item_id` | string | Validado segundo operação e catálogo |
| `official_max` | number | ≥ 0 |
| `xp_max` | integer | ≥ 0; ≤ 100 |
| `criteria_version` | string | Validado segundo operação e catálogo |
| `schema_version` | string | Validado segundo operação e catálogo |
| `status` | string | RASCUNHO / ATIVA / ARQUIVADA |
| `questions_json` | string | Validado segundo operação e catálogo |
| `updated_at` | string | date-time |

### 3. Rubricas

Critérios versionados com limites por instrumento e aprovação independente.

Chave: `rubric_id + criteria_version + criterion_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `rubric_id` | string | obrigatório; chave |
| `criteria_version` | string | obrigatório; chave |
| `activity_id` | string | Validado segundo operação e catálogo |
| `criterion_id` | string | obrigatório; chave |
| `label` | string | Validado segundo operação e catálogo |
| `evaluation_type` | string | FORMATIVA / DOCENTE_OFICIAL |
| `max_points` | number | ≥ 0 |
| `weight` | number | ≥ 0 |
| `status` | string | RASCUNHO / APROVADA / ARQUIVADA |
| `approved_by` | string | Validado segundo operação e catálogo |
| `approved_at` | string | date-time |

### 4. Equipes

Equipe de projeto por identificador e pseudônimo.

Chave: `team_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `team_id` | string | obrigatório; chave |
| `display_name` | string | Validado segundo operação e catálogo |
| `track_id` | string | QUILOMBOLA / PERMANENCIA |
| `status` | string | ATIVA / INATIVA |
| `created_at` | string | date-time |

### 5. Participantes

Identificação pedagógica mínima; vínculo de autenticação restrito fora da planilha.

Chave: `participant_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `participant_id` | string | obrigatório; chave |
| `team_id` | string | Validado segundo operação e catálogo |
| `display_name` | string | Validado segundo operação e catálogo |
| `role` | string | ESTUDANTE / DOCENTE / ADMIN |
| `status` | string | ATIVA / INATIVA |
| `authorship_validated` | boolean | Validado segundo operação e catálogo |
| `created_at` | string | date-time |

Referências: `team_id` → `Equipes.team_id`.

### 6. Submissoes

Cabeçalho imutável/versionado de cada envio; estado transacional explícito.

Chave: `submission_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `submission_id` | string | obrigatório; chave |
| `request_id` | string | Validado segundo operação e catálogo |
| `payload_hash` | string | SHA-256 hexadecimal |
| `activity_id` | string | Validado segundo operação e catálogo |
| `activity_version` | string | Validado segundo operação e catálogo |
| `criteria_version` | string | Validado segundo operação e catálogo |
| `team_id` | string | Validado segundo operação e catálogo |
| `participant_id` | string | Validado segundo operação e catálogo |
| `revision` | integer | ≥ 0 |
| `previous_submission_id` | string | Validado segundo operação e catálogo |
| `status` | string | PREPARING / RASCUNHO / ENVIADA / EM_REVISAO / APROVADA / DEVOLVIDA / RECONCILE_REQUIRED |
| `created_at` | string | date-time |
| `updated_at` | string | date-time |
| `formative_xp` | integer | ≥ 0; ≤ 100 |

Referências: `activity_id,activity_version` → `Atividades.activity_id,activity_version`; `team_id` → `Equipes.team_id`; `participant_id` → `Participantes.participant_id`; `previous_submission_id` → `Submissoes.submission_id`.

### 7. Respostas

Uma resposta por pergunta e submissão; valores sempre armazenados como texto.

Chave: `response_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `response_id` | string | obrigatório; chave |
| `submission_id` | string | Validado segundo operação e catálogo |
| `question_id` | string | Validado segundo operação e catálogo |
| `answer_kind` | string | text / json |
| `value` | string | texto protegido contra célula-fórmula |
| `review_status` | string | PENDENTE / EM_REVISAO / APROVADA / DEVOLVIDA |

Referências: `submission_id` → `Submissoes.submission_id`.

### 8. Avaliacoes_Docente

Decisão criterial individual auditável; pontuação não homologada permanece proposta.

Chave: `evaluation_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `evaluation_id` | string | obrigatório; chave |
| `submission_id` | string | Validado segundo operação e catálogo |
| `participant_id` | string | Validado segundo operação e catálogo |
| `criterion_id` | string | Validado segundo operação e catálogo |
| `criteria_version` | string | Validado segundo operação e catálogo |
| `score` | number | ≥ 0 |
| `decision` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `reviewer_id` | string | Validado segundo operação e catálogo |
| `justification` | string | Validado segundo operação e catálogo |
| `revision` | integer | ≥ 0 |
| `created_at` | string | date-time |

Referências: `submission_id` → `Submissoes.submission_id`; `participant_id` → `Participantes.participant_id`.

### 9. Notas_3a_Etapa

Projeção protegida por participante: A=2, B=3, C=5, total até 10 somente após aprovação.

Chave: `participant_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `participant_id` | string | obrigatório; chave |
| `item_a` | number | ≥ 0 |
| `decision_a` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `item_b` | number | ≥ 0 |
| `decision_b` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `item_c` | number | ≥ 0 |
| `decision_c` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `total` | number | ≥ 0; ≤ 10 |
| `plan_version` | string | Validado segundo operação e catálogo |
| `plan_status` | string | RASCUNHO / APROVADO |
| `updated_at` | string | date-time |
| `source_evaluation_ids` | string | Validado segundo operação e catálogo |

### 10. Notas_4a_Etapa

Projeção protegida por participante: A=2, B=4, C=4, total até 10 somente após aprovação.

Chave: `participant_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `participant_id` | string | obrigatório; chave |
| `item_a` | number | ≥ 0 |
| `decision_a` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `item_b` | number | ≥ 0 |
| `decision_b` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `item_c` | number | ≥ 0 |
| `decision_c` | string | PROPOSTA / EM_REVISAO / APROVADA / DEVOLVIDA |
| `total` | number | ≥ 0; ≤ 10 |
| `plan_version` | string | Validado segundo operação e catálogo |
| `plan_status` | string | RASCUNHO / APROVADO |
| `updated_at` | string | date-time |
| `source_evaluation_ids` | string | Validado segundo operação e catálogo |

### 11. Progresso

Projeção privada de participação e pendências; nunca autoridade de notas.

Chave: `progress_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `progress_id` | string | obrigatório; chave |
| `team_id` | string | Validado segundo operação e catálogo |
| `participant_id` | string | Validado segundo operação e catálogo |
| `activity_id` | string | Validado segundo operação e catálogo |
| `activity_version` | string | Validado segundo operação e catálogo |
| `status` | string | Validado segundo operação e catálogo |
| `formative_xp` | integer | ≥ 0; ≤ 100 |
| `pending_count` | integer | ≥ 0 |
| `last_submission_id` | string | Validado segundo operação e catálogo |
| `updated_at` | string | date-time |

### 12. Auditoria

Eventos append-only sem respostas, tokens ou identificadores de login.

Chave: `event_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `event_id` | string | obrigatório; chave |
| `event_at` | string | date-time |
| `actor_id` | string | Validado segundo operação e catálogo |
| `actor_role` | string | Validado segundo operação e catálogo |
| `operation` | string | Validado segundo operação e catálogo |
| `entity_id` | string | Validado segundo operação e catálogo |
| `outcome` | string | Validado segundo operação e catálogo |
| `request_id` | string | Validado segundo operação e catálogo |
| `payload_hash` | string | SHA-256 hexadecimal |
| `detail_code` | string | Validado segundo operação e catálogo |

### 13. Idempotencia

Ledger transacional por ator/operação/request_id, sem compartilhamento entre ambientes.

Chave: `idempotency_key`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `idempotency_key` | string | obrigatório; chave |
| `request_id` | string | Validado segundo operação e catálogo |
| `actor_id` | string | Validado segundo operação e catálogo |
| `operation` | string | Validado segundo operação e catálogo |
| `payload_hash` | string | SHA-256 hexadecimal |
| `state` | string | PREPARING / COMMITTED / RECOVERY_REQUIRED |
| `receipt_json` | string | Validado segundo operação e catálogo |
| `created_at` | string | date-time |
| `updated_at` | string | date-time |

### 14. Conflitos

Registro de reenvio divergente e tratamento humano, sem conteúdo das respostas.

Chave: `conflict_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `conflict_id` | string | obrigatório; chave |
| `request_id` | string | Validado segundo operação e catálogo |
| `actor_id` | string | Validado segundo operação e catálogo |
| `operation` | string | Validado segundo operação e catálogo |
| `expected_hash` | string | SHA-256 hexadecimal |
| `received_hash` | string | SHA-256 hexadecimal |
| `status` | string | ABERTO / EM_ANALISE / RESOLVIDO |
| `created_at` | string | date-time |
| `resolution_code` | string | Validado segundo operação e catálogo |
| `resolved_by` | string | Validado segundo operação e catálogo |
| `resolved_at` | string | date-time |

### 15. Verificacao_QA

Casos e evidências sintéticos; nenhum resultado de teste em produção.

Chave: `case_id`.

| Coluna | Tipo | Domínio/observação |
| --- | --- | --- |
| `case_id` | string | obrigatório; chave |
| `title` | string | Validado segundo operação e catálogo |
| `expected` | string | Validado segundo operação e catálogo |
| `actual` | string | Validado segundo operação e catálogo |
| `status` | string | NOT_RUN / PASS / FAIL / BLOCKED |
| `executed_at` | string | date-time |
| `evidence_ref` | string | Validado segundo operação e catálogo |

## Integridade, versões e projeções

`Submissoes` identifica uma revisão de uma atividade por autor/equipe. Um reenvio usa novo `request_id` e declara `previous_submission_id` quando exigido. Alterar conteúdo com o mesmo request ID é conflito. O par `submission_id + question_id` é único; a assinatura de deduplicação inclui ator, operação e payload canônico.

`Respostas` reserva `__reflection` para reflexão individual e `__self_assessment` para o JSON de autoavaliação. Esses IDs são internos: o navegador não pode enviá-los como perguntas arbitrárias. A reflexão não se perde nas revisões.

Uma avaliação mantém `submission_id`, participante, critério, versão de rubrica e justificativa. A autoria validada é um ato docente distinto do checkbox de autoavaliação. Nenhuma lista de integrantes enviada pelo navegador concede vínculo ou permissão.

As notas têm projeção por participante. `Notas_3a_Etapa`: `item_a=PPI1-3A`, `item_b=PPI1-3B`, `item_c=PPI1-3C`, máximos 2/3/5. `Notas_4a_Etapa`: máximos 2/4/4 para PPI1-4A/B/C. `source_evaluation_ids` vincula a projeção às decisões docentes; alteração exige nova revisão e evento.

## Fórmula protegida de total

O template exato está em `fixtures/workbook-production.json`, chave `formulas`. A fórmula em `H2` e demais linhas preparadas exige todos os seguintes fatos: participante presente; `plan_status=APROVADO` na linha e em Config; versão do plano idêntica à vigente; `plan_approval_ref` com pelo menos oito caracteres; três decisões `APROVADA`; três valores numéricos não negativos e dentro dos limites versionados `plan_max_<ID>` (rascunho inicial 2/3/5 ou 2/4/4); soma até 10. Sem esses fatos, o resultado é **vazio**. Célula de fórmula preparada sem participante não é registro de estudante.

N3 e N4 não usam XP. Não são criadas abas, zeros ou fórmulas para N1/N2, MP, MF ou situação anual. A política de recuperação do plano rascunho não é executada automaticamente.

## Chaves Config

| Chave | Inicialização | Regra |
| --- | --- | --- |
| schema_version | 1.0.0 | Deve ser suportada pelo código |
| environment | PRODUCTION / QA | Exato, por recurso |
| spreadsheet_id | Vazio até readback | Deve coincidir com Properties e ID aberto |
| binding_nonce | Vazio até vinculação | Marcador de vínculo; não é credencial |
| period | 2026.2 | Sem inferir calendários anteriores |
| timezone | America/Fortaleza | Deve coincidir com manifesto |
| writes_enabled | false | Ativar apenas em gate autorizado |
| plan_version | PLANO-RASCUNHO-1.0.0 | Versões antigas permanecem históricas |
| plan_status | RASCUNHO | Aprovação institucional não é presumida |
| plan_approval_ref | Vazio | Referência administrativa exigida para notas |
| student_access_enabled | false | Liberação após identidade/privacidade/QA |
| retention_days | 90 | Proposta técnica, não autorização de descarte |
| plan_max_PPI1-3A/B/C | 2 / 3 / 5 | Limites do plano rascunho, versionados |
| plan_max_PPI1-4A/B/C | 2 / 4 / 4 | Limites do plano rascunho, versionados |
| plan_items_json | Seis vínculos em rascunho | Array de activity_id, activity_version, criteria_version, official_max |

São **19 linhas de configuração** iniciais: 12 chaves operacionais, seis máximos e um conjunto de vínculos. As fórmulas consultam `Config!A2:B1000`; os limites iniciais não são constantes ocultas na fórmula. As notas permanecem bloqueadas por `plan_status=RASCUNHO`.

## Evolução

Adicionar coluna ou alterar enum exige nova versão, plano de compatibilidade, validação numa cópia QA e conferência de headers antes/depois. Não reutilizar script de migração de outra disciplina. Alterar rubricas/limites institucionais gera nova versão e aprovação; reprocessar registros históricos é outra ação autorizada e auditável.

## Fontes e limites

O plano de ensino PPI I 2026.2 fornecido pelo usuário sustenta itens e pesos, ainda em rascunho. A normalização e os limites operacionais são decisões de projeto. O dicionário não demonstra conformidade institucional, LGPD ou WCAG por si só.
