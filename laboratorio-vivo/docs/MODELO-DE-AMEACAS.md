# Modelo de ameaças e controles

## Ativos, atores e fronteiras

Ativos: identidade mínima de participante, vínculos, respostas e reflexões, avaliação docente, projeções de notas, versões do catálogo, recibos, propriedades privadas e trilha de auditoria. Atores autorizados: estudante autenticado no próprio escopo; docente revisor; administrador designado; operador de homologação com dados fictícios. O proprietário de uma planilha é tecnicamente privilegiado e exige governança institucional.

Fronteiras: navegador → Apps Script; sessão Google → allowlist; Apps Script → planilha vinculada; homologação → produção; artefato offline → importação; repositório público → configuração privada. Texto externo e respostas de estudante são dados, não comandos nem autorização.

## Matriz de ameaças

| ID | Ameaça | Controle de implementação/procedimento | Evidência de aceite e risco residual |
| --- | --- | --- | --- |
| T01 | Gravar na planilha antiga/Web por ID errado | Vínculo explícito Properties + ID real + Config + nonce; denylist privada das fontes e outro ambiente; sem fallback | Testar IDs divergentes; operador ainda pode configurar recursos errados, por isso readback independente é obrigatório |
| T02 | Browser forja papel, e-mail ou equipe | Identidade ativa verificável; allowlist privada; vínculo/atividade checados servidor | Negativos de escalada e acesso cruzado; OAuth real só comprovado no F5 |
| T03 | Identidade ativa vazia vira dono do script | Falha fechada; não usar effectiveUser como identidade do visitante | Simular sessão vazia e testar navegador real; uso mediado quando necessário |
| T04 | Reenvio/rede produz duplicação | request_id por ator/operação + hash canônico + recibo estável | Replay idêntico NO_OP; mudança CONFLICT; lock protege corrida no mesmo projeto |
| T05 | Falha entre gravações de abas | Estado PREPARING, ledger e reconciliação; projeções só de transações elegíveis | Injetar falha por etapa; mocks não comprovam atomicidade do Google Sheets |
| T06 | Fórmula/CSV injection | Conteúdo tratado como string; prefixos e controles neutralizados; CSV com aspas/escape | Testar =,+,-,@, espaço, tab e Unicode; fórmulas confiáveis seguem via própria |
| T07 | HTML/script armazenado | Renderização por textContent/elementos seguros; não executar HTML do usuário | Testar tags/eventos e texto literal; nenhuma confiança em conteúdo importado |
| T08 | Hash tratado como prova de autoria | Hash só integridade; autenticação e validação docente separadas | Arquivo com hash válido sem sessão continua recusado |
| T09 | XP vira nota oficial | Campos e rubricas separados; formativa sem official_item; total exige plano e decisões aprovados | Testes XP100 sem efeito N3/N4; zero não substitui ausente |
| T10 | Revisor sobrescreve decisão concorrente | expected_revision e nova revisão auditável | Revisão antiga recusada; docente precisa reler antes de corrigir |
| T11 | Logs públicos vazam dados educacionais | Eventos minimizados: código, ator pseudônimo, ID/hashes; não respostas/segredos | Inspecionar erros, exports, CI/PR; logs são privados mesmo quando pseudonimizados |
| T12 | QA compartilha backend ou dados com produção | Dois IDs e dois projetos/properties; cópia apenas da nova estrutura saneada | Conferir todos IDs distintos; compare manifesto de vínculos |
| T13 | Dados pessoais sensíveis em exercícios | Cenários fictícios e instruções explícitas; identificação mínima; revisão docente | Não coletar CPF, diagnóstico, narrativa comunitária não autorizada ou dados de evasão identificáveis |
| T14 | Atividade/rubrica alterada invalida recibos | Versões imutáveis e catálogo aprovado antes de ativar | Divergência de versão falha; mudança administrativa gera versão nova |
| T15 | Operação administrativa chamada diretamente | Cada função pública aplica papel; helpers privados não substituem ACL | Testar aluno chamando review/activate/approvePlan/export amplo |
| T16 | Recurso excessivo/exaustão | Limites de bytes, perguntas, comprimento, linhas e exportação; lock com prazo | Falha explícita, sem truncamento silencioso; quotas reais exigem observar ambiente |

## Autenticação escolhida

A versão inicial usa sessão autenticada e allowlist, sem tokens de fallback. [Session](https://developers.google.com/apps-script/reference/base/session) documenta que o e-mail ativo pode ser vazio e que o usuário efetivo pode ser o implantador. O acesso só é habilitado depois de provar a identidade na configuração real. Se não for possível para os estudantes, manter gravação bloqueada e usar registro mediado pelo docente; não conceder escrita direta na planilha.

## Serialização e limites de transação

[LockService](https://developers.google.com/apps-script/reference/lock/lock-service) fornece lock por script; ele não transforma múltiplas abas em banco transacional. Usar projeto único por backend, registrar estado de progresso e recuperar/reconciliar falhas. Uma segunda aplicação escrevendo diretamente nas mesmas abas escaparia desse lock e não é permitida pelo desenho.

## Configuração privada

Script Properties contêm vínculo, allowlist e gates. Segredos não vão para HTML, repositório, exports ou logs. Config de planilha não armazena tokens. Cada ambiente usa namespace/projeto próprio; copiar código não significa copiar propriedades ou credenciais. IDs privados são divulgados somente ao responsável no recibo restrito.

## Gates de segurança

Antes de estudantes: ID e permissões nativas readback; ausência de edição direta discente; identidade real provada; teste de isolamento de equipes; replay/conflito; recuperação de falha; política institucional de acesso/retenção; controle de divulgação; round-trip sintético QA; autorização de produção vinculada ao conjunto de código/configuração verificado. Falhar em qualquer gate mantém produção fechada.

Este documento é análise de ameaças e desenho de controles. Não constitui declaração de conformidade legal ou avaliação de impacto institucional aprovada.
