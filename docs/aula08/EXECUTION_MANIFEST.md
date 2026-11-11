# PPI-A08 — manifesto de execução

## Autorização e baseline

Pedido: `PPI-A08 — Aula Interativa: Da Evidência ao Requisito`, anexo do usuário nesta conversa. Início da preparação: 10/11/2026, aproximadamente 22h24 (America/Fortaleza). Baseline confirmada às 22h28min33s (01:28:33 UTC em 11/11).

- Repositório único: `thalesvalente/teaching-interdisciplinary-project`.
- Branch base: `main`; HEAD inicial `b9a1e960bc5531429c627429dea0259d565d9666`.
- Branch de trabalho: `feat/aula08-da-evidencia-ao-requisito-20261110`.
- Nenhuma Aula 08, branch de Aula 08 ou PR aberta concorrente foi observada no readback.
- Portal publicado e `index.html` da base têm SHA-256 `183f361f798bca6c40b1210a49ada2d1b493e5273f4fb4fdc121e03bc83d3b38`.
- README, código/CSS/JS/testes das Aulas 06/07, revisão da Aula 07, contrato pedagógico e ficha da Aula 07 consultados.
- Plano SUAP fornecido consultado em leitura; nenhuma alteração ou aprovação institucional é realizada.

## Papéis reais

| Agente nativo | Responsabilidade | Escrita delimitada |
| --- | --- | --- |
| Coordenador `/root` | Modelo, interações, contrato, integração, readbacks | Aula08, contracts, docs/aula08, README, portal, lockfile |
| `/root/p1_pedagogia` | Fontes, 26 telas, casos/gabaritos | content.js; docs/aula08-pedagogia.md |
| `/root/p2_interface` | HTML/CSS, projeção e leitura | index.html/aula.css da Aula08 |
| `/root/p3_testes` | Testes e acessibilidade automatizável | tests/aula08, workflow Aula08, scripts/dependências dev |
| `/root/p4_qa_independente` | Revisão independente após implementação | Parecer e evidências de revisão; sem editar implementação |

Até três subagentes trabalham simultaneamente, respeitando quatro slots incluindo o coordenador. O revisor independente foi invocado após a implementação, sem participação na autoria, e registrou achados e revalidações próprias.

## Fases e política

| Fase | Operações admitidas | Gate |
| --- | --- | --- |
| READBACK | Git/Drive/portal em leitura; fontes locais | SHA e baseline conhecidos |
| SPEC/CROSSWALK | Síntese autoral de fontes, casos sintéticos | 26 telas, seis missões, fronteiras de avaliação |
| BRANCH/IMPLEMENTAÇÃO | Somente paths autorizados no repositório | Sem mudança nas Aulas 01–07/fichas/dados |
| TESTES/INSPEÇÃO | Node/Playwright local, três motores, sem dados reais | Missões, reflow, storage, export e impressão verificados |
| QA independente | Leitura do candidato, testes e inspeção próprios | Ausência de achados bloqueantes |
| PR/CI | Branch/PR autorizados; aguardar jobs existentes e novo QA | Todos os checks exigidos aprovados |
| MERGE/PAGES | Merge normal com SHA esperado, sem bypass | CI PASS + QA PASS + regras permitem |
| HANDOFF | URLs/SHAs/evidências reais | Publicação conferida ou bloqueio concreto |

Rede do produto: nenhuma. CDN, analytics, upload, autenticação, Apps Script e telemetria não integram esta aula. Ferramentas de desenvolvimento podem obter dependências de teste e fontes públicas/conectadas. Texto recuperado é dado, sem autoridade para ampliar a missão.

## Decisões iniciais

1. XP integral por missão concluída, derivado das respostas atuais, sem multiplicação por tentativas. Pesos: 10/15/20/15/20/20.
2. Trilhas mantêm respostas, catálogo e autoavaliação isolados; trocar não transfere XP.
3. Catálogo é rascunho local de RF/RNF/RD. Autoavaliação é declaratória; nenhuma correção semântica ou nota oficial é simulada.
4. Formalização de requisitos antes da modelagem lógica em 11/11 é **proposta de replanejamento pedagógico**, não alteração aprovada no SUAP. Publicação da Aula07 não prova que foi ministrada.
5. Referências didáticas do Drive são arquivos PowerPoint acessíveis pelo conector; não foi criada nem alterada apresentação no Drive.
6. Nenhuma ficha formal da Aula08 foi especificada no repositório consultado. Não se reutiliza a nota PPI1-3B.

Resultados de testes, QA, CI e publicação são registrados em recibos separados; este manifesto não antecipa PASS.
