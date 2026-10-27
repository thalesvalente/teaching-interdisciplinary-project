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
| Coordenador `/root` | Baseline, integração, portal, CI e entrega | `feat/aula07-ficha-avaliativa-20261027` | `ppi-repo` | raiz, `.github/**`, configuração global, `docs/implementation/aula07-ficha/**` | escrita/integrador | PR, decisões, evidência de CI e integração | G0/G3/G5; sem merge | PENDENTE |
| Agente 1 `pedagogia` | Contrato pedagógico, rubrica e rastreabilidade | `work/aula07-ficha-pedagogia` | `ppi-pedagogia` | `docs/specs/aula07-ficha/**` | escrita exclusiva | matriz, critérios observáveis, riscos e equivalência | G1: 100 XP; duas trilhas equivalentes; completude não semântica | PENDENTE |
| Agente 2 `implementacao` | Ficha funcional e módulos locais | `work/aula07-ficha-implementacao` | `ppi-implementacao` | `lessons/aula-07-da-pergunta-a-evidencia/ficha/**` | escrita exclusiva | interface, schema, pontuação, persistência, exportações e README | G2: sete missões, dados locais, exportações | PENDENTE |
| Agente 3 `qa` | QA independente e adversarial | `work/aula07-ficha-qa` | `ppi-qa` | `tests/aula07-ficha/**`, `docs/reviews/aula07-ficha/**` | escrita exclusiva; implementação somente leitura | suíte, relatório, screenshots/PDF | G4: testes reais; zero crítico/alto aberto | PENDENTE |

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

Manifesto criado antes de qualquer edição de produto, teste ou especificação. SHAs, árvores, testes e limitações serão registrados nos handoffs ao término das frentes.

### Ajuste de escopo do coordenador — fixture legada

Na regressão, `tests/ppi-entregas.test.cjs` (inalterado desde a base desta missão) apresentou 23 PASS e 12 FAIL: fixtures ainda consultavam o 3º bimestre, enquanto o commit anterior `9263d56` definiu o 4º bimestre para a Aula 06. O coordenador assume ownership exclusivo desse teste global para alinhar a fixture à configuração vigente, preservando as verificações de notas e de não alteração das demais abas. Nenhum arquivo do produto Aula 06 será modificado. A alteração será revisada pelo agente QA em modo somente leitura.
