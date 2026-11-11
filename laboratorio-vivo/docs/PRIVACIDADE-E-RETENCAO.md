# Política técnica de acesso, privacidade e retenção

**Estado: PROPOSTA para validação institucional.** Nenhum dado real de estudante é autorizado por esta entrega. A política operacional a seguir serve à preparação e ao ensaio com dados sintéticos.

## Minimização por conjunto

| Conjunto | Dados estritamente necessários | Quem acessa | Regra de divulgação |
| --- | --- | --- | --- |
| Catálogo e rubricas rascunho | IDs, versões, roteiro e critérios | Docente; alunos após ativação | Pode ser público sem dados pessoais |
| Equipes/participantes | Código, pseudônimo, vínculo, estado e validação de autoria | Docente; aluno no próprio escopo | Planilha privada; nenhuma lista em GitHub |
| Mapeamento de autenticação | Login permitido → código/papel | Administrador em Properties | Nunca ao navegador/CSV/log |
| Respostas/reflexões | Conteúdo pedagógico autorizado e minimizado | Autor e docente | Não integrar relatório público |
| Avaliações/notas | Critério, valor, justificativa, revisor e versão | Participante autorizado/docente | Não expor ao grupo nem publicar |
| Progresso de equipe | Estado de atividade e pendências autorizadas | Equipe/docente | Sem respostas/reflexões individuais alheias |
| Auditoria/ledger | IDs técnicos, operação, código, hash e datas | Docente/admin | Privados; não incluir conteúdo de respostas |
| Evidências QA | Cenários e pseudônimos inventados | Operadores de QA | Publicar apenas resultados sem IDs/credenciais privadas |

Pseudônimo não garante anonimato quando existe mapa de identidade. Não inserir CPF, telefone, diagnóstico, vulnerabilidade, dados identificáveis de evasão, localização sensível de comunidade ou narrativa não autorizada. O eixo temático não justifica coletar esses dados.

## Retenção proposta

`retention_days=90` é proposta técnica para registros operacionais/sintéticos e exige aprovação antes de orientar dados reais. A instituição deve definir prazos por finalidade, obrigações de guarda, recursos de avaliação e calendário; não apagar notas ou evidências oficiais com base nessa configuração. Esta versão não instala gatilhos automáticos de exclusão.

Antes de descarte autorizado: identificar conjunto/período exatos; separar guarda obrigatória; registrar decisão e responsável; validar exportação privada quando necessária; executar por lote controlado; conferir ausência dos dados no escopo previsto; guardar apenas recibo mínimo de operação. Alteração de retenção é versionada e não retroage silenciosamente.

## Acesso e correções

O responsável institucional define administradores/revisores e fluxo para solicitações de acesso, correção e contestação. O docente informa pendências e mantém revisão anterior rastreável; correção não significa sobrescrever silenciosamente evidência. Revogação na allowlist bloqueia novas chamadas. Contas desativadas não mantêm acesso por um papel enviado pelo navegador.

## Compartilhamento

Produção e QA permanecem privados. Não compartilhar planilhas com estudantes como editores. Não enviar convites, e-mails ou criar links públicos nesta preparação. Exports privados são feitos somente por usuário autorizado e precisam continuar protegidos depois do download. Dados reais não entram em Issues, PRs, Actions, screenshots públicas ou fixtures.

## Decisão institucional pendente

Antes de ativar o uso real, formalizar finalidade, responsáveis, adequação do mecanismo de autenticação ao público, regras para menores, canais de atendimento e retenção. A referência à LGPD no mandato é tratada como requisito de governança e minimização; a implementação técnica não substitui essa decisão institucional.
