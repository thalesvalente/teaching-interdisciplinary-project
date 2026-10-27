# Revisão de implementação — Aula 07

Data: 27/10/2026

## Resultado

Implementada a apresentação interativa **Aula 07 — Da pergunta à evidência**, com 26 slides e seis missões formativas. O artefato cobre entrevista, observação, análise documental, triangulação, classificação de registros, IA responsável e gate ético para as trilhas Mapa Quilombola e EDA/Permanência.

## Decisões

- XP é explicitamente de treino, sem nota, ranking, identificação ou envio.
- A futura ficha avaliativa não foi criada nem acoplada à apresentação.
- O conteúdo termina em achados, evidências, hipóteses e pendências; RF/RNF ficam para a próxima etapa.
- Casos e planilhas são fictícios; a aula não autoriza coleta externa nem uso de dados reais.
- O canvas 1280 × 720 usa escala com origem superior para preservar o rodapé em projetores 720p.
- Telas estreitas usam modo leitura, com índice, toolbar de rolagem interna e controles fixos.
- O portal da disciplina aponta para a Aula 07 e preserva o acesso às aulas anteriores.

## QA local executada

- 26 slides e IDs únicos;
- seis missões renderizadas sem erro JavaScript;
- inspeção geométrica dos 26 slides em 1280 × 720, sem elementos visíveis fora do canvas;
- renderização da missão documental em 1280 × 650;
- reflow em 390 × 844 sem rolagem horizontal da página;
- toolbar móvel rolando internamente sem ampliar o documento;
- salto do índice alinhando a missão abaixo dos controles fixos;
- missão 1: pontuação e reinício;
- missão 4: seleção múltipla e pontuação;
- missão 6: fluxo em quatro etapas e conclusão;
- portal com sete aulas, busca e link para a nova apresentação;
- verificação visual da capa, missões 1, 3, 4 e 6, modo móvel e portal;
- sintaxe JavaScript e unicidade de IDs verificadas.

## CI adicionada

A suíte `tests/aula07-qa.cjs` será executada em Chromium, Firefox e WebKit. Ela verifica:

- contenção do canvas em 1280 × 720 e 1280 × 650;
- navegação por teclado;
- pontuação e reinício das missões;
- fluxo da missão final;
- modo leitura em 390 × 844;
- alto contraste, diálogos e ausência de erros no navegador;
- acessibilidade automatizável com axe-core.

## Limites

A auditoria automatizada não substitui revisão docente do conteúdo, inspeção humana no projetor real nem testes com tecnologias assistivas conduzidos por usuários. O equipamento da sala deve ser conferido antes da aplicação para ajustar zoom, contraste e distância de leitura.
