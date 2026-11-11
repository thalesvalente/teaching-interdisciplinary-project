# Aula 08 — pedido, implementação e critério verificável

| Exigência | Implementação | Verificação |
| --- | --- | --- |
| 22–30 telas, 50 minutos | 26 telas em `content.js`; roteiro em `aula08-pedagogia.md` | IDs únicos; contagem; sequência docente 5/10/20/10/5 min |
| Explicação antes e entre desafios | 17 telas de conceitos/exemplos, seis missões, catálogo/revisão/ticket | Revisão pedagógica independente; conteúdo não reduzido a quizzes |
| Registro → achado/evidência → necessidade → requisito → critério → rastro | Telas 04–06, 08–09, 18, 21–23 | Questões M1/M2/M5/M6 e matriz pergunta–objetivo–evidência–critério |
| RF, RNF, dados, regras e qualidade | Telas 11–17; seis atributos, condição/carga/métrica/limite | M3/M4, catálogo RF/RNF/RD e gabaritos comentados |
| Seis missões, 100 XP | Pesos 10/15/20/15/20/20; 17 questões/trilha | Pontuação recalculada; repetição não duplica; reset isolado |
| Duas trilhas contextualizadas | Memórias e Permanência com 34 enunciados, registros e exemplos próprios | Percursos isolados, ida/volta, catálogo/ticket sem mistura |
| Respostas abertas sem correção semântica | Catálogo local, checklist declaratório e ticket | Campos/autoavaliação não geram XP; avaliação docente pendente |
| Domínios distintos | `training`, `completeness`, `teacher_assessment`, `official_grade` | Schema2020-12, testes de corrupção e valores null/pendente |
| Produto do aluno | 1 RF, 1 RNF verificável, 1 RD com fonte/situação/aceite/prioridade | Exportações vazias, parciais, preenchidas e impressão |
| Segurança e ética | Dados integralmente sintéticos, sem identificação compulsória | Nenhum nome/matrícula obrigatório; nenhum request externo/submissão |
| WCAG 2.2 AA como meta | Semântica, foco, teclado, feedback textual, contraste, reflow | axe, teclado, contraste real,320px,preferências de movimento/cores |
| Projeção e celular | Canvas16:9 + leitura automática abaixo900px | 1280×720,1280×650,390×844,320×568; todas26telas |
| Nenhuma dependência externa em runtime | Cinco arquivos HTML/CSS/JS locais, sem fetch/CDN | file://, retirada/bloqueio de rede, ausência de POST/telemetria |
| Estado local com falhas tratadas | Validação estrita, salvamento por edição, preservação do corrompido | Reload imediato; quota indisponível; JSON inválido não sobrescrito |
| Síntese voluntária segura | Blob JSON; impressão DOM por `textContent` | Dados hostis permanecem texto; impressão não muda estado |
| Futuro Laboratório Vivo | `contracts/ppi-aula08-v1.schema.json` + exemplos e guia de consumo | Ajv2020 em testes; gabarito versionado; nenhuma integração remota |
| Preservar aulas anteriores | Somente arquivos novos + portal/README/dependências/teste novo | Diff e comparação byte-exata dos cartões 01–07 |
| Replanejamento sem aprovação institucional | Registro pedagógico explícito em docs e notas docente | Plano fornecido inalterado; ausência de alegação de aplicação da Aula07 |
| Publicar apenas após gates | Branch, revisão independente, PR/CI, merge com SHA esperado | Recibos e readback de Pages, sem bypass/force |

## Normas e alcance

ISO/IEC/IEEE 29148:2018 orienta conceitualmente a passagem de necessidades a requisitos e a rastreabilidade. ISO/IEC 25010:2023 apoia a especificação de propriedades de qualidade. WCAG2.2 fornece critérios testáveis para a interface. Os catálogos oficiais foram consultados; esta aula não é certificação normativa e não reproduz o texto integral das normas.

A separação didática RF/RNF/RD/RN organiza a aprendizagem. Requisitos de dados não são apresentados como taxonomia exclusiva imposta pela ISO. Condições de desempenho são metas fictícias para o exercício, não medições de um protótipo real. Proteção/acesso são testados em condições delimitadas, sem promessa absoluta de segurança.

Os perfis de ciclo de vida são aplicados à execução rastreável e ao controle de mudança, em escopo educacional proporcional. Não se declara auditoria integral de ISO12207,15288,42010,25012 ou27002.

## Mudanças de método durante a execução

- As duas referências de Google Slides eram arquivos PPTX no Drive. Foram lidas pelo conector apropriado, sem conversão/edição do original.
- A máquina local não permitiu instalação global de bibliotecas do WebKit. O QA extraiu pacotes oficiais verificados em prefixo temporário de usuário; a aplicação não depende deles e a CI instala normalmente.
- O WebKit do Playwright não navega em `file://` com seu mock `offline:true`, inclusive com HTML mínimo. O teste local deste motor usa bloqueio de todas as rotas HTTP(S); Chromium/Firefox usam `offline:true`. A técnica fica registrada, sem equiparar resultados não executados.
- A inspeção independente detectou transbordamentos de alternativas/rodapé. A correção ajustou composição de questões e retirou o rodapé interno redundante do modo projetor, preservando fonte das alternativas e controles principais.

Consulte os relatórios de QA e execução para resultados finais; a existência desta matriz não substitui as evidências.
