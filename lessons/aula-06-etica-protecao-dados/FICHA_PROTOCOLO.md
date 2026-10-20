# Aula 06 — Ética e Proteção de Dados

**Ética e Proteção de Dados: Consentimento, Privacidade, LGPD e Proveniência**

Este material de PPI I reúne uma aula interativa e uma ficha coletiva para preparar o **protocolo ético e a matriz de riscos** de um projeto. A atividade trabalha necessidade, identificação, sensibilidade, autorização e proveniência, com linguagem adequada ao ensino médio técnico.

## Arquivos e responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo da aula: 24 telas, sendo 20 para o percurso principal e quatro para consulta; diálogos e controles. |
| `aula.css` | Apresentação, leitura contínua, adaptação a telas pequenas e estilos de impressão da aula. |
| `aula.js` | Navegação, cinco missões, pontuação por acerto, casos, demonstração de risco, cronômetros e relatório da aula. |
| `Ficha_Equipe_Aula_06_PPI.html` | Entrada da ficha, identificação opcional, progresso, navegação entre etapas e controles de exportação. |
| `ficha.css` | Formulário responsivo e documento de impressão. |
| `ficha.js` | Campos, dicas por projeto, sete missões, índice de risco, rascunho JSON, Markdown e modelo de relatório. |
| `atividade-pdf.js` | Gerador local compartilhado de PDF, a partir do modelo fornecido pela aula ou pela ficha. |
| `exemplo-preenchido.html` | Exemplo estático comentado; não recebe XP nem comprova autorização de um projeto real. |

O [registro da revisão de 20/10/2026](../../docs/aula06-revisao-2026-10-20.md) detalha decisões, evidências de testes e limites conhecidos.

## Uso em sala

1. Percorram a aula e respondam às cinco missões quando fizer sentido para a discussão. É possível revisar ou limpar uma resposta.
2. Abram uma ficha por equipe. A identificação é opcional; selecionar um projeto apenas adapta as situações e dicas, sem preencher respostas nem alterar pesos.
3. Registrem decisões e dúvidas concretas. Se ainda faltar informação ou revisão por pares, deixem o campo pendente; a exportação continua disponível.
4. Discutam os compromissos antes de marcá-los. Uma caixa desmarcada significa decisão ainda não registrada, não recusa da equipe.
5. Gerem um documento com o estado atual. Para continuar a ficha em outro momento, guardem também o rascunho JSON.

Não há salvamento automático, login, envio de respostas ou sincronização entre a aula e a ficha. Recarregar ou fechar a página pode perder o preenchimento. PDF e Markdown são registros para leitura; o JSON é o formato usado para reabrir a ficha. A aula tem seu próprio resultado e não importa esse rascunho.

## Duas rubricas, com finalidades diferentes

### Aula: XP de aprendizagem

| Missão | Conteúdo | Máximo |
| --- | --- | ---: |
| 1 | Reconhecer o risco de usar dados pessoais reais no teste | 20 XP |
| 2 | Entender o consentimento como uma das bases legais | 20 XP |
| 3 | Usar o mínimo necessário | 20 XP |
| 4 | Distinguir anonimização de pseudonimização | 20 XP |
| 5 | Registrar e verificar a proveniência | 20 XP |
| **Total** | **Cinco missões** | **100 XP** |

Cada resposta **atual** correta vale 20 XP. Resposta incorreta ou não respondida vale zero. Revisar uma escolha recalcula o resultado e pode diminuir os pontos; tentativas, visualização de telas e cronômetros não acumulam XP. “Todos respondidos” não significa “todos corretos”.

### Ficha: XP de preparação

A ficha tem **26 campos pontuáveis**, distribuídos em sete missões. Conta o registro de uma resposta, sem avaliar automaticamente sua qualidade. Uma dúvida concreta também pode ser registrada e discutida com o docente.

