# Manual docente — Laboratório Vivo PPI I

## O que já pode ser preparado

O laboratório organiza roteiro, evidência, requisito, reflexão e devolutiva por atividade. O catálogo contém a Aula 08 formativa e os seis itens do plano como **rascunhos**. A planilha de produção começa sem equipes, estudantes, submissões ou notas. Consulte o recibo da entrega para os IDs realmente criados e os gates efetivamente executados. Código preparado não significa Web App implantado.

## 1. Homologar sem estudantes reais

1. Usar somente a planilha QA copiada da nova produção saneada e seu projeto Apps Script exclusivo. Conferir ID, título, ambiente, nonce, schema e permissões.
2. Vincular Properties exclusivamente ao QA. Cadastrar na allowlist privada apenas contas operadoras autorizadas, mapeadas a códigos fictícios. Os nomes Alfa/Beta na planilha não concedem login.
3. Conferir que produção continua `writes_enabled=false` e `student_access_enabled=false`. A autorização de teste não se transfere à produção.
4. Aprovar/ativar apenas a versão sintética de atividade/rubrica necessária ao teste. Executar submit, replay NO_OP, payload alterado CONFLICT, acesso cruzado negado e revisão docente.
5. Conferir recibo, linha, respostas, ledger, progresso e auditoria por readback. Um teste Node/mock ou chamada interna não substitui abrir e enviar pelo Web App real.
6. Se não houver identidade verificável/OAuth/deploy, registrar o passo NOT_RUN e manter contingência offline. O handoff exato está em `deploy/README.md`.

## 2. Preparar atividades

Cada atividade declara aula, etapa, trilha, versão de conteúdo, versão de critérios e formato. Uma vez vinculada a submissões, não alterar a versão existente: criar uma nova. A ativação depende de rubrica aprovada, schema consistente e permissão docente/admin. Atividade formativa não deve receber um código de nota oficial apenas por abordar o mesmo assunto.

Roteiro recomendado: problema/contexto → evidência autorizada ou fictícia → hipótese → RF/RNF/dados → critérios de aceitação → rastreabilidade → reflexão individual. Apresente exemplos, limites de uso de IA e critério de autoria antes de abrir o envio.

## 3. Cadastrar vínculos e validar autoria

Usar identificador mínimo e pseudônimo apropriado. Confirmar equipe/trilha e o vínculo com a identidade autenticada em configuração restrita. `authorship_validated` representa conferência docente; checkbox de aluno não o altera. Não registrar CPF, dados de vulnerabilidade, diagnósticos ou informações de outros componentes. Os mecanismos e a política de dados reais precisam estar autorizados antes de cadastrar estudantes.

Se a implantação não puder verificar a identidade de um aluno, registrar atividade offline e mediar o lançamento sob sua conta autorizada (`on_behalf_of`), após conferir autoria e escopo. Nunca solicitar permissão de edição da planilha como alternativa.

## 4. Acompanhar e corrigir

Abrir o progresso por equipe/atividade, localizar pendências e consultar o recibo/submissão. Ler evidência, hipótese e critérios; verificar limites e eventual IA. Para a decisão, conferir participante, versão da rubrica e `review_revision` atual. A primeira revisão usa `expected_revision=0`; correções posteriores partem do valor efetivamente lido.

- **PROPOSTA:** valores/feedback em preparação, sem nota oficial.
- **EM_REVISAO:** análise ainda aberta.
- **DEVOLVIDA:** explicar precisamente o que revisar; aluno reenvia nova revisão.
- **APROVADA:** decisão registrada por profissional autorizado; pode projetar nota apenas se todos os gates institucionais e critérios oficiais estiverem satisfeitos.

O laboratório fornece XP de autoavaliação para feedback. XP100 não é nota10. Avaliar a explicação individual, a qualidade e a verificabilidade do trabalho, não só o preenchimento.

## 5. Plano e notas

Referência rascunho: N3=2+3+5 e N4=2+4+4. Aprovação administrativa do plano exige referência institucional, versão e associação aos seis itens/rubricas. Alteração de pesos gera versão nova, mantém soma10 por etapa e precisa de nova homologação.

O total fica vazio se faltar item, decisão aprovada, versão válida ou aprovação do plano. N1/N2 não são criadas nem inferidas. Não usar este quadro para fechar média anual ou resultado final enquanto pendências institucionais não forem resolvidas.

## 6. Erros, reenvios e exportação

Sem recibo confirmado, verificar conexão e reenviar **o mesmo request ID e conteúdo**. Se surgir CONFLICT, não sobrescrever: conferir o recibo original e abrir nova revisão quando a mudança for intencional. Em falha parcial, bloquear novas operações relacionadas e reconciliar ledger/linhas antes de concluir que houve sucesso.

Exportar JSON/CSV apenas no escopo autorizado; tratar o arquivo como privado. Imprimir/PDF serve para roteiro ou documentação do recibo, mantendo rótulo claro de rascunho/envio. O botão de exportação não oficializa avaliação.

## 7. Critério para abrir produção

Requer QA conectada real, identidade e autorização comprovadas, privacidade e retenção aprovadas, recursos distintos, CI/QA independente, plano de reversão e autorização de produção. Ativação deve corresponder ao código e à configuração conferidos. Sem esses fatos, publicar apenas orientação e modo offline.
