# Matriz de autorização e fronteiras de escrita

Esta matriz delimita a preparação PPI-LV-01 e o comportamento do sistema. Uma função implementada não concede autorização para dados reais ou produção.

## Recursos

| Recurso | Ações nesta preparação | Escritas permitidas |
| --- | --- | --- |
| Planilha PPI anterior | Metadados, título, abas e permissões; comparação antes/depois | Nenhuma |
| QA Web de referência | Metadados e padrões de engenharia sem importar registros | Nenhuma |
| Scripts/relatórios Web | Leitura de padrões de segurança e testes | Nenhuma |
| Nova planilha produção PPI | Criar estrutura e catálogo rascunho; readback | Estrutura/configuração sem estudantes, envios ou notas |
| Nova QA PPI | Copiar somente a produção nova saneada; fixtures | Exclusivamente dados fictícios e evidência de QA |
| Projetos Apps Script novos | Criar/preparar código/configuração por ambiente | Apenas quando ferramenta/OAuth disponíveis e alvos comprovados |
| Repositório autorizado | Branch e PR em laboratorio-vivo/ | Código, fixtures sintéticas, contratos, testes e documentação |
| Aulas01–07/outros repositórios | Fora da edição | Nenhuma |
| Produção/Pages ativo | Publicação condicionada a gates e autorização | Não presumida pelo preparo do PR |
| Permissões públicas/e-mails/convites | Fora do mandato | Nenhuma |

Os IDs reais ficam no recibo privado. Uma operação que não resolva alvo unívoco deve retornar `BLOCKED_TARGET_AMBIGUOUS`.

## Papéis de aplicação

| Ação | ESTUDANTE | DOCENTE | ADMIN |
| --- | --- | --- | --- |
| Ver catálogo | Somente ativo, com acesso liberado | Ativo e rascunho | Ativo e rascunho |
| Salvar/enviar | Própria identidade e equipe validadas | Registro mediado para participante validado | Registro mediado |
| Ver respostas/reflexão | Próprias | Escopo docente autorizado | Escopo administrativo autorizado |
| Ver progresso | Própria equipe | Filtro ou todas equipes | Filtro ou todas equipes |
| Corrigir rubrica/submissão | Não | Sim, com versão/revisão conferidas | Sim |
| Criar versão/ativar catálogo | Não | Sim, dentro dos gates | Sim |
| Aprovar plano institucional | Não | Não por esse papel | Sim, com referência explícita |
| Registrar equipe/participante | Não | Sim, sem criar login | Sim, sem criar login |
| Alterar allowlist/binding | Não | Só se também operador autorizado do projeto | Configuração restrita |
| Editar diretamente notas/auditoria | Não | Não pelo fluxo normal | Apenas recuperação autorizada e auditada |

Papel não é aceito do navegador. A allowlist é a autoridade técnica; autorização institucional ainda precisa existir. Revogação e mudança de vínculo são operações administrativas privadas, não campos de formulário discente.
