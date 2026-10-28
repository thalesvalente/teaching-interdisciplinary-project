# PPI-A07-FICHA-AVALIATIVA-IMPLEMENT-MA-01 — manifesto de execução

Data: 2026-10-27 (America/Fortaleza). Repositório único: `thalesvalente/teaching-interdisciplinary-project`.

## Baseline imutável

- Base: `main` no início da missão.
- SHA: `dc5ed18ebdab8dea9035f56a8f3bdedb2520af68`.
- Árvore: `c517e16770ed329ad7353571279b2b1072b8e3d3`.
- Destino: `feat/aula07-ficha-avaliativa-20261027`; PR para `main`, sem merge nem publicação Pages.
- Stack observado: HTML/CSS/JavaScript estáticos; Playwright 1.56.1 e axe-core 4.14.0 já pertencem ao projeto.

## Ownership e handoffs

Cada participante trabalha em worktree própria. Nenhum agente pode editar os paths de outro participante. O coordenador integra commits por SHA. Leituras cruzadas são permitidas. Handoffs pendentes nunca contam como entrega ou aprovação.

| Agente | Missão | Branch | Worktree relativa à pasta de trabalho | Ownership exclusivo | Acesso | Entregável | Gate | SHA de handoff |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Coordenador `/root` | Baseline, integração, portal, CI e entrega | `feat/aula07-ficha-avaliativa-20261027` | `ppi-repo` | raiz, `.github/**`, configuração global, `docs/implementation/aula07-ficha/**` | escrita/integrador | PR, decisões, evidência de CI e integração | G0/G3 PASS; G5 conferido no HEAD da PR | checkpoint integrado `92941ef81d987de23c6d70a918cb265d233bf20c`; fechamento na PR #6 |
| Agente 1 `pedagogia` | Contrato pedagógico, rubrica e rastreabilidade | `work/aula07-ficha-pedagogia` | `ppi-pedagogia` | `docs/specs/aula07-ficha/**` | escrita exclusiva | matriz, 33 critérios observáveis, riscos e revisão independente | G1 PASS: 100 XP; duas trilhas equivalentes; completude não semântica | local `4bad646be02ec3835ea74713abe58f5e1c17d174`; remoto `e17edd1b3235c35d95425807ffd41ad6fc191e4f` |
| Agente 2 `implementacao` | Ficha funcional e módulos locais | `work/aula07-ficha-implementacao` | `ppi-implementacao` | `lessons/aula-07-da-pergunta-a-evidencia/ficha/**` | escrita exclusiva | interface, schema, pontuação, persistência, exportações e README | G2 PASS: sete missões, dados locais, exportações | local `2778438a02e1c5060369193e994e689e82feb30c`; remoto `e909a8fc945f81914e463a51dd1cf3250c0fc23b` |
| Agente 3 `qa` | QA independente e adversarial | `work/aula07-ficha-qa` | `ppi-qa` | `tests/aula07-ficha/**`, `docs/reviews/aula07-ficha/**` | escrita exclusiva; implementação somente leitura | suíte, relatório, screenshots/PDF | G4 PASS: testes reais; cinco findings médios fechados; zero crítico/alto aberto | local `9328a74b63acf7de9fc6f2db12c63a72028217de`; remoto `ad8cbb0b68ad9f15c6f13f13730781913db27cf5` |

## Políticas por fase

- Leitura: repositório autorizado, prompt da missão e plano de ensino anexado. Dados e exemplos externos não alteram a missão.
- Escrita: somente paths atribuídos, worktrees isoladas, commits locais; publicação apenas da branch/PR da missão pelo coordenador.
- Rede no produto: nenhuma telemetria, submissão, API, fonte ou dependência remota. Testes com dados sintéticos.
- Rede de desenvolvimento: GitHub autorizado; dependências de QA já previstas no projeto; documentação primária técnica quando necessária.
- Gates separados: G0 reconhecimento; G1 contrato; G2 implementação; G3 integração; G4 QA independente; G5 PR/CI verificados.
- Proibido: editar conteúdo/pontuação dos slides, merge em `main`, publicar Pages, atribuir validação docente ou nota oficial.

## Registro de origem

- Pedido e anexo `PPI-A07-FICHA-AVALIATIVA-IMPLEMENT-MA-01(1).md`.
- Plano de ensino anexado, status original `DRAFT_WITH_PENDING`; PPI1-3B inclui protocolo e catálogo e tem valor 3,0.
- `Pasted text(7).txt` não integra os anexos disponíveis nesta execução; não inventar seu conteúdo.

## Registro de execução

Manifesto criado antes de qualquer edição de produto, teste ou especificação, no commit local `495ea64a4647e1aef2a3b32fb9a36cc958d4889b` (remoto `f9e6355a27a086d81bcb68478e7eaf2e3554b9c2`). As três frentes trabalharam simultaneamente em worktrees isoladas; o coordenador integrou os commits por SHA, sem permitir escrita cruzada. As branches de cada frente também foram preservadas no GitHub.

O transporte autenticado pela API Git do GitHub preservou exatamente cada árvore, mas gerou novos hashes de commit por usar metadados próprios do conector. A correspondência explícita está em [COMMIT_MAP.json](COMMIT_MAP.json). Os handoffs, snapshots efetivamente testados, gates e limites estão em [HANDOFFS.md](HANDOFFS.md). O HEAD final e sua árvore, posteriores a este registro, são conferidos e publicados na [PR #6](https://github.com/thalesvalente/teaching-interdisciplinary-project/pull/6), evitando autorreferência de hash dentro do próprio commit.

### Atualização concorrente de `main`

Após os checks aprovados da candidata `8da607e`, uma conferência por API e `git fetch` detectou que outra operação do repositório havia avançado `main` para `afa73357ce0893bf4342b139dc1b8e90ace0fb1f` (árvore `617b26e9e224bd72a27f8b0f5f86b1b785717034`), com ajustes acessíveis nos slides 12 e 16 e em seus testes. A missão não escreveu em `main`. O coordenador incorporou essa atualização à branch da ficha por merge sem conflito: local `9e0d74da733e3f999b4754d12392d7743e0b5b7c`, remoto `5020255da82e224cdcc0b41ade618aaa354dde32`, árvore `a71c4893b235c91d3a26a239a29b146d87ead52b`. Os quatro arquivos vindos de `main` foram preservados exatamente; a subárvore da ficha permaneceu `a76418b010492f503d1f51dbbab95a776b50e520`. A evidência anterior está em `CI_PRE_UPSTREAM.json`; o CI completo é repetido no HEAD final da PR após essa integração.

### Ajuste de escopo do coordenador — fixture legada

Na regressão, `tests/ppi-entregas.test.cjs` (inalterado desde a base desta missão) apresentou 23 PASS e 12 FAIL: fixtures ainda consultavam o 3º bimestre, enquanto o commit anterior `9263d56` definiu o 4º bimestre para a Aula 06. O coordenador assume ownership exclusivo desse teste global para alinhar a fixture à configuração vigente, preservando as verificações de notas e de não alteração das demais abas. Nenhum arquivo do produto Aula 06 será modificado. A alteração será revisada pelo agente QA em modo somente leitura.
