# Aula 06 — Ética e Proteção de Dados

## Título oficial

**Ética e Proteção de Dados: Consentimento, Privacidade, LGPD e Proveniência**

## Escopo curricular

A aula corresponde ao encontro 6 da U2 (Processo, ética e elicitação) do plano de PPI I. O conteúdo previsto é: ética, consentimento, privacidade, LGPD, dados sintéticos/anonimizados e proveniência. O produto previsto é **protocolo ético e matriz de riscos**.

## Arquivos

- `index.html` — apresentação interativa, 24 telas (20 da aula + 4 de consulta).
- `aula.css` — canvas lógico 1280 × 720 e modo leitura responsivo.
- `aula.js` — navegação, quiz, casos por projeto, matriz didática, cronômetros e diálogos.
- `Ficha_Equipe_Aula_06_PPI.html` — formulário coletivo.
- `ficha.css` e `ficha.js` — interface, dicas por projeto, matriz de riscos e exportações.
- `atividade-pdf.js` — gerador local de PDF formal.
- `exemplo-preenchido.html` — exemplo completo usando Horários IFMA.

## Decisões didáticas

A aula não pede que estudantes determinem uma base legal ou emitam juízo de conformidade com a LGPD. Ela ensina perguntas operacionais adequadas ao ensino médio: necessidade, identificação, sensibilidade, autorização e proveniência.

A regra operacional é conservadora: não acessar, copiar, coletar ou publicar dados pessoais reais por conta própria. Para protótipos e testes, preferir dados sintéticos ou agregados; atividades com dados reais dependem de procedimento definido pelo professor e pela instituição.

Consentimento é apresentado como uma das possibilidades previstas na LGPD, não como sinônimo de conformidade. Para crianças e adolescentes, a aula destaca o princípio do melhor interesse e evita coleta real.

A matriz 3 × 3 (chance × impacto) é apenas ferramenta didática de priorização. A pontuação não decide se uma prática é legal ou autorizada.

## Casos dos projetos

### Mapa de Memórias Quilombolas

Usa como base histórica a página pública do MuseusBr sobre a Associação de Mulheres de Itamatatiua, fundada em 1989. A eventual entrevista é **planejamento fictício**; ninguém é contatado ou gravado na aula.

### Permanência e Evasão Escolar

Usa dados sintéticos para teste e uma situação de risco fictícia envolvendo planilha real. A turma não acessa registros pessoais acadêmicos.

## Escala de projeção

O canvas lógico permanece 1280 × 720. Diferentemente da implementação anterior da Aula 05, os controles de apresentação são flutuantes e não reduzem a altura útil da viewport. A escala considera praticamente toda a tela, melhorando a legibilidade em 720p. Em telas estreitas, o modo leitura é ativado automaticamente.

## Fontes oficiais

- Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- ANPD — Guia orientativo sobre tratamento de dados para fins acadêmicos e estudos/pesquisas: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-tratamento-de-dados-pessoais-para-fins-academicos-e-para-a-realizacao-de-estudos-e-pesquisas
- ANPD — Enunciado sobre tratamento de dados de crianças e adolescentes: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes
- MuseusBr — Associação de Mulheres de Itamatatiua: https://cadastro.museus.gov.br/pontos-de-memoria/associacao-de-mulheres-de-itamatatiua/

## Gate de qualidade

- 24 slides, sendo 20 no tempo de 50 minutos e 4 para consulta.
- Uma ficha por equipe.
- Dicas específicas para Memórias e Permanência.
- Sem salvamento automático, login ou envio de respostas.
- Exportação local em PDF formal, Markdown e rascunho JSON.
- Nenhum exemplo autoriza coleta externa.
- Fonte, simulação e limites identificados explicitamente.
