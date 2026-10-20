# Revisão da Aula 06 e da ficha de equipe — 20/10/2026

## Escopo e referência

Esta revisão trata da usabilidade, acessibilidade, coerência didática e exportação da **Aula 06 — Ética e Proteção de Dados: Consentimento, Privacidade, LGPD e Proveniência**, incluindo a ficha de protocolo ético e matriz de riscos e seu exemplo preenchido.

Referência de comparação: commit base `445e53992d395c6089729f2a1c28c556260dee20`. Este documento descreve o conjunto de trabalho revisado a partir dessa base; não identifica uma publicação ou um commit de entrega.

O escopo funcional está em `lessons/aula-06-etica-protecao-dados/`: `index.html`, `aula.css`, `aula.js`, `Ficha_Equipe_Aula_06_PPI.html`, `ficha.css`, `ficha.js`, `atividade-pdf.js` e `exemplo-preenchido.html`. A documentação de uso está em [FICHA_PROTOCOLO.md](../lessons/aula-06-etica-protecao-dados/FICHA_PROTOCOLO.md). Os roteiros estão em [tests/aula06-qa.cjs](../tests/aula06-qa.cjs) e [tests/aula06-pdf-qa.py](../tests/aula06-pdf-qa.py), e a evidência consolidada está em [qa/aula06-2026-10-20.json](qa/aula06-2026-10-20.json).

O objetivo foi permitir que a turma leia, responda, revise e exporte o trabalho em diferentes tamanhos de tela, inclusive quando ainda há questões pendentes. O preenchimento e a pontuação devem representar o estado atual da atividade.

## Achados corrigidos

| Problema identificado | Mudança incorporada | Onde manter |
| --- | --- | --- |
| Apresentação rígida, disputa por espaço com os controles e risco de conteúdo encoberto | Cabeçalho e controles com espaço próprio; cálculo pela área restante; leitura contínua em telas estreitas ou baixas e quando necessário para acomodar o conteúdo | `aula.css`, `aula.js` |
| Controles, diálogos e atalhos dificultavam uso em telas pequenas e por teclado | Controles permanecem disponíveis, foco visível, diálogos nomeados, retorno de foco e atalhos que respeitam campos e diálogos | `index.html`, `aula.js`, `ficha.js` |
| Adaptação de tabelas prejudicava a relação entre rótulos e dados | Relação entre cabeçalhos e células preservada, com rótulos visíveis no formato estreito | `index.html`, `aula.css` |
| Percurso da ficha pouco explícito | Sete etapas com navegação, pesos visíveis, progresso e lista de pendências | `Ficha_Equipe_Aula_06_PPI.html`, `ficha.js` |
| Pontuação precisava ser coerente entre interface e documentos, inclusive em respostas parciais | Rubricas explícitas, máximo fixo de 100 XP e modelos de relatório calculados a partir das respostas atuais | `aula.js`, `ficha.js`, `atividade-pdf.js` |
| Possível confusão entre risco, preparação, acerto e nota | Indicadores nomeados separadamente; critérios e limites explicados na tela e nos relatórios | Aula, ficha e exemplo |
| Matriz didática divergia da classificação usada no cálculo | Faixas uniformes: 1–2 baixa, 3–4 moderada e 6–9 alta | `index.html`, `ficha.js`, `exemplo-preenchido.html` |
| Consentimento e anonimização exigiam maior precisão | Consentimento apresentado como uma base possível; distinção entre anonimização, pseudonimização e risco de identificação indireta | Aula, dicas da ficha e exemplo |
| Proveniência, guarda e uso de IA estavam pouco operacionais | Campos existentes passam a orientar local de guarda, responsáveis, transformações, verificação, prazo/critério de descarte e declaração de IA | `ficha.js`, aula e exemplo |
| PDF herdava rótulos de outra atividade e podia limitar textos longos | Modelo compartilhado com títulos da Aula 06, quebra em páginas e preservação de respostas longas | `atividade-pdf.js` |
| Reabertura de rascunhos exigia validação e pontuação confiável | Validação completa antes da substituição, confirmação na interface e recálculo dos XP e índices de risco | `ficha.js` |
| Caixa de compromisso vazia podia ser interpretada como recusa | Documento registra “decisão ainda não registrada” | `ficha.js` |
| Nome acessível do controle de limpeza não continha todo o texto visível, identificado no WebKit | Nome acessível passou a incorporar “Deixar esta missão em branco” | `aula.js` |
| Grade de risco apresentava 7 px de transbordamento a 640 px com texto ampliado, identificado no WebKit | Grade reorganizada em uma coluna até 700 px | `ficha.css` |
| Impressão integral deixava o rodapé da tela 4 isolado | Ajuste do espaçamento dos cartões na impressão; metadados da ficha também ajustados para o documento impresso | `aula.css`, `ficha.css` |
| Documentação descrevia controles flutuantes | Descrição atualizada para a estrutura real, com controles em área própria | `FICHA_PROTOCOLO.md` |

