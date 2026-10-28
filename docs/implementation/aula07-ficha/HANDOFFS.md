# Handoffs reais e fechamento da integração

Missão `PPI-A07-FICHA-AVALIATIVA-IMPLEMENT-MA-01`. Repositório `thalesvalente/teaching-interdisciplinary-project`. Destino `feat/aula07-ficha-avaliativa-20261027`. A [PR #6](https://github.com/thalesvalente/teaching-interdisciplinary-project/pull/6) concentra a identidade final e a verificação dos checks do HEAD entregue. Este registro não atribui aprovação ao professor ou ao usuário.

## Participantes e entregas

O manifesto foi commitado antes das edições de produto. Os três agentes receberam ownership exclusivo e trabalharam em paralelo em worktrees separadas. O QA leu a implementação em snapshots congelados; reparos foram feitos pelo implementador e integrados pelo coordenador. Nenhum agente editou simultaneamente o checkout de outro.

| Frente | Branch / worktree | Entrega | SHA local final | SHA remoto equivalente | Árvore idêntica |
| --- | --- | --- | --- | --- | --- |
| Pedagogia | `work/aula07-ficha-pedagogia` / `ppi-pedagogia` | Contrato, 33 critérios, 22 obrigações rastreadas, 14 riscos e revisão pedagógica independente | `4bad646be02ec3835ea74713abe58f5e1c17d174` | `e17edd1b3235c35d95425807ffd41ad6fc191e4f` | `359892fdfe0ce9758d98d9f812a1e0d429b00933` |
| Implementação | `work/aula07-ficha-implementacao` / `ppi-implementacao` | Ficha completa, duas trilhas, schema, rubrica, persistência, exportação e papel sem JavaScript | `2778438a02e1c5060369193e994e689e82feb30c` | `e909a8fc945f81914e463a51dd1cf3250c0fc23b` | `fdfa48849ece1b79226c04d09d232107e01e5bf2` |
| QA independente | `work/aula07-ficha-qa` / `ppi-qa` | Testes, relatório, findings revalidados, capturas e quatro PDFs reais | `9328a74b63acf7de9fc6f2db12c63a72028217de` | `ad8cbb0b68ad9f15c6f13f13730781913db27cf5` | `0e7f3bbc428f6afd938a1f31fa0abc08f30faabf` |
| Coordenação, checkpoint após integração do QA | `feat/aula07-ficha-avaliativa-20261027` / `ppi-repo` | Portal, CI, regressão, integração de todos os handoffs e evidências | `92941ef81d987de23c6d70a918cb265d233bf20c` | `26f851f34e5e119736b856098e43a62ef1e2931d` | `33e57ee5571d841b61f8409acea42c1e904b5e8b` |

As árvores de cada frente incluem sua própria base e seus arquivos exclusivos; elas não são a árvore integrada. A integração foi realizada com cherry-picks, conservando os commits originais em suas branches. O ownership e o ajuste pontual da fixture legada estão detalhados no [manifesto](EXECUTION_MANIFEST.md).

## Identidade do código verificado

| Evidência | SHA local | SHA remoto de árvore idêntica | Resultado real |
| --- | --- | --- | --- |
| Corrida independente completa | `3a797a4e2abb6de9750dd121943ca609157d99fb` | `b53a7ac5b05f18d8228bf28271bf395bb8187c08` | 45 unitários; 61 grupos de navegador (21 Chromium, 20 Firefox, 20 WebKit); quatro PDFs aprovados |
| Último reparo isolado e regressão de armazenamento | `92a37c225a1cece0961544220bd7269b7345f8b5` | `fa451aa0ecbc111d6a4befaf251dc68be3649987` | 45 unitários repetidos e teste focal nos três motores, todos PASS |
| HEAD final após documentos | Identificado na PR #6 | Identificado na PR #6 | Suíte completa atual executada pelo GitHub Actions; resultado e links no corpo da PR |

O último reparo retirou somente a gravação redundante no evento `pagehide`, que podia sobrescrever um rascunho rejeitado ao recarregar sem editar. O teste focal falhou antes do reparo e passou nos três motores após ele. A subárvore final do produto é `a76418b010492f503d1f51dbbab95a776b50e520`. Os módulos de modelo, rubrica, conteúdo, exportação, armazenamento e impressão permaneceram idênticos à corrida completa. A atribuição exata, os hashes e os limites estão no [relatório independente](../../reviews/aula07-ficha/QA.md).

## Transporte e integridade

O ambiente de shell permitiu clone/fetch, mas não possuía credencial para push. O coordenador utilizou o conector GitHub autenticado para criar blobs, árvores e commits, sem extrair tokens ou alterar configuração de autenticação. Antes de criar cada commit remoto, comparou a árvore retornada pela API com a árvore local e exigiu igualdade exata. Blobs binários também tiveram seus hashes conferidos. As referências foram atualizadas com o SHA anterior esperado, sem force push.

Os hashes dos commits mudaram porque o conector escreve seus próprios metadados; isso está explicitado em [COMMIT_MAP.json](COMMIT_MAP.json), com 40 correspondências até a integração da atualização concorrente de `main`. O commit que contém o próprio mapa é excluído dele para evitar autorreferência. Sua correspondência local/remota e árvore final são verificadas na PR. As branches dos três agentes foram preservadas remotamente.

### Preservação da atualização concorrente dos slides

Os cinco checks da candidata `8da607ebdf16abddfa1222ff3156a1dd2a07d4d5` terminaram com sucesso, e a PR foi marcada pronta para revisão. A conferência final detectou então um novo commit de outra operação em `main`: `afa73357ce0893bf4342b139dc1b8e90ace0fb1f`, sobre os controles acessíveis dos slides 12 e 16 e seus testes. O baseline inicial deste documento continua sendo o observado no início da missão; ele não é apresentado como o HEAD atual de `main`.

O coordenador incorporou o novo `main` à branch da ficha, sem conflito e sem escrever em `main`. Merge local `9e0d74da733e3f999b4754d12392d7743e0b5b7c`; equivalente remoto `5020255da82e224cdcc0b41ade618aaa354dde32`; árvore `a71c4893b235c91d3a26a239a29b146d87ead52b`. Os quatro arquivos atualizados pelos slides são byte a byte iguais a `main`. A ficha, seus testes e suas evidências independentes não mudaram. O novo CI completo no HEAD final confirma a integração com os testes atualizados da apresentação; seus links e resultados são registrados na PR. [CI_PRE_UPSTREAM.json](CI_PRE_UPSTREAM.json) preserva a validação anterior como histórico, sem confundi-la com a nova candidata.

## Gates e regressão

| Gate | Evidência e escopo |
| --- | --- |
| G0 — baseline | PASS: `main` inicial `dc5ed18ebdab8dea9035f56a8f3bdedb2520af68`, árvore `c517e16770ed329ad7353571279b2b1072b8e3d3`; manifesto anterior às edições |
| G1 — contrato | PASS: 100 XP, duas trilhas equivalentes, revisão docente pendente, sem nota oficial; especificação e revisão em `docs/specs/aula07-ficha/` |
| G2 — implementação | PASS: entrega da frente de implementação, todos os reparos e documentação técnica |
| G3 — integração | PASS: portal integrado, root/CI controlados, artefatos e handoffs preservados; produto da Aula 06 e slides da Aula 07 sem alteração |
| G4 — QA independente | PASS: 45 unitários, 61 grupos completos, quatro PDFs e três revalidações focais; zero findings altos/críticos ou médios abertos |
| G5 — PR e CI | O fechamento deste gate é registrado na PR #6 sobre o HEAD remoto final, depois dos checks e antes de marcá-la pronta para revisão. O histórico aprovado anterior está em `CI_CANDIDATE.json`. |

A regressão do coordenador aprovou 84 verificações da Aula 06, a apresentação da Aula 07 nos três motores, os 35 testes de entrega após alinhamento da fixture legada e cinco cenários simulados de PDF/recibo. O produto da Aula 06 não foi modificado. O QA revisou o diff da fixture e confirmou que não houve relaxamento das assertions. Resultados e hashes: [REGRESSION.json](REGRESSION.json).

As capturas e PDFs são dados sintéticos. Paths privados dos logs foram substituídos por placeholders; espaços finais de um log foram normalizados, mantendo resultados e texto das assertions e atualizando seu hash. Não há envio de respostas da ficha pela rede.

## Próximo gate

Revisão humana visual e pedagógica da PR, incluindo equivalência entre trilhas, clareza da rubrica, autoria, privacidade e impressão. A composição oficial de PPI1-3B permanece dependente do plano e da etapa de catálogo formal da Aula 08. Nenhuma revisão automatizada ou de agente substitui esse aceite. Esta missão termina sem merge em `main` e sem publicação no GitHub Pages.
