# Aula 07 — Da pergunta à evidência

Apresentação interativa da disciplina **Prática Profissional Integrada I**, destinada ao 2º ano do Curso Técnico em Informática Integrado ao Ensino Médio do IFMA Campus Itapecuru-Mirim.

## Escopo didático

- entrevista, observação e análise documental;
- perguntas abertas, neutras e ligadas ao objetivo;
- triangulação entre fala, prática e registro;
- achado, evidência, hipótese e pendência;
- uso responsável de IA e gate ético;
- aplicação nas trilhas Mapa de Memórias Quilombolas e EDA/Permanência Estudantil.

A aula **não formaliza RF/RNF**, não utiliza dados reais e não autoriza coleta externa. A futura ficha avaliativa é um artefato separado.

## Gamificação

A apresentação possui seis missões, totalizando 100 XP de treino. Os pontos:

- são exclusivamente formativos;
- não valem nota;
- não geram ranking;
- não identificam aluno ou equipe;
- não são enviados ao professor;
- não alimentam a ficha avaliativa.

Erros exibem explicações e permitem nova tentativa sem penalidade.

## Compatibilidade e acessibilidade

- canvas de apresentação de 1280 × 720, escalado para o espaço disponível;
- validação específica em 1280 × 720 e 1280 × 650;
- modo leitura responsivo para celulares e telas estreitas;
- navegação por teclado, foco visível e diálogos nativos;
- alternativa a qualquer interação de arrastar;
- alto contraste e `prefers-reduced-motion`;
- impressão em páginas 16:9;
- funcionamento local, sem dependências de CDN.

## Arquivos

- `index.html`: conteúdo semântico dos 26 slides;
- `aula.css`: apresentação, reflow, impressão e contraste;
- `aula.js`: navegação, interações, missões e persistência local.

## Verificação

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:aula07
```

O teste verifica reflow, contenção do canvas, teclado, missões, pontuação formativa, contraste, diálogos e acessibilidade automatizável. Evidências são gravadas em `tmp/aula07-qa/` ou no diretório definido por `AULA07_EVIDENCE_DIR`.
