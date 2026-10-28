# QA independente da Ficha Avaliativa da Aula 07

As verificações são conduzidas com dados sintéticos. Nenhum teste prova correção semântica de respostas ou aceite docente.

## Execução

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
node --test tests/aula07-ficha/unit.test.cjs
node tests/aula07-ficha/browser.cjs
python3 tests/aula07-ficha/pdf-check.py tmp/aula07-ficha-qa
```

`PPI_FICHA_ROOT` permite testar outra árvore sem copiá-la ou editá-la. `PPI_FICHA_BROWSERS` seleciona motores; o padrão é `chromium,firefox,webkit`. `PPI_FICHA_EVIDENCE_DIR` define o diretório de evidências. Os relatórios registram o SHA, a árvore e eventuais alterações não commitadas da implementação.

## Cobertura exigida

| Grupo | Oráculo independente |
| --- | --- |
| SCORE | Pesos 10/15/20/15/20/10/10; total 100; respostas vazias e espaços = zero; editar/apagar reduz XP; teto por missão |
| IMPORT | Round-trip, versão, tipos, propriedades inesperadas, protótipos, tamanho, profundidade e pontuação adulterada |
| TEAM | IDs estáveis ao renomear/remover; autoria por integrante; sem equipe não há XP de autoria |
| TRACK | Duas trilhas equivalentes; mudança zera conteúdo incompatível |
| FLOW | Sete missões e resumo; retomada; validação; resets confirmados; exportações; sem backend ou rede de respostas |
| A11Y | axe-core em telas e erros; teclado; foco; labels; anúncios; zoom/reflow; contraste; movimento reduzido |
| VIEW | 1280×650, 1366×768, 1920×1080, 390×844, 360×800, 320×568 |
| PRINT | A4 preenchido, parcial e em branco; texto selecionável; pendências; ausência de corte; inspeção visual |
| REG | Portal, Aula 06, 26 slides/seis missões formativas da Aula 07; armazenamento separado |

Relatórios automatizados e inspeção visual têm limites diferentes. Resultado axe sem violações sérias/críticas não equivale a certificação completa WCAG 2.2 AA. Um motor indisponível é `BLOCKED`, nunca `PASS`.