## Decisões pedagógicas e LGPD

### Atividade formativa e responsabilidade institucional

A equipe aprende a formular perguntas práticas: precisamos desse dado, ele identifica alguém, envolve categoria sensível, qual procedimento precisa ser confirmado e de onde veio a informação? A atividade não transforma estudantes em responsáveis por determinar sozinhos a base legal ou certificar conformidade.

Para os protótipos desta aula, priorizam-se dados sintéticos e, quando adequado, indicadores agregados preparados para a finalidade. A autorização para uso real deve seguir o procedimento da instituição. Essa é uma decisão de desenho da atividade; não se apresenta como proibição geral de toda pesquisa escolar com dados pessoais. O [guia da ANPD sobre fins acadêmicos e pesquisas](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-tratamento-de-dados-pessoais-para-fins-academicos-e-para-a-realizacao-de-estudos-e-pesquisas) orienta a análise do contexto e das hipóteses aplicáveis.

### Conceitos que precisam permanecer precisos

- **Consentimento:** uma das bases legais. Quando utilizado, deve ser livre, informado e inequívoco, relacionado a finalidade determinada e com revogação facilitada. Um aceite genérico não autoriza todo uso futuro.
- **Dados pessoais e sensíveis:** informação que identifica ou pode identificar uma pessoa é pessoal. As categorias sensíveis têm definição legal; nome profissional, endereço ou telefone não são automaticamente dados sensíveis.
- **Dados públicos:** acesso público não elimina finalidade, contexto, direitos do titular e demais requisitos aplicáveis. O exemplo não presume autorização para reutilização irrestrita.
- **Anonimização e pseudonimização:** remover nomes ou trocar por códigos não garante anonimato. A existência de uma chave de ligação, atributos indiretos e cruzamentos precisam ser considerados. Agregação em grupos pequenos também pode permitir inferências sobre pessoas.
- **Crianças e adolescentes:** o melhor interesse deve prevalecer. O enunciado da ANPD admite as hipóteses legais cabíveis dos arts. 7º e 11 da LGPD; o material evita ensinar que o consentimento parental seja a única base em todas as situações.

Essas distinções seguem a [LGPD, especialmente arts. 5º–8º e 11–14](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm), o [estudo técnico de anonimização da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/documentos-tecnicos-orientativos/estudo_tecnico_sobre_anonimizacao_de_dados_na_lgpd___analise_juridica.pdf/@@display-file/file) e o [Enunciado CD/ANPD nº 1/2023](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).

### Proveniência, IA e exemplos