| Missão | Campos pontuáveis e pesos | Campos | Máximo |
| --- | --- | ---: | ---: |
| 1 · Informação | Informação, finalidade, fonte e acesso/local de guarda: 5 XP cada | 4 | 20 XP |
| 2 · Classificação | Identificação, sensibilidade e estratégia: 4 XP cada; minimização: 8 XP | 4 | 20 XP |
| 3 · Autorização | Validação a confirmar, informações ao participante e publicação: 5 XP cada | 3 | 15 XP |
| 4 · Proveniência | Data/versão, transformações/responsáveis/IA e restrições/guarda/descarte: 5 XP cada | 3 | 15 XP |
| 5 · Riscos | Para cada um dos dois riscos: descrição 3 XP, chance 1 XP, impacto 1 XP e mitigação 3 XP | 8 | 16 XP |
| 6 · Protocolo | Regra específica da equipe: 4 XP | 1 | 4 XP |
| 7 · Revisão | Ponto claro 3 XP, melhoria 3 XP e próxima ação 4 XP | 3 | 10 XP |
| **Total** | **19 campos de texto e sete seleções** | **26** | **100 XP** |

Texto vazio ou composto apenas por espaços vale zero. Seleções precisam corresponder às opções válidas. Identificação e oito compromissos não pontuam. O máximo permanece **100 XP**, mesmo que a ficha esteja parcial; os pesos dos campos respondidos não são redistribuídos.

Preencher todos os campos significa que os registros estão completos, com revisão docente pendente. XP não é nota oficial, validação jurídica ou autorização para coletar, usar ou publicar dados.

## Índice de risco

Cada risco usa **chance × impacto**, com cada fator de 1 a 3. O índice permanece pendente enquanto faltar um dos fatores.

| Índice | Prioridade didática |
| --- | --- |
| 1–2 | Baixa |
| 3–4 | Moderada |
| 6–9 | Alta |

Os resultados possíveis da multiplicação são 1, 2, 3, 4, 6 e 9. Esse índice é separado dos XP: atribuir risco baixo não melhora a pontuação e não autoriza a prática. Descrever o risco e propor mitigação continuam necessários para a discussão.

## Impressão, PDF e rascunho

Todos os formatos de entrega aceitam atividade vazia, parcial ou completa e preservam a pontuação atual sobre 100, os itens respondidos e as pendências.

| Ação | Resultado |
| --- | --- |
| Aula: **Gerar PDF** | Relatório das cinco missões, com perguntas, respostas atuais, comentários, XP e pendências. |
| Aula: **Imprimir** | Relatório do resultado atual. Em **Ajuda**, a opção **Imprimir aula completa + resultado** acrescenta o conteúdo das 24 telas. |
| Ficha: **Gerar PDF com pontuação** | Documento com identificação fornecida, respostas, rubrica, índice de risco e campos não respondidos. |
| Ficha: **Ver versão de impressão** | Prévia do documento atual; **Imprimir / salvar como PDF** abre a impressão do navegador. Voltar à ficha preserva o preenchimento. |
| Ficha: **Baixar texto Markdown** | Documento textual com respostas, pontuação e pendências. |
| Ficha: **Guardar rascunho JSON** | Dados para continuar depois; não é uma nota certificada. |

O atalho de impressão do navegador também prepara o relatório com os dados atuais. Na ficha, campos vazios aparecem como `[Não respondido]`; a aula distingue situações pendentes, corretas e a revisar.

O PDF direto contém texto selecionável e quebra o conteúdo em páginas. Seu conjunto de caracteres é WinAnsi. Quando há caracteres não suportados, como alguns símbolos ou alfabetos, a interface encaminha à impressão do navegador para preservar o texto e a pontuação. Na aula, é necessário acionar **Abrir impressão** no aviso; na ficha, é exibida a versão de impressão. O PDF direto não é um documento marcado conforme PDF/UA.

Para reabrir uma ficha, use um JSON desta atividade, de até 512 KB. O arquivo é validado antes da substituição e a interface pede confirmação. Um arquivo inválido preserva integralmente o preenchimento atual. Pontuação e índices de risco são recalculados pelas respostas; valores gravados no arquivo não são aceitos como resultado final. **Apagar o preenchimento** também pede confirmação e não apaga arquivos já baixados.

## Layout, navegação e acessibilidade

