# Contrato PPI Aula 08 v1

`ppi-aula08-v1.schema.json` usa JSON Schema 2020-12. Os quatro exemplos em `examples/` cobrem rascunhos vazios e preenchidos, nas duas trilhas. Os preenchidos têm 100 XP de treino, catálogo com fontes sintéticas e avaliação docente pendente. O modelo e a suíte também validam exportações com respostas e catálogo preenchido.

## Fronteiras

| Campo / domínio | Significado | Não representa |
| --- | --- | --- |
| `training` / `xp_formativo` | Acertos atuais das seis missões de treino | Nota curricular, aprovação ou domínio individual |
| `completeness` | Presença dos nove campos de texto do catálogo | Correção semântica ou validade da fonte |
| `teacher_assessment` | Revisão qualitativa docente pendente | Assinatura ou aprovação docente |
| `official_grade` | `not_applicable`, valor `null` | PPI1-3B ou qualquer nota oficial |

Metadados versionados incluem aula, atividade, trilha, pergunta, tipo de resposta, estado do rascunho, rubrica/gabarito e datas. `question_id` é `null` no envelope e identifica cada resposta objetiva em `training.answers`. `submission_id` é opcional e não é criado pela apresentação. Não existem campos compulsórios de identificação pessoal, endpoint, segredo ou submissão automática.

`self_reviewed` significa apenas que os nove textos estão presentes e os quatro itens de autoavaliação foram declarados. Uma edição do catálogo invalida essa declaração local até nova revisão. Uma hipótese pendente pode ser registrada de forma legítima sem simular confirmação.

## Responsabilidade de um consumidor futuro

A validação pelo schema é estrutural. Um futuro Laboratório Vivo deve também conferir os IDs e versões contra `content.js`, a consistência entre trilha do envelope e das respostas, unicidade de perguntas/requisitos, datas em ordem, associações entre missão/pergunta/alternativa e recalcular os XP com o gabarito da versão. Não confiar em `correct`, em somas de XP ou em rótulos de revisão fornecidos por um cliente. Esses valores exportados descrevem o rascunho e não constituem atestação.

O modelo atual valida estritamente a persistência local, rejeita propriedades desconhecidas/perigosas, tipos inválidos, IDs não previstos e versões desconhecidas antes de restaurar. A aula não importa envelopes externos. Uma integração que acrescente importação deve implementar validação completa antes de substituir dados e manter o consentimento explícito para exportar/submeter.

## Verificar

`npm run test:aula08:unit` usa Ajv2020 e ajv-formats somente em desenvolvimento. A aplicação estática não carrega validadores, schemas ou serviços externos em runtime. Os links `$schema` e `$id` identificam o contrato e não geram requests na aula.