A ficha orienta registrar fonte, data/versão, transformações, responsáveis pela verificação e limites de uso. A referência conceitual de proveniência considera entidades, atividades e agentes envolvidos na produção da informação, conforme o [W3C PROV](https://www.w3.org/TR/prov-overview/).

A declaração de ferramenta, data, finalidade e verificação do apoio de IA é uma regra didática de rastreabilidade. Não é apresentada como uma lista universal de exigências legais. A saída de IA não vale como evidência por si só, e a orientação da atividade é não enviar dados pessoais ou narrativas não autorizadas a essas ferramentas.

Os exemplos distinguem fato documentado, dado sintético e planejamento fictício. Entrevistas são apenas planejadas, sem contato ou gravação. O exemplo preenchido não inventa consentimento, autorização institucional ou uso de IA que não tenham sido informados.

## Rubricas e invariantes de pontuação

### Aula: cinco missões de 20 XP

| Missão | Foco | Máximo |
| --- | --- | ---: |
| 1 | Reconhecer o risco | 20 XP |
| 2 | Entender o consentimento | 20 XP |
| 3 | Usar o mínimo necessário | 20 XP |
| 4 | Distinguir anonimização | 20 XP |
| 5 | Registrar a proveniência | 20 XP |
| **Total** | **Cinco respostas** | **100 XP** |

A pontuação é a soma dos acertos atuais. Resposta incorreta ou vazia vale zero. Alterar um acerto para uma resposta incorreta, ou limpar a resposta, reduz os XP. Não há acúmulo por tentativa, navegação ou tempo. Os estados “respondida” e “correta” são distintos.

### Ficha: sete missões, 26 campos, 100 XP

| Missão | Quantidade de campos | Pesos | Máximo |
| --- | ---: | --- | ---: |
| Informação | 4 | 5 + 5 + 5 + 5 | 20 XP |
| Classificação | 4 | 4 + 4 + 4 + 8 | 20 XP |
| Autorização | 3 | 5 + 5 + 5 | 15 XP |
| Proveniência | 3 | 5 + 5 + 5 | 15 XP |
| Riscos | 8 | 2 × (3 + 1 + 1 + 3) | 16 XP |
| Protocolo | 1 | 4 | 4 XP |
| Revisão | 3 | 3 + 3 + 4 | 10 XP |
| **Total** | **26** | **19 textos e sete seleções** | **100 XP** |

Na ficha, XP mede preparação por preenchimento, não correção. Texto em branco ou apenas com espaços vale zero; opções precisam ser válidas. Uma dúvida registrada pode pontuar porque a qualidade será discutida na revisão docente. Identificação e oito compromissos ficam fora da rubrica.

As duas atividades mantêm denominador 100 mesmo quando estão incompletas. O índice chance × impacto é calculado separadamente e não aumenta nem diminui XP. Conclusão, pontuação máxima ou índice de risco baixo não constituem nota oficial, conformidade jurídica ou autorização para tratar dados.

## Impressão e exportação parcial

`documentModel()` é a referência do resultado atual em cada atividade. PDF direto e impressão recebem a pontuação, o detalhamento das missões, respostas atuais e pendências. A ficha também gera Markdown e JSON. Nenhum desses fluxos exige completar todos os campos.

A impressão da aula apresenta o resultado das missões; a opção adicional em Ajuda inclui as 24 telas e o resultado. A ficha oferece uma prévia e permite voltar ao formulário sem perder respostas. O evento `beforeprint` prepara o documento também para o atalho de impressão do navegador.

O rascunho JSON é validado antes de qualquer substituição e a interface pede confirmação. Pontos e índices importados são ignorados e recalculados. Arquivos inválidos preservam o formulário anterior integralmente, sem aplicação parcial de campos.

O PDF direto usa WinAnsi e contém texto selecionável. Para caracteres não suportados, a interface encaminha à impressão do navegador sem remover texto ou alterar a pontuação. O fluxo não deve converter silenciosamente um caractere desconhecido em outro símbolo.

## Evidências concluídas em 20/10/2026

Foram concluídos **78 de 78 cenários**, com **zero falhas e zero bloqueios**: 52/52 em Chromium e Firefox e 26/26 em WebKit. A rodada final usou a mesma suíte nos três motores, incluindo a ampliação efetiva de fontes computadas. Os resultados descrevem as condições executadas; não equivalem a testes em todos os dispositivos ou combinações de tecnologia assistiva. Os cenários do roteiro agregam verificações internas, como a passagem por nove viewports em cada página.

| Verificação | Evidência registrada |
| --- | --- |
| Navegadores | Chromium **141.0.7390.37**, Firefox **142.0.1** e WebKit **26.0**, executados com Playwright; 26 cenários aprovados em cada motor. |
| Responsividade | Três páginas — aula, ficha e exemplo — em nove viewports por navegador: 320 × 568, 360 × 800, 390 × 844, 768 × 1024, 1024 × 768, 1280 × 720, 1440 × 900, 1920 × 1080 e 844 × 390. Inclui orientação paisagem. Não foi encontrado transbordamento horizontal nos estados verificados. |
| Verificação automática de acessibilidade | **axe-core 4.14.0**, regras automatizáveis A/AA das WCAG 2.0, 2.1 e 2.2 selecionadas pelo roteiro; **nenhuma violação encontrada nos estados testados**. |
| Área útil da apresentação | As **24 telas** foram percorridas sem conteúdo sob o rodapé nas condições verificadas. |
| Texto e espaçamento | Fontes computadas duplicadas, incluindo tamanhos declarados em px, em 1280 × 720. Também foram verificadas a ampliação da fonte raiz para 200% e a aplicação de espaçamento ampliado em 640 × 480: altura de linha 1,5, espaço após parágrafos 2 em, letras 0,12 em e palavras 0,16 em. |
| Teclado e diálogos | Navegação sem troca indevida de slide enquanto o foco está em campo/diálogo; retorno de foco nos fluxos testados. |
| Pontuação | Estados vazio, parcial e completo; revisão de resposta e limpeza diminuem XP; máximo permanece 100. |
| Impressão e PDF parcial | Pontuação, respostas e pendências preservadas em estados vazio, parcial e completo; textos longos mantidos. |
| Importação JSON | Pontuação adulterada foi recalculada; arquivo inválido não alterou o preenchimento anterior, inclusive campos válidos presentes no mesmo arquivo. |
| Operação sem rede | Após o carregamento, a interação e a exportação testadas funcionaram offline, sem requisições externas registradas no percurso. |
| Inspeção dos documentos | **28/28 PDFs no conjunto final** (18 na rodada inicial), com texto selecionável, sem cortes encontrados e sem cabeçalhos herdados da atividade anterior. |
| Unicode fora de WinAnsi | Encaminhamento à impressão, preservando a resposta e a pontuação atuais. |

As verificações de acessibilidade usam a [WCAG 2.2](https://www.w3.org/TR/WCAG22/) como referência. Entre os aspectos pertinentes estão reflow, redimensionamento e espaçamento do texto, nome acessível, foco, operação por teclado e mensagens de estado.

### Inspeções complementares de impressão

As inspeções abaixo complementam os cenários automatizados. Os dados de pontuação são estados de teste sintéticos e demonstram a preservação do resultado parcial.

| Documento | Resultado final |
| --- | --- |
| **Aula completa + resultado** | **27 páginas**: 24 telas e três páginas de resultado; os **24 títulos** foram encontrados; **20/100 XP** e **três pendências** preservados; **zero cortes encontrados**. O rodapé isolado da tela 4 foi resolvido. |
| **Ficha com resposta longa**, impressa pelo navegador | **Cinco páginas**, **2.506 caracteres preservados** e marcador final conferido; **10/100 XP** e **24 pendências** preservados; **zero cortes encontrados**. |

Uma nova alteração em impressão deve atualizar esta seção e a evidência consolidada, mantendo separados o resultado da suíte e a inspeção dos documentos. A quantidade de páginas acima corresponde às configurações usadas na verificação e não é uma promessa de paginação idêntica em qualquer impressora.

## Como repetir a verificação

Com Node.js disponível, execute a partir da raiz do repositório:

```sh
npm ci
npx playwright install chromium firefox webkit
AULA06_BROWSERS=chromium,firefox,webkit npm run test:aula06
```

O roteiro inicia seu servidor local. Por padrão, grava `qa-results.json`, `qa-checkpoint.json`, capturas e documentos em `tmp/aula06-qa/`. Use `AULA06_EVIDENCE_DIR` para escolher outro diretório de evidências. `AULA06_BROWSERS` seleciona os motores, separados por vírgula; instalar um motor é requisito para executá-lo.

Para conferir o texto, os pontos, as pendências e os limites das páginas dos PDFs baixados, execute em um ambiente Python com `pdfplumber`:

```sh
python tests/aula06-pdf-qa.py tmp/aula06-qa
```

O script também aceita vários diretórios de PDFs como argumentos. As duas amostras de impressão integral/ficha longa foram geradas e inspecionadas complementarmente; sua presença deve ser confirmada ao tentar reproduzir a contagem consolidada de 28 documentos.

O teste automatizado não substitui a inspeção visual dos documentos. Após alterações em conteúdo, estilos de impressão ou geração de PDF, confira as páginas exportadas e a seleção/extração de texto, além dos resultados do roteiro. Registre o motor, versão, cenários e data da nova rodada antes de atualizar as afirmações deste relatório.

## Limitações e próximos cuidados de manutenção

- **WCAG:** ausência de violações automatizadas é evidência parcial. Não há certificação completa de conformidade nem alegação de cobertura de todos os leitores de tela e fluxos possíveis. A referência é WCAG 2.2 AA.
- **Dispositivos:** viewports simulam áreas de exibição. O teste de WebKit 26.0 não equivale a testar o aplicativo Safari ou um iPhone físico; este registro não alega essas verificações.
- **PDF:** o gerador direto não produz PDF marcado segundo PDF/UA; texto selecionável não garante acessibilidade estrutural. O suporte a caracteres fora de WinAnsi depende da impressão do navegador e das fontes disponíveis.
- **Impressão:** paginação pode variar com navegador, papel, margens e configurações do usuário. As inspeções complementares da aula inteira e da ficha longa estão registradas acima para os estados testados.
- **Offline:** foi verificado o uso após carregar os arquivos. Isso não comprova instalação como aplicativo, cache persistente ou primeira abertura sem conexão. Links de referência externos dependem de rede quando acessados.
- **Persistência:** não há salvamento automático nem envio ao servidor. A equipe precisa guardar o rascunho para continuar a ficha. Arquivos baixados contêm o que foi digitado e devem ser compartilhados conforme a finalidade.
- **Avaliação:** o preenchimento automático da ficha não avalia verdade, qualidade ou adequação jurídica. Não reaproveitar XP como nota ou autorização sem uma decisão pedagógica explícita e documentada.

Em mudanças futuras, preservar os invariantes de pontuação, a exportação parcial, a validação antes de substituir o rascunho e a separação entre modelos de dados e apresentação. Mudanças em campos e rubricas exigem atualização conjunta de interface, documentos, validação de importação, documentação e testes pertinentes.

## Fontes oficiais para revisão de conteúdo

| Fonte | Uso nesta revisão |
| --- | --- |
| [LGPD — Lei nº 13.709/2018, texto compilado](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm) | Definições, princípios, bases legais, consentimento, crianças/adolescentes, guarda e segurança. |
| [ANPD — Guia para fins acadêmicos e estudos/pesquisas](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-tratamento-de-dados-pessoais-para-fins-academicos-e-para-a-realizacao-de-estudos-e-pesquisas) | Tratamento em contexto acadêmico; edição do guia de junho de 2023, distinta da data de publicação da página. |
| [ANPD — Enunciado CD/ANPD nº 1/2023](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes) | Hipóteses legais e prevalência do melhor interesse de crianças e adolescentes. |
| [ANPD — Guia de legítimo interesse](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_legitimo_interesse.pdf/@@display-file/file) | Fonte oficial que também reproduz o enunciado sobre crianças e adolescentes; não indica essa base como escolha automática para a atividade. |
| [ANPD — Estudo técnico de anonimização, análise jurídica](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/documentos-tecnicos-orientativos/estudo_tecnico_sobre_anonimizacao_de_dados_na_lgpd___analise_juridica.pdf/@@display-file/file) | Distinção entre anonimização e pseudonimização e avaliação contextual de identificação. |
| [W3C — PROV Overview](https://www.w3.org/TR/prov-overview/) | Origem, transformações e responsáveis na proveniência. |
| [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Critérios de acessibilidade usados como referência. |

As fontes fundamentam o material didático. As regras de uso real de dados continuam dependentes da finalidade, do contexto e dos procedimentos aplicáveis na instituição.