O modo apresentação usa uma área lógica de 1280 × 720. O cabeçalho e a barra de controles **ocupam espaço próprio**, e a escala considera a área restante. Os controles não flutuam sobre o conteúdo.

Com largura inferior a 1100 CSS px ou altura inferior a 680 CSS px, a aula ativa leitura contínua. Nesse modo, o conteúdo flui verticalmente, as colunas se reorganizam e a navegação permanece disponível. Também é possível escolher leitura contínua em telas maiores. A implementação pode recorrer a esse modo quando o conteúdo já não cabe adequadamente na apresentação.

A navegação inclui Anterior, Próximo, Índice, links para o conteúdo e foco visível. Os diálogos têm nome acessível. Atalhos de apresentação respeitam campos, controles e diálogos; não substituem suas teclas nativas. **Reiniciar** atua apenas sobre o slide atual. Cronômetros são opcionais e não influenciam XP.

O alvo de projeto é WCAG 2.2 nível AA. Os testes registrados cobrem estados e resoluções específicos, sem constituir certificação completa. Sem JavaScript, a aula continua legível; a ficha oferece o exemplo como referência para uma atividade em papel ou editor de texto. Missões, cálculos e geração de documentos dependem de JavaScript.

## Decisões pedagógicas e proteção de dados

Para esta atividade, a orientação é trabalhar com dados sintéticos ou indicadores agregados adequados ao contexto. O uso futuro de dados pessoais reais depende de procedimento institucional definido; a equipe não escolhe sozinha uma base legal nem recebe autorização por concluir a ficha.

Consentimento é uma das bases possíveis. Quando usado, deve ser livre, informado e inequívoco, com finalidade determinada e possibilidade de revogação facilitada. Crianças e adolescentes exigem consideração do melhor interesse e das condições aplicáveis ao caso.

Remover nomes não garante anonimização. Uma chave que permite relacionar códigos a pessoas caracteriza pseudonimização; combinações de atributos e grupos agregados pequenos também exigem avaliação. Uma fonte pública deve ser usada com atenção à finalidade, ao contexto e aos direitos envolvidos.

Na proveniência, registrem origem, data/versão, transformações, responsáveis pela verificação e restrições. A regra didática para apoio de IA é declarar ferramenta, data, finalidade e conferência, ou registrar que não foi usada. Não inventem evidência nem enviem dados pessoais ou narrativas não autorizadas à ferramenta.

Os dois casos distinguem evidência e simulação: Memórias usa uma referência histórica pública e um planejamento fictício de entrevista; Permanência usa dados sintéticos e uma situação fictícia de risco. A aula não realiza contato, gravação ou acesso a registros acadêmicos pessoais.

## Manutenção

Ao alterar uma rubrica, atualize sua definição em `MISSIONS`, a explicação exibida e esta documentação. Preserve o cálculo a partir das respostas atuais, o máximo fixo e a distinção entre XP, índice de risco e nota.

Os relatórios partem de `documentModel()` na aula e na ficha. Evite criar cálculos paralelos no PDF ou na impressão. Para mudanças em campos, mantenha a validação do rascunho coerente com as opções da interface e avalie a compatibilidade do esquema `ppi-f02-v1`.

Execute `npm run test:aula06` a partir da raiz, com as dependências e os navegadores de teste instalados. Procedimentos, resultados e verificações complementares estão no [registro da revisão](../../docs/aula06-revisao-2026-10-20.md).

## Referências oficiais

- [LGPD — Lei nº 13.709/2018, texto compilado](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm): conceitos, princípios, bases legais, consentimento e proteção de dados.
- [ANPD — Guia orientativo para fins acadêmicos e estudos/pesquisas](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-tratamento-de-dados-pessoais-para-fins-academicos-e-para-a-realizacao-de-estudos-e-pesquisas).
- [ANPD — Enunciado sobre dados de crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).
- [ANPD — Estudo técnico sobre anonimização](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/documentos-tecnicos-orientativos/estudo_tecnico_sobre_anonimizacao_de_dados_na_lgpd___analise_juridica.pdf/@@display-file/file).
- [W3C — PROV Overview](https://www.w3.org/TR/prov-overview/): referência conceitual para proveniência.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): referência de acessibilidade.
