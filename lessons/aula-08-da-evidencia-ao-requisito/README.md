# Aula 08 — Da evidência ao requisito

PPI I · IFMA Campus Itapecuru-Mirim · 2º ano do Técnico em Informática Integrado · 2026.2.

## Usar a aula

Abra `index.html`. Em telas largas, a apresentação usa proporção 16:9; em telas com menos de 900 CSS px, entra em leitura vertical. **Índice** abre as 26 telas. **Notas do professor** oferece orientação para a tela atual, referências e ritmo de 50 minutos.

Setas esquerda/direita ou PageUp/PageDown mudam de tela quando o foco está no conteúdo. Home/End levam à primeira/última tela. Os atalhos não interferem com campos, botões, links ou diálogos. Tab percorre os controles; Enter/Espaço ativam botões. Escape fecha os diálogos.

No seletor **Trilha**, escolha Memórias Quilombolas ou Permanência Estudantil. Respostas, XP, catálogo, autoavaliação e ticket ficam separados por trilha. Voltar a uma trilha retoma seu percurso.

## Treino e produto

| Missão | XP | Tema |
| --- | ---: | --- |
| 1 | 10 | Achado, evidência, hipótese e pendência |
| 2 | 15 | Necessidade do usuário e requisito do sistema |
| 3 | 20 | RF, RNF, requisito de dados e regra de negócio |
| 4 | 15 | Mensurabilidade, acesso e proteção |
| 5 | 20 | Dado/Quando/Então, ambiguidade e prioridade |
| 6 | 20 | Rastreabilidade e pares consistentes |

Cada missão dá seus XP quando todas as questões atuais estão corretas. Toda escolha mostra uma explicação e permite tentar novamente. Repetir a mesma resposta não duplica XP. Trocar uma resposta correta por uma incorreta recalcula a missão; **Reiniciar esta missão** limpa somente ela, na trilha atual.

O produto da tela 24 é um **catálogo de rascunho**: um RF, um RNF verificável e um requisito de dados. Cada item tem enunciado, fonte sintética, situação da fonte, prioridade e critério de aceitação. Exemplos são consultados sem preenchimento automático. A tela 25 registra autoavaliação guiada; a tela 26 guarda o ticket de saída.

Os quatro domínios são independentes:

1. **XP de treino:** deriva apenas das seis missões objetivas.
2. **Completude do catálogo:** registra quantos dos nove campos de texto foram preenchidos; não mede qualidade.
3. **Avaliação qualitativa docente:** permanece pendente, sem aprovação simulada.
4. **Nota oficial:** não é calculada, convertida nem submetida.

Editar um requisito limpa os quatro itens da autoavaliação, para que a equipe revise novamente. Não há correção semântica automática, ranking, nome ou matrícula obrigatórios.

## Guardar e imprimir

O rascunho é salvo no navegador a cada edição. **Baixar síntese JSON** exporta voluntariamente somente a trilha atual. **Imprimir / salvar PDF** e Ctrl+P geram uma síntese A4 do percurso, catálogo, autoavaliação e ticket, inclusive parciais. A impressão não altera as respostas.

Se o navegador não permitir armazenamento, a sessão continua em memória e mostra um aviso para baixar a síntese. Um rascunho inválido já existente é preservado, sem sobrescrita silenciosa. **Índice → Apagar rascunhos** pede confirmação e limpa somente a chave desta aula, das duas trilhas. Em equipamento compartilhado, exporte o que deseja guardar e apague ao terminar.

Não há importação de arquivos nesta versão. O JSON é uma cópia para revisão e futura interoperabilidade; não promete restauração automática em outro dispositivo. O salvamento automático retoma no mesmo navegador/origem enquanto seus dados forem mantidos.

## Uso offline

Baixe a pasta inteira da aula e mantenha juntos `index.html`, `aula.css`, `content.js`, `model.js` e `aula.js`. Abra o HTML diretamente no navegador, inclusive por `file://`. Não precisa instalar Node, servir uma API, autenticar ou acessar uma CDN. A aula carregada também continua funcionando após a conexão ser retirada. O navegador precisa executar JavaScript local.

Os links de portal e referências são navegação voluntária e podem exigir internet. Não há service worker nem promessa de cache persistente da página publicada. Copiar só o HTML sem os quatro recursos locais não constitui download completo.

## Manutenção e verificação

- `content.js`: roteiro, 34 enunciados contextualizados, gabaritos/objetivos versionados e registros sintéticos.
- `model.js`: estado validado, isolamento, pontuação determinística e envelope de exportação.
- `aula.js`: DOM seguro, navegação, feedback, rascunho e impressão.
- `aula.css`: canvas 16:9, reflow, contraste, foco e impressão.
- `../../contracts/ppi-aula08-v1.schema.json`: contrato JSON Schema 2020-12.
- `../../docs/aula08-pedagogia.md`: material docente e matriz pergunta → objetivo → evidência → critério.

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:aula08:unit
npm run test:aula08
```

O ambiente local de QA pode usar `AULA08_WEBKIT_EXECUTABLE` para apontar um WebKit instalado no próprio ambiente. A CI usa os navegadores oficiais do Playwright. Isso não adiciona dependência ao produto.

Critérios automatizáveis da WCAG 2.2 AA são uma meta testada; testes com leitor de tela por usuários e inspeção no projetor real continuam sendo limites de validação. Os registros da aula são inteiramente fictícios. A proposta de antecipar requisitos à modelagem de 11/11 não altera o plano SUAP.
