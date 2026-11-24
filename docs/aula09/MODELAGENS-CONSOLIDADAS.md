# PPI I — Modelagens consolidadas dos projetos integradores

**IFMA · Campus Itapecuru-Mirim · Técnico em Informática integrado ao Ensino Médio**  
**Versão 1.5 · 24/11/2026 · Referência docente para preparação da Aula 09**

## 1. Finalidade e decisões consolidadas

Este documento consolida os dois modelos discutidos para Prática Profissional Integrada I. Eles servem de base para retomar as atividades de investigação, elicitação e requisitos, estudar modelagem de dados e preparar a avaliação prática.

| Projeto | Objeto central | Questões que o modelo permite investigar |
|---|---|---|
| EDA — Evasão e Permanência Estudantil | Trajetória acadêmica do estudante em um campus | Matrículas, permanência, evasão, notas e frequência por turma, ano curricular, curso e disciplina |
| Mapa de Memórias Quilombolas | Pontos geográficos que reúnem relatos de memória | Localização, história, temas, fontes e mídias de cada relato |

Decisões acordadas:

- O EDA começa no campus e representa a estrutura acadêmica que os estudantes conhecem. O estudante se vincula à turma por sua matrícula anual. Seus resultados por disciplina ficam registrados em Desempenho.
- Memórias começa na comunidade. Cada comunidade pode conter vários pontos de memória, e cada ponto pode reunir histórias de épocas e temas diferentes. Latitude e longitude pertencem ao ponto. Período histórico e temas pertencem ao relato.
- Os dois modelos têm oito entidades. A documentação textual e os diagramas Mermaid podem ser mantidos no próprio projeto Git.
- A aula posterior poderá partir dos modelos e dados fornecidos, com análise, perguntas e revisão assistida por IA. As equipes retomam seus requisitos anteriores para explicar e validar decisões de modelagem.

Os diagramas detalham os modelos conceituais com atributos e chaves, deixando explícita uma possível estrutura lógica relacional. Os nomes técnicos, identificadores, domínios ilustrativos e exemplos abaixo são decisões de documentação para tornar o modelo verificável. As regras operacionais do campus e das comunidades exigem validação com as partes interessadas autorizadas.

## 2. Como ler os diagramas

| Elemento | Significado |
|---|---|
| Entidade | Tipo de objeto ou registro sobre o qual se deseja armazenar dados. |
| Atributo | Informação de uma entidade, como o nome de um curso. |
| PK (chave primária) | Identificador único de um registro. |
| FK (chave estrangeira) | Identificador que aponta para um registro de outra entidade. |
| Duas barras | Exatamente um registro associado. |
| Círculo e pé de galinha | Zero ou vários registros associados. |
| Barra e pé de galinha | Um ou vários registros associados. |
| Entidade associativa | Representa uma relação entre dois registros, podendo guardar informações dessa relação. |
| Linha contínua | Relação identificadora, quando a chave do registro relacionado inclui a chave da entidade de origem. |
| Linha tracejada | Relação em que o registro relacionado possui uma chave primária própria. |

Uma chave composta usa dois atributos em conjunto para identificar unicamente um registro.

## 3. EDA — Evasão e Permanência Estudantil

### 3.1. Contexto e escopo

O modelo representa a organização acadêmica de cursos técnicos integrados, com anos curriculares e turmas em anos letivos específicos. Cada ano curricular possui seu conjunto de disciplinas. A matrícula associa um estudante à turma e registra sua situação naquele ano. O desempenho registra os resultados do estudante nas disciplinas previstas para o ano curricular de sua turma.

**Ano curricular** indica a etapa na estrutura do curso, como o primeiro ou o segundo ano. **Ano letivo** indica o calendário em que a turma funciona, como 2025 ou 2026. Um estudante pode ter matrículas em turmas distintas ao longo de sua trajetória.

### 3.2. Diagrama entidade-relacionamento

```mermaid
erDiagram
    CAMPUS ||..o{ CURSO : oferece
    CURSO ||..|{ ANO_CURRICULAR : possui
    ANO_CURRICULAR ||..|{ DISCIPLINA : contempla
    ANO_CURRICULAR ||..o{ TURMA : referencia
    TURMA ||..o{ MATRICULA : recebe
    ESTUDANTE ||..o{ MATRICULA : possui
    MATRICULA ||--o{ DESEMPENHO : registra
    DISCIPLINA ||--o{ DESEMPENHO : recebe_resultados

    CAMPUS {
        string id PK
        string nome
    }
    CURSO {
        string id PK
        string campus_id FK
        string nome
    }
    ANO_CURRICULAR {
        string id PK
        string curso_id FK
        int numero
    }
    DISCIPLINA {
        string id PK
        string ano_curricular_id FK
        string nome
        int carga_horaria
    }
    TURMA {
        string id PK
        string ano_curricular_id FK
        string codigo
        int ano_letivo
    }
    ESTUDANTE {
        string id PK
    }
    MATRICULA {
        string id PK
        string estudante_id FK
        string turma_id FK
        string situacao
    }
    DESEMPENHO {
        string matricula_id PK, FK
        string disciplina_id PK, FK
        float nota
        float frequencia_pct
        string situacao_disciplina
    }
```

### 3.3. Dicionário de dados

| Entidade | Finalidade | Atributos e domínio |
|---|---|---|
| CAMPUS | Unidade de ensino | `id`, identificador; `nome`, texto. |
| CURSO | Curso oferecido pelo campus | `id`; `campus_id`; `nome`, texto. |
| ANO_CURRICULAR | Etapa curricular de um curso | `id`; `curso_id`; `numero`, inteiro positivo. |
| DISCIPLINA | Componente previsto no ano curricular de um curso | `id`; `ano_curricular_id`; `nome`, texto; `carga_horaria`, inteiro positivo em horas-aula, quando informada. |
| TURMA | Grupo de estudantes de um ano curricular em um ano letivo | `id`; `ano_curricular_id`; `codigo`, texto; `ano_letivo`, inteiro. |
| ESTUDANTE | Identidade persistente do estudante | `id`, código sintético que permite acompanhar a trajetória em diferentes matrículas. |
| MATRICULA | Vínculo anual do estudante à turma | `id`; `estudante_id`; `turma_id`; `situacao`, estado da matrícula no recorte analisado. |
| DESEMPENHO | Resultado de uma matrícula em uma disciplina | `matricula_id` + `disciplina_id`, chave primária composta; `nota`, decimal; `frequencia_pct`, percentual de 0 a 100; `situacao_disciplina`, situação acadêmica de exemplo. |

### 3.4. Relacionamentos e regras

| Relacionamento | Regra de modelagem |
|---|---|
| Campus – Curso | Um campus pode oferecer vários cursos. Cada curso do cadastro pertence a um campus. |
| Curso – Ano curricular | Cada curso possui um ou mais anos curriculares. Cada ano curricular pertence a um curso. |
| Ano curricular – Disciplina | Cada ano curricular possui um ou mais componentes curriculares. Cada registro de disciplina refere-se àquele ano curricular. A mesma disciplina nominal pode aparecer em outros anos ou cursos. |
| Ano curricular – Turma | Uma etapa curricular pode ter turmas em diferentes anos letivos e mais de uma turma no mesmo ano. Cada turma referencia uma etapa. |
| Turma – Matrícula | Uma turma pode receber várias matrículas. Cada matrícula pertence a uma turma. |
| Estudante – Matrícula | Um estudante pode realizar diversas matrículas ao longo de sua trajetória. Cada matrícula pertence a um estudante. |
| Matrícula – Desempenho | Cada matrícula pode ter registros de desempenho em diversas disciplinas. |
| Disciplina – Desempenho | Uma disciplina pode receber resultados de diversas matrículas. Cada desempenho referencia uma disciplina e uma matrícula. |

Regras de integridade e recorte:

1. A combinação `curso_id + numero` identifica uma etapa curricular sem duplicidade.
2. A combinação `ano_curricular_id + ano_letivo + codigo` distingue turmas.
3. A combinação `estudante_id + turma_id` identifica um vínculo único no exercício.
4. A combinação `matricula_id + disciplina_id` é única em Desempenho. O vínculo representa um resultado consolidado por disciplina no recorte anual.
5. O ano curricular da disciplina no Desempenho deve coincidir com o ano curricular da turma da Matrícula. Essa condição adicional deve ser conferida na validação do modelo.
6. As notas de exemplo usam a escala de 0 a 10. A frequência usa percentuais de 0 a 100. Dados ausentes permanecem desconhecidos.
7. As situações ilustrativas da matrícula são CURSANDO, CONCLUIU_ANO e EVASAO. A situação da disciplina pode ser EM_ANDAMENTO, APROVADO, REPROVADO ou SEM_RESULTADO_FINAL. As situações vêm do registro acadêmico de referência. Nota ou frequência isoladas não determinam evasão.
8. A estrutura contempla a turma regular do ensino médio integrado. Dependências, mudanças de matriz, equivalências, transferências e notas por etapa poderão ser detalhadas caso os requisitos indiquem essa necessidade.

O vínculo com as disciplinas segue o caminho Estudante → Matrícula → Turma → Ano curricular → Disciplina. Para conhecer o resultado individual de uma disciplina, consultam-se Matrícula e Disciplina por meio de Desempenho.

### 3.5. Dados fictícios para compreender e verificar o modelo

O conjunto abaixo é um novo cenário sintético, construído para a modelagem consolidada. Os nomes de cursos e as disciplinas funcionam como exemplos didáticos. Os registros, cargas horárias, trajetórias e notas são inventados. As listas de componentes são recortes ilustrativos, com duração de curso e matrizes sem pretensão de reproduzir o PPC oficial.

#### CAMPUS

| id | nome |
|---|---|
| C01 | Itapecuru-Mirim |

#### CURSO

| id | campus_id | nome |
|---|---|---|
| CU01 | C01 | Técnico em Informática |
| CU02 | C01 | Técnico em Meio Ambiente |

#### ANO_CURRICULAR

| id | curso_id | numero |
|---|---|---:|
| AC01 | CU01 | 1 |
| AC02 | CU01 | 2 |
| AC03 | CU01 | 3 |
| AC04 | CU02 | 1 |
| AC05 | CU02 | 2 |
| AC06 | CU02 | 3 |

#### DISCIPLINA

| id | ano_curricular_id | nome | carga_horaria |
|---|---|---|---:|
| D01 | AC01 | Matemática | 80 |
| D02 | AC02 | Arte | 40 |
| D03 | AC02 | Biologia | 80 |
| D04 | AC02 | História | 80 |
| D05 | AC02 | Banco de Dados | 80 |
| D06 | AC03 | Redes de Computadores | 80 |
| D07 | AC04 | Geografia | 80 |
| D08 | AC05 | Biologia | 80 |
| D09 | AC05 | Educação Ambiental | 80 |
| D10 | AC06 | Gestão Ambiental | 80 |

#### TURMA

| id | ano_curricular_id | codigo | ano_letivo |
|---|---|---|---:|
| TU01 | AC01 | INFO-1A | 2025 |
| TU02 | AC02 | INFO-2A | 2026 |
| TU03 | AC05 | MA-2A | 2026 |

#### ESTUDANTE

| id |
|---|
| EST001 |
| EST002 |
| EST003 |
| EST004 |
| EST005 |

#### MATRICULA

| id | estudante_id | turma_id | situacao |
|---|---|---|---|
| M001 | EST001 | TU01 | CONCLUIU_ANO |
| M002 | EST002 | TU01 | CONCLUIU_ANO |
| M003 | EST001 | TU02 | CURSANDO |
| M004 | EST002 | TU02 | EVASAO |
| M005 | EST003 | TU02 | CURSANDO |
| M006 | EST004 | TU03 | CURSANDO |
| M007 | EST005 | TU03 | CURSANDO |

#### DESEMPENHO

| matricula_id | disciplina_id | nota | frequencia_pct | situacao_disciplina |
|---|---|---:|---:|---|
| M001 | D01 | 8.0 | 96 | APROVADO |
| M002 | D01 | 7.0 | 92 | APROVADO |
| M003 | D02 | 8.5 | 95 | EM_ANDAMENTO |
| M003 | D03 | 7.0 | 85 | EM_ANDAMENTO |
| M003 | D04 | 5.0 | 78 | EM_ANDAMENTO |
| M003 | D05 | 9.0 | 98 | EM_ANDAMENTO |
| M004 | D02 | 6.0 | 70 | SEM_RESULTADO_FINAL |
| M004 | D03 | 4.0 | 60 | SEM_RESULTADO_FINAL |
| M004 | D04 | 5.0 | 65 | SEM_RESULTADO_FINAL |
| M004 | D05 | 3.0 | 55 | SEM_RESULTADO_FINAL |
| M005 | D02 | 9.0 | 98 | EM_ANDAMENTO |
| M005 | D03 | 8.0 | 94 | EM_ANDAMENTO |
| M005 | D04 | 7.5 | 90 | EM_ANDAMENTO |
| M005 | D05 | 8.5 | 96 | EM_ANDAMENTO |
| M006 | D08 | 8.0 | 93 | EM_ANDAMENTO |
| M006 | D09 | 9.0 | 97 | EM_ANDAMENTO |
| M007 | D08 | 6.0 | 82 | EM_ANDAMENTO |
| M007 | D09 | 7.0 | 87 | EM_ANDAMENTO |

Para M004, os resultados refletem os registros disponíveis antes da evasão. SEM_RESULTADO_FINAL indica ausência de resultado final por disciplina no recorte.

### 3.6. Consultas de referência e resultados esperados

| Pergunta | Caminho ou operação | Resultado na base fictícia |
|---|---|---|
| Quais disciplinas são previstas para TU02? | Turma → Ano curricular → Disciplina | Arte, Biologia, História e Banco de Dados. |
| Quais resultados EST001 possui em 2026? | Estudante → Matrícula M003 → Desempenho → Disciplina | Arte 8,5/95%; Biologia 7,0/85%; História 5,0/78%; Banco de Dados 9,0/98%. |
| Qual foi a trajetória de EST002? | Estudante → Matrículas → Turmas → Anos curriculares | 1º ano de Informática concluído em 2025; matrícula no 2º ano em 2026 com situação EVASAO. |
| Quantas matrículas de evasão aparecem em 2026 por curso? | Matrícula → Turma → Ano curricular → Curso; filtro por ano e situação | Informática 1; Meio Ambiente 0. |
| Qual matrícula de TU02 tem frequência inferior a 75% em Banco de Dados? | Turma → Matrícula → Desempenho com D05; frequência < 75 | M004 (55%). O limite é apenas um filtro de exemplo. |
| Seria válido registrar D09 para M003? | Comparar os anos curriculares da turma e da disciplina | Inválido. M003 está em AC02 e D09 pertence a AC05. |

Os exemplos permitem investigar associações entre situação de matrícula e desempenho. A base didática pequena não sustenta conclusões causais, estatísticas institucionais ou inferências sobre um estudante real.

## 4. Mapa de Memórias Quilombolas

### 4.1. Contexto e escopo

O projeto organiza memórias de comunidades por pontos de interesse histórico ou cultural. Cada **Ponto de Memória** representa um lugar geográfico, com nome, descrição, latitude e longitude. Cada **Relato** representa uma história, acontecimento ou tradição associada ao ponto.

O ponto é compartilhado por relatos que podem tratar de épocas e temas diferentes. O relato possui seu período histórico e a data em que foi registrado. Temas classificam relatos. Fontes sustentam as informações de cada relato e mídias complementam sua documentação.

### 4.2. Diagrama entidade-relacionamento

```mermaid
erDiagram
    COMUNIDADE ||..o{ PONTO_MEMORIA : possui
    PONTO_MEMORIA ||..o{ RELATO : reune
    RELATO ||--|{ RELATO_TEMA : possui
    TEMA ||--o{ RELATO_TEMA : classifica
    RELATO ||--o{ RELATO_FONTE : utiliza
    FONTE ||--o{ RELATO_FONTE : fundamenta
    RELATO ||..o{ MIDIA : contem

    COMUNIDADE {
        string id PK
        string nome
        string descricao
    }
    PONTO_MEMORIA {
        string id PK
        string comunidade_id FK
        string nome
        string descricao
        float latitude
        float longitude
    }
    RELATO {
        string id PK
        string ponto_memoria_id FK
        string titulo
        string conteudo
        string periodo_historico
        int ano_inicial
        int ano_final
        date data_registro
        string situacao_revisao
        boolean publicacao_autorizada
    }
    TEMA {
        string id PK
        string nome
        string descricao
    }
    RELATO_TEMA {
        string relato_id PK, FK
        string tema_id PK, FK
    }
    FONTE {
        string id PK
        string tipo
        string descricao
    }
    RELATO_FONTE {
        string relato_id PK, FK
        string fonte_id PK, FK
    }
    MIDIA {
        string id PK
        string relato_id FK
        string tipo
        string endereco_arquivo
        string descricao
        boolean publicacao_autorizada
    }
```

### 4.3. Dicionário de dados

| Entidade | Finalidade | Atributos e domínio |
|---|---|---|
| COMUNIDADE | Identifica a comunidade a que pertencem os pontos de memória. | `id`; `nome`; `descricao`. |
| PONTO_MEMORIA | Identifica o lugar de referência dos relatos. | `id`; `comunidade_id`; `nome`; `descricao`; `latitude` e `longitude`, coordenadas decimais. |
| RELATO | Registra uma história, prática, acontecimento ou tradição. | `id`; `ponto_memoria_id`; `titulo`; `conteudo`; `periodo_historico`, texto; `ano_inicial` e `ano_final`, inteiros opcionais; `data_registro`, data; `situacao_revisao`, estado; `publicacao_autorizada`, booleano. |
| TEMA | Categoria temática reutilizável. | `id`; `nome`; `descricao`. |
| RELATO_TEMA | Vincula um relato a um tema. | `relato_id` + `tema_id`, chave primária composta. |
| FONTE | Identifica a origem documental ou oral da informação. | `id`; `tipo`, como entrevista ou documento; `descricao`. |
| RELATO_FONTE | Vincula um relato a uma fonte utilizada. | `relato_id` + `fonte_id`, chave primária composta. |
| MIDIA | Recurso que documenta ou ilustra o relato. | `id`; `relato_id`; `tipo`, como fotografia, áudio ou vídeo; `endereco_arquivo`, referência; `descricao`; `publicacao_autorizada`, booleano. |

### 4.4. Relacionamentos e regras

| Relacionamento | Regra de modelagem |
|---|---|
| Comunidade – Ponto de memória | Uma comunidade pode possuir vários pontos. Cada ponto pertence a uma comunidade. |
| Ponto de memória – Relato | Um ponto pode reunir vários relatos de períodos e temas distintos. Cada relato tem um ponto de referência. |
| Relato – Tema | Cada relato possui um ou mais temas. Um tema pode classificar vários relatos. Relato-Tema representa a associação. |
| Relato – Fonte | Um relato pode utilizar várias fontes. Uma fonte pode fundamentar vários relatos. Relato-Fonte representa a associação. |
| Relato – Mídia | Um relato pode possuir diversas mídias. Cada mídia vinculada no exercício pertence a um relato. |

Regras de integridade e recorte:

1. Latitude e longitude ficam no Ponto de Memória. A latitude está entre −90 e 90, e a longitude entre −180 e 180. Os dois valores precisam ser informados em conjunto para representar um ponto no mapa.
2. O período histórico descreve o tempo da história narrada. Os anos inicial e final são opcionais e permitem ordenar ou filtrar a linha do tempo. Quando ambos existem, o inicial deve ser menor ou igual ao final. A expressão textual preserva a incerteza e a forma como o relato data o acontecimento.
3. A data de registro refere-se ao momento da documentação da história. Um relato registrado em 2026 pode descrever um fato de 1975.
4. A combinação `relato_id + tema_id` é única. A combinação `relato_id + fonte_id` também é única.
5. O cadastro pode conter relatos em revisão e sem fonte documentada. Para a publicação simulada, exige-se revisão concluída, ao menos uma fonte e autorização de publicação. Uma mídia exibida publicamente também precisa estar autorizada. As autorizações representam decisões didáticas explícitas e não substituem consentimentos reais.
6. O recorte utiliza um ponto de referência por relato, podendo ampliar a associação a múltiplos pontos caso os requisitos futuros o justifiquem.

### 4.5. Dados fictícios para compreender e verificar o modelo

Este é um novo conjunto sintético, ampliando o exemplo de temas, registros e revisão da Aula 08. Comunidades, pontos, histórias, datas, coordenadas, fontes e mídias são inventados para o exercício. As coordenadas são valores ilustrativos e não identificam a localização de comunidades reais. As referências de mídia representam arquivos hipotéticos.

#### COMUNIDADE

| id | nome | descricao |
|---|---|---|
| CO01 | Comunidade A | Comunidade fictícia do exercício. |
| CO02 | Comunidade B | Comunidade fictícia do exercício. |

#### PONTO_MEMORIA

| id | comunidade_id | nome | descricao | latitude | longitude |
|---|---|---|---|---:|---:|
| P01 | CO01 | Casa de farinha | Local de trabalho comunitário. | -3.390 | -44.350 |
| P02 | CO01 | Praça comunitária | Ponto de encontro e festividades. | -3.392 | -44.352 |
| P03 | CO02 | Caminho antigo | Lugar associado a memórias de circulação. | -3.410 | -44.370 |

#### RELATO

| id | ponto_memoria_id | titulo | conteudo | periodo_historico | ano_inicial | ano_final | data_registro | situacao_revisao | publicacao_autorizada |
|---|---|---|---|---|---:|---:|---|---|---|
| REL01 | P01 | Construção da casa de farinha | História fictícia da construção coletiva. | Década de 1970 | 1970 | 1979 | 2026-08-12 | REVISADO | SIM |
| REL02 | P01 | Tradição da produção de farinha | História fictícia do trabalho e dos saberes transmitidos. | Década de 1980 | 1980 | 1989 | 2026-08-19 | REVISADO | SIM |
| REL03 | P01 | Festa dos produtores de farinha | História fictícia de uma celebração. | 2025 | 2025 | 2025 | 2026-08-26 | EM_REVISAO | NAO |
| REL04 | P02 | Festa tradicional na praça | História fictícia de uma festividade comunitária. | 1995 | 1995 | 1995 | 2026-09-02 | REVISADO | SIM |
| REL05 | P03 | Histórias do caminho antigo | Narrativa fictícia sobre um trajeto de uso comunitário. | Antigamente, sem ano confirmado | — | — | 2026-09-09 | EM_REVISAO | NAO |

#### TEMA

| id | nome | descricao |
|---|---|---|
| T01 | História | Acontecimentos e transformações do passado. |
| T02 | Trabalho | Práticas de trabalho e produção. |
| T03 | Tradição | Saberes e práticas transmitidos entre gerações. |
| T04 | Festa | Celebrações e festividades. |
| T05 | Paisagem | Lugares e caminhos associados à memória. |

#### RELATO_TEMA

| relato_id | tema_id |
|---|---|
| REL01 | T01 |
| REL01 | T02 |
| REL02 | T02 |
| REL02 | T03 |
| REL03 | T03 |
| REL03 | T04 |
| REL04 | T04 |
| REL04 | T03 |
| REL05 | T01 |
| REL05 | T05 |

#### FONTE

| id | tipo | descricao |
|---|---|---|
| F01 | Entrevista | Entrevista fictícia A. |
| F02 | Documento | Documento histórico fictício A. |
| F03 | Entrevista | Entrevista fictícia B. |

#### RELATO_FONTE

| relato_id | fonte_id |
|---|---|
| REL01 | F01 |
| REL01 | F02 |
| REL02 | F01 |
| REL03 | F03 |
| REL04 | F03 |

#### MIDIA

| id | relato_id | tipo | endereco_arquivo | descricao | publicacao_autorizada |
|---|---|---|---|---|---|
| MD01 | REL01 | Fotografia | arquivos/foto-a.jpg | Fotografia fictícia da casa de farinha. | SIM |
| MD02 | REL01 | Áudio | arquivos/audio-a.mp3 | Gravação fictícia sobre a construção. | NAO |
| MD03 | REL02 | Fotografia | arquivos/foto-b.jpg | Fotografia fictícia sobre a produção. | SIM |
| MD04 | REL03 | Vídeo | arquivos/video-a.mp4 | Gravação fictícia da festa. | NAO |
| MD05 | REL04 | Fotografia | arquivos/foto-c.jpg | Fotografia fictícia da praça. | SIM |

### 4.6. Consultas de referência e resultados esperados

| Pergunta | Caminho ou operação | Resultado na base fictícia |
|---|---|---|
| Quantos pontos de memória CO01 possui? | Comunidade → Ponto de Memória | 2: P01 e P02. |
| Quais relatos estão associados à casa de farinha? | Ponto de Memória P01 → Relato | REL01, REL02 e REL03. As coordenadas são as mesmas para os três relatos. |
| Quais relatos tratam de trabalho? | Tema T02 → Relato-Tema → Relato | REL01 e REL02. |
| Quais relatos utilizam a entrevista F01? | Fonte F01 → Relato-Fonte → Relato | REL01 e REL02. |
| Quais fontes fundamentam REL01? | Relato → Relato-Fonte → Fonte | F01 e F02. |
| Quais são os relatos de P01 em ordem histórica? | Relato; ordenar por década ou ano inicial | REL01 (1970–1979), REL02 (1980–1989), REL03 (2025). |
| Quais relatos podem aparecer no mapa público simulado? | Revisão concluída, autorização e pelo menos uma fonte | REL01, REL02 e REL04. |
| Quais mídias de REL01 podem aparecer na consulta pública simulada? | Relato REL01 → Mídia com autorização | MD01. MD02 permanece disponível apenas no acervo interno simulado. |

## 5. Relação entre os dois modelos

| Aspecto | EDA | Memórias |
|---|---|---|
| Estrutura do domínio | Campus, curso, ano curricular e turma | Comunidade e ponto de memória |
| Registro central | Matrícula anual do estudante | Relato histórico ou cultural |
| Relações entre múltiplos registros | Desempenho une Matrícula e Disciplina e armazena resultados da associação. | Relato-Tema e Relato-Fonte unem relatos a categorias e fontes reutilizáveis. |
| Dimensão temporal | Ano letivo da turma | Período histórico e data de registro do relato |
| Dimensão geográfica | Campus como recorte institucional | Latitude e longitude do ponto de memória |
| Consulta demonstrável | Trajetória acadêmica e resultados por disciplina | Mapa, linha do tempo e acervo documental |

## 6. Estudo dirigido e Laboratório Vivo da Aula 09

**Tema:** Do requisito ao modelo de dados — interpretação, exploração e evolução com IA.

[Abrir estudo dirigido e atividade avaliativa](https://thalesvalente.github.io/teaching-interdisciplinary-project/lessons/aula-09-do-requisito-ao-modelo/laboratorio.html?v=1.4).

O professor apresenta os modelos pela primeira vez nesta aula. Cada missão começa com conceitos em linguagem acessível, um exemplo do próprio projeto, exploração em etapas de recortes das tabelas fictícias deste documento e uma pergunta de debate com explicação consultável. Após essa exploração, os estudantes respondem quatro questões objetivas e recebem feedback imediato.

### Roteiro de 50 minutos

| Minutos | Etapa | Produto |
|---|---|---|
| 0–3 | Identificar a equipe e recuperar um requisito das atividades anteriores. | Trilha, matrículas dos integrantes e requisito de referência. |
| 3–15 | Missão 1 — entidades, atributos, PK, FK e cardinalidades. | Leitura inicial e quatro respostas. |
| 15–25 | Missão 2 — acompanhar um caminho entre tabelas com registros fictícios. | Interpretação de resultados e quatro respostas. |
| 25–35 | Missão 3 — detectar referências incoerentes e conferir regras de integridade. | Debate orientado e quatro respostas. |
| 35–47 | Missão 4 — entender a evolução do DER com um novo requisito, consultar o prompt de IA, escolher chaves e cardinalidades e comparar o trecho Mermaid de referência. | Quatro decisões sobre a alteração do modelo. |
| 47–50 | Conferir o resumo e gerar o PDF por equipe. | Comprovante da atividade. |

### Exploração guiada em cada questão

As 32 questões das duas trilhas possuem recortes visuais do modelo, cartões de entidades com atributos e marcas PK/FK, tabelas com registros relevantes e situações simuladas identificadas. O estudante examina os dados na própria pergunta. As pistas progressivas ensinam o caminho de raciocínio e podem ser consultadas antes da resposta. Quando uma tentativa é incorreta, a atividade apresenta uma pista adicional e permite revisar a resposta.

### Sinalização visual dos conceitos

O estudo dirigido aplica o **princípio da sinalização** (ou *cueing*) da aprendizagem multimídia. Palavras-chave como entidade, atributo, chave primária, chave estrangeira, cardinalidade e integridade referencial recebem destaque em negrito e verde-escuro nas explicações, exemplos, enunciados, alternativas, pistas e feedback. Identificadores e referências de campos usam realce em azul-escuro. As alternativas recebem o mesmo critério semântico de destaque, independentemente do gabarito.

A sinalização visual orienta a atenção para conceitos relevantes e suas relações com diagramas e tabelas (VAN GOG, 2021; SCHNEIDER et al., 2018). O uso combinado de peso tipográfico e cor segue o princípio de acessibilidade de não depender exclusivamente da cor para transmitir significado (W3C, WCAG 2.2, 1.4.1). A seleção é moderada e evita repetir realces de um mesmo termo no mesmo bloco de texto.

### Identificação por matrícula e referências na página

Cada integrante informa e confirma sua matrícula completa. O formato institucional utilizado no Laboratório Vivo de Desenvolvimento Web — Aula 05 é composto por oito algarismos, ponto, ITA e quatro algarismos (`^[0-9]{8}\.ITA[0-9]{4}# PPI I — Modelagens consolidadas dos projetos integradores

**IFMA · Campus Itapecuru-Mirim · Técnico em Informática integrado ao Ensino Médio**  
**Versão 1.4 · 24/11/2026 · Referência docente para preparação da Aula 09**

## 1. Finalidade e decisões consolidadas

Este documento consolida os dois modelos discutidos para Prática Profissional Integrada I. Eles servem de base para retomar as atividades de investigação, elicitação e requisitos, estudar modelagem de dados e preparar a avaliação prática.

| Projeto | Objeto central | Questões que o modelo permite investigar |
|---|---|---|
| EDA — Evasão e Permanência Estudantil | Trajetória acadêmica do estudante em um campus | Matrículas, permanência, evasão, notas e frequência por turma, ano curricular, curso e disciplina |
| Mapa de Memórias Quilombolas | Pontos geográficos que reúnem relatos de memória | Localização, história, temas, fontes e mídias de cada relato |

Decisões acordadas:

- O EDA começa no campus e representa a estrutura acadêmica que os estudantes conhecem. O estudante se vincula à turma por sua matrícula anual. Seus resultados por disciplina ficam registrados em Desempenho.
- Memórias começa na comunidade. Cada comunidade pode conter vários pontos de memória, e cada ponto pode reunir histórias de épocas e temas diferentes. Latitude e longitude pertencem ao ponto. Período histórico e temas pertencem ao relato.
- Os dois modelos têm oito entidades. A documentação textual e os diagramas Mermaid podem ser mantidos no próprio projeto Git.
- A aula posterior poderá partir dos modelos e dados fornecidos, com análise, perguntas e revisão assistida por IA. As equipes retomam seus requisitos anteriores para explicar e validar decisões de modelagem.

Os diagramas detalham os modelos conceituais com atributos e chaves, deixando explícita uma possível estrutura lógica relacional. Os nomes técnicos, identificadores, domínios ilustrativos e exemplos abaixo são decisões de documentação para tornar o modelo verificável. As regras operacionais do campus e das comunidades exigem validação com as partes interessadas autorizadas.

## 2. Como ler os diagramas

| Elemento | Significado |
|---|---|
| Entidade | Tipo de objeto ou registro sobre o qual se deseja armazenar dados. |
| Atributo | Informação de uma entidade, como o nome de um curso. |
| PK (chave primária) | Identificador único de um registro. |
| FK (chave estrangeira) | Identificador que aponta para um registro de outra entidade. |
| Duas barras | Exatamente um registro associado. |
| Círculo e pé de galinha | Zero ou vários registros associados. |
| Barra e pé de galinha | Um ou vários registros associados. |
| Entidade associativa | Representa uma relação entre dois registros, podendo guardar informações dessa relação. |
| Linha contínua | Relação identificadora, quando a chave do registro relacionado inclui a chave da entidade de origem. |
| Linha tracejada | Relação em que o registro relacionado possui uma chave primária própria. |

Uma chave composta usa dois atributos em conjunto para identificar unicamente um registro.

## 3. EDA — Evasão e Permanência Estudantil

### 3.1. Contexto e escopo

O modelo representa a organização acadêmica de cursos técnicos integrados, com anos curriculares e turmas em anos letivos específicos. Cada ano curricular possui seu conjunto de disciplinas. A matrícula associa um estudante à turma e registra sua situação naquele ano. O desempenho registra os resultados do estudante nas disciplinas previstas para o ano curricular de sua turma.

**Ano curricular** indica a etapa na estrutura do curso, como o primeiro ou o segundo ano. **Ano letivo** indica o calendário em que a turma funciona, como 2025 ou 2026. Um estudante pode ter matrículas em turmas distintas ao longo de sua trajetória.

### 3.2. Diagrama entidade-relacionamento

```mermaid
erDiagram
    CAMPUS ||..o{ CURSO : oferece
    CURSO ||..|{ ANO_CURRICULAR : possui
    ANO_CURRICULAR ||..|{ DISCIPLINA : contempla
    ANO_CURRICULAR ||..o{ TURMA : referencia
    TURMA ||..o{ MATRICULA : recebe
    ESTUDANTE ||..o{ MATRICULA : possui
    MATRICULA ||--o{ DESEMPENHO : registra
    DISCIPLINA ||--o{ DESEMPENHO : recebe_resultados

    CAMPUS {
        string id PK
        string nome
    }
    CURSO {
        string id PK
        string campus_id FK
        string nome
    }
    ANO_CURRICULAR {
        string id PK
        string curso_id FK
        int numero
    }
    DISCIPLINA {
        string id PK
        string ano_curricular_id FK
        string nome
        int carga_horaria
    }
    TURMA {
        string id PK
        string ano_curricular_id FK
        string codigo
        int ano_letivo
    }
    ESTUDANTE {
        string id PK
    }
    MATRICULA {
        string id PK
        string estudante_id FK
        string turma_id FK
        string situacao
    }
    DESEMPENHO {
        string matricula_id PK, FK
        string disciplina_id PK, FK
        float nota
        float frequencia_pct
        string situacao_disciplina
    }
```

### 3.3. Dicionário de dados

| Entidade | Finalidade | Atributos e domínio |
|---|---|---|
| CAMPUS | Unidade de ensino | `id`, identificador; `nome`, texto. |
| CURSO | Curso oferecido pelo campus | `id`; `campus_id`; `nome`, texto. |
| ANO_CURRICULAR | Etapa curricular de um curso | `id`; `curso_id`; `numero`, inteiro positivo. |
| DISCIPLINA | Componente previsto no ano curricular de um curso | `id`; `ano_curricular_id`; `nome`, texto; `carga_horaria`, inteiro positivo em horas-aula, quando informada. |
| TURMA | Grupo de estudantes de um ano curricular em um ano letivo | `id`; `ano_curricular_id`; `codigo`, texto; `ano_letivo`, inteiro. |
| ESTUDANTE | Identidade persistente do estudante | `id`, código sintético que permite acompanhar a trajetória em diferentes matrículas. |
| MATRICULA | Vínculo anual do estudante à turma | `id`; `estudante_id`; `turma_id`; `situacao`, estado da matrícula no recorte analisado. |
| DESEMPENHO | Resultado de uma matrícula em uma disciplina | `matricula_id` + `disciplina_id`, chave primária composta; `nota`, decimal; `frequencia_pct`, percentual de 0 a 100; `situacao_disciplina`, situação acadêmica de exemplo. |

### 3.4. Relacionamentos e regras

| Relacionamento | Regra de modelagem |
|---|---|
| Campus – Curso | Um campus pode oferecer vários cursos. Cada curso do cadastro pertence a um campus. |
| Curso – Ano curricular | Cada curso possui um ou mais anos curriculares. Cada ano curricular pertence a um curso. |
| Ano curricular – Disciplina | Cada ano curricular possui um ou mais componentes curriculares. Cada registro de disciplina refere-se àquele ano curricular. A mesma disciplina nominal pode aparecer em outros anos ou cursos. |
| Ano curricular – Turma | Uma etapa curricular pode ter turmas em diferentes anos letivos e mais de uma turma no mesmo ano. Cada turma referencia uma etapa. |
| Turma – Matrícula | Uma turma pode receber várias matrículas. Cada matrícula pertence a uma turma. |
| Estudante – Matrícula | Um estudante pode realizar diversas matrículas ao longo de sua trajetória. Cada matrícula pertence a um estudante. |
| Matrícula – Desempenho | Cada matrícula pode ter registros de desempenho em diversas disciplinas. |
| Disciplina – Desempenho | Uma disciplina pode receber resultados de diversas matrículas. Cada desempenho referencia uma disciplina e uma matrícula. |

Regras de integridade e recorte:

1. A combinação `curso_id + numero` identifica uma etapa curricular sem duplicidade.
2. A combinação `ano_curricular_id + ano_letivo + codigo` distingue turmas.
3. A combinação `estudante_id + turma_id` identifica um vínculo único no exercício.
4. A combinação `matricula_id + disciplina_id` é única em Desempenho. O vínculo representa um resultado consolidado por disciplina no recorte anual.
5. O ano curricular da disciplina no Desempenho deve coincidir com o ano curricular da turma da Matrícula. Essa condição adicional deve ser conferida na validação do modelo.
6. As notas de exemplo usam a escala de 0 a 10. A frequência usa percentuais de 0 a 100. Dados ausentes permanecem desconhecidos.
7. As situações ilustrativas da matrícula são CURSANDO, CONCLUIU_ANO e EVASAO. A situação da disciplina pode ser EM_ANDAMENTO, APROVADO, REPROVADO ou SEM_RESULTADO_FINAL. As situações vêm do registro acadêmico de referência. Nota ou frequência isoladas não determinam evasão.
8. A estrutura contempla a turma regular do ensino médio integrado. Dependências, mudanças de matriz, equivalências, transferências e notas por etapa poderão ser detalhadas caso os requisitos indiquem essa necessidade.

O vínculo com as disciplinas segue o caminho Estudante → Matrícula → Turma → Ano curricular → Disciplina. Para conhecer o resultado individual de uma disciplina, consultam-se Matrícula e Disciplina por meio de Desempenho.

### 3.5. Dados fictícios para compreender e verificar o modelo

O conjunto abaixo é um novo cenário sintético, construído para a modelagem consolidada. Os nomes de cursos e as disciplinas funcionam como exemplos didáticos. Os registros, cargas horárias, trajetórias e notas são inventados. As listas de componentes são recortes ilustrativos, com duração de curso e matrizes sem pretensão de reproduzir o PPC oficial.

#### CAMPUS

| id | nome |
|---|---|
| C01 | Itapecuru-Mirim |

#### CURSO

| id | campus_id | nome |
|---|---|---|
| CU01 | C01 | Técnico em Informática |
| CU02 | C01 | Técnico em Meio Ambiente |

#### ANO_CURRICULAR

| id | curso_id | numero |
|---|---|---:|
| AC01 | CU01 | 1 |
| AC02 | CU01 | 2 |
| AC03 | CU01 | 3 |
| AC04 | CU02 | 1 |
| AC05 | CU02 | 2 |
| AC06 | CU02 | 3 |

#### DISCIPLINA

| id | ano_curricular_id | nome | carga_horaria |
|---|---|---|---:|
| D01 | AC01 | Matemática | 80 |
| D02 | AC02 | Arte | 40 |
| D03 | AC02 | Biologia | 80 |
| D04 | AC02 | História | 80 |
| D05 | AC02 | Banco de Dados | 80 |
| D06 | AC03 | Redes de Computadores | 80 |
| D07 | AC04 | Geografia | 80 |
| D08 | AC05 | Biologia | 80 |
| D09 | AC05 | Educação Ambiental | 80 |
| D10 | AC06 | Gestão Ambiental | 80 |

#### TURMA

| id | ano_curricular_id | codigo | ano_letivo |
|---|---|---|---:|
| TU01 | AC01 | INFO-1A | 2025 |
| TU02 | AC02 | INFO-2A | 2026 |
| TU03 | AC05 | MA-2A | 2026 |

#### ESTUDANTE

| id |
|---|
| EST001 |
| EST002 |
| EST003 |
| EST004 |
| EST005 |

#### MATRICULA

| id | estudante_id | turma_id | situacao |
|---|---|---|---|
| M001 | EST001 | TU01 | CONCLUIU_ANO |
| M002 | EST002 | TU01 | CONCLUIU_ANO |
| M003 | EST001 | TU02 | CURSANDO |
| M004 | EST002 | TU02 | EVASAO |
| M005 | EST003 | TU02 | CURSANDO |
| M006 | EST004 | TU03 | CURSANDO |
| M007 | EST005 | TU03 | CURSANDO |

#### DESEMPENHO

| matricula_id | disciplina_id | nota | frequencia_pct | situacao_disciplina |
|---|---|---:|---:|---|
| M001 | D01 | 8.0 | 96 | APROVADO |
| M002 | D01 | 7.0 | 92 | APROVADO |
| M003 | D02 | 8.5 | 95 | EM_ANDAMENTO |
| M003 | D03 | 7.0 | 85 | EM_ANDAMENTO |
| M003 | D04 | 5.0 | 78 | EM_ANDAMENTO |
| M003 | D05 | 9.0 | 98 | EM_ANDAMENTO |
| M004 | D02 | 6.0 | 70 | SEM_RESULTADO_FINAL |
| M004 | D03 | 4.0 | 60 | SEM_RESULTADO_FINAL |
| M004 | D04 | 5.0 | 65 | SEM_RESULTADO_FINAL |
| M004 | D05 | 3.0 | 55 | SEM_RESULTADO_FINAL |
| M005 | D02 | 9.0 | 98 | EM_ANDAMENTO |
| M005 | D03 | 8.0 | 94 | EM_ANDAMENTO |
| M005 | D04 | 7.5 | 90 | EM_ANDAMENTO |
| M005 | D05 | 8.5 | 96 | EM_ANDAMENTO |
| M006 | D08 | 8.0 | 93 | EM_ANDAMENTO |
| M006 | D09 | 9.0 | 97 | EM_ANDAMENTO |
| M007 | D08 | 6.0 | 82 | EM_ANDAMENTO |
| M007 | D09 | 7.0 | 87 | EM_ANDAMENTO |

Para M004, os resultados refletem os registros disponíveis antes da evasão. SEM_RESULTADO_FINAL indica ausência de resultado final por disciplina no recorte.

### 3.6. Consultas de referência e resultados esperados

| Pergunta | Caminho ou operação | Resultado na base fictícia |
|---|---|---|
| Quais disciplinas são previstas para TU02? | Turma → Ano curricular → Disciplina | Arte, Biologia, História e Banco de Dados. |
| Quais resultados EST001 possui em 2026? | Estudante → Matrícula M003 → Desempenho → Disciplina | Arte 8,5/95%; Biologia 7,0/85%; História 5,0/78%; Banco de Dados 9,0/98%. |
| Qual foi a trajetória de EST002? | Estudante → Matrículas → Turmas → Anos curriculares | 1º ano de Informática concluído em 2025; matrícula no 2º ano em 2026 com situação EVASAO. |
| Quantas matrículas de evasão aparecem em 2026 por curso? | Matrícula → Turma → Ano curricular → Curso; filtro por ano e situação | Informática 1; Meio Ambiente 0. |
| Qual matrícula de TU02 tem frequência inferior a 75% em Banco de Dados? | Turma → Matrícula → Desempenho com D05; frequência < 75 | M004 (55%). O limite é apenas um filtro de exemplo. |
| Seria válido registrar D09 para M003? | Comparar os anos curriculares da turma e da disciplina | Inválido. M003 está em AC02 e D09 pertence a AC05. |

Os exemplos permitem investigar associações entre situação de matrícula e desempenho. A base didática pequena não sustenta conclusões causais, estatísticas institucionais ou inferências sobre um estudante real.

## 4. Mapa de Memórias Quilombolas

### 4.1. Contexto e escopo

O projeto organiza memórias de comunidades por pontos de interesse histórico ou cultural. Cada **Ponto de Memória** representa um lugar geográfico, com nome, descrição, latitude e longitude. Cada **Relato** representa uma história, acontecimento ou tradição associada ao ponto.

O ponto é compartilhado por relatos que podem tratar de épocas e temas diferentes. O relato possui seu período histórico e a data em que foi registrado. Temas classificam relatos. Fontes sustentam as informações de cada relato e mídias complementam sua documentação.

### 4.2. Diagrama entidade-relacionamento

```mermaid
erDiagram
    COMUNIDADE ||..o{ PONTO_MEMORIA : possui
    PONTO_MEMORIA ||..o{ RELATO : reune
    RELATO ||--|{ RELATO_TEMA : possui
    TEMA ||--o{ RELATO_TEMA : classifica
    RELATO ||--o{ RELATO_FONTE : utiliza
    FONTE ||--o{ RELATO_FONTE : fundamenta
    RELATO ||..o{ MIDIA : contem

    COMUNIDADE {
        string id PK
        string nome
        string descricao
    }
    PONTO_MEMORIA {
        string id PK
        string comunidade_id FK
        string nome
        string descricao
        float latitude
        float longitude
    }
    RELATO {
        string id PK
        string ponto_memoria_id FK
        string titulo
        string conteudo
        string periodo_historico
        int ano_inicial
        int ano_final
        date data_registro
        string situacao_revisao
        boolean publicacao_autorizada
    }
    TEMA {
        string id PK
        string nome
        string descricao
    }
    RELATO_TEMA {
        string relato_id PK, FK
        string tema_id PK, FK
    }
    FONTE {
        string id PK
        string tipo
        string descricao
    }
    RELATO_FONTE {
        string relato_id PK, FK
        string fonte_id PK, FK
    }
    MIDIA {
        string id PK
        string relato_id FK
        string tipo
        string endereco_arquivo
        string descricao
        boolean publicacao_autorizada
    }
```

### 4.3. Dicionário de dados

| Entidade | Finalidade | Atributos e domínio |
|---|---|---|
| COMUNIDADE | Identifica a comunidade a que pertencem os pontos de memória. | `id`; `nome`; `descricao`. |
| PONTO_MEMORIA | Identifica o lugar de referência dos relatos. | `id`; `comunidade_id`; `nome`; `descricao`; `latitude` e `longitude`, coordenadas decimais. |
| RELATO | Registra uma história, prática, acontecimento ou tradição. | `id`; `ponto_memoria_id`; `titulo`; `conteudo`; `periodo_historico`, texto; `ano_inicial` e `ano_final`, inteiros opcionais; `data_registro`, data; `situacao_revisao`, estado; `publicacao_autorizada`, booleano. |
| TEMA | Categoria temática reutilizável. | `id`; `nome`; `descricao`. |
| RELATO_TEMA | Vincula um relato a um tema. | `relato_id` + `tema_id`, chave primária composta. |
| FONTE | Identifica a origem documental ou oral da informação. | `id`; `tipo`, como entrevista ou documento; `descricao`. |
| RELATO_FONTE | Vincula um relato a uma fonte utilizada. | `relato_id` + `fonte_id`, chave primária composta. |
| MIDIA | Recurso que documenta ou ilustra o relato. | `id`; `relato_id`; `tipo`, como fotografia, áudio ou vídeo; `endereco_arquivo`, referência; `descricao`; `publicacao_autorizada`, booleano. |

### 4.4. Relacionamentos e regras

| Relacionamento | Regra de modelagem |
|---|---|
| Comunidade – Ponto de memória | Uma comunidade pode possuir vários pontos. Cada ponto pertence a uma comunidade. |
| Ponto de memória – Relato | Um ponto pode reunir vários relatos de períodos e temas distintos. Cada relato tem um ponto de referência. |
| Relato – Tema | Cada relato possui um ou mais temas. Um tema pode classificar vários relatos. Relato-Tema representa a associação. |
| Relato – Fonte | Um relato pode utilizar várias fontes. Uma fonte pode fundamentar vários relatos. Relato-Fonte representa a associação. |
| Relato – Mídia | Um relato pode possuir diversas mídias. Cada mídia vinculada no exercício pertence a um relato. |

Regras de integridade e recorte:

1. Latitude e longitude ficam no Ponto de Memória. A latitude está entre −90 e 90, e a longitude entre −180 e 180. Os dois valores precisam ser informados em conjunto para representar um ponto no mapa.
2. O período histórico descreve o tempo da história narrada. Os anos inicial e final são opcionais e permitem ordenar ou filtrar a linha do tempo. Quando ambos existem, o inicial deve ser menor ou igual ao final. A expressão textual preserva a incerteza e a forma como o relato data o acontecimento.
3. A data de registro refere-se ao momento da documentação da história. Um relato registrado em 2026 pode descrever um fato de 1975.
4. A combinação `relato_id + tema_id` é única. A combinação `relato_id + fonte_id` também é única.
5. O cadastro pode conter relatos em revisão e sem fonte documentada. Para a publicação simulada, exige-se revisão concluída, ao menos uma fonte e autorização de publicação. Uma mídia exibida publicamente também precisa estar autorizada. As autorizações representam decisões didáticas explícitas e não substituem consentimentos reais.
6. O recorte utiliza um ponto de referência por relato, podendo ampliar a associação a múltiplos pontos caso os requisitos futuros o justifiquem.

### 4.5. Dados fictícios para compreender e verificar o modelo

Este é um novo conjunto sintético, ampliando o exemplo de temas, registros e revisão da Aula 08. Comunidades, pontos, histórias, datas, coordenadas, fontes e mídias são inventados para o exercício. As coordenadas são valores ilustrativos e não identificam a localização de comunidades reais. As referências de mídia representam arquivos hipotéticos.

#### COMUNIDADE

| id | nome | descricao |
|---|---|---|
| CO01 | Comunidade A | Comunidade fictícia do exercício. |
| CO02 | Comunidade B | Comunidade fictícia do exercício. |

#### PONTO_MEMORIA

| id | comunidade_id | nome | descricao | latitude | longitude |
|---|---|---|---|---:|---:|
| P01 | CO01 | Casa de farinha | Local de trabalho comunitário. | -3.390 | -44.350 |
| P02 | CO01 | Praça comunitária | Ponto de encontro e festividades. | -3.392 | -44.352 |
| P03 | CO02 | Caminho antigo | Lugar associado a memórias de circulação. | -3.410 | -44.370 |

#### RELATO

| id | ponto_memoria_id | titulo | conteudo | periodo_historico | ano_inicial | ano_final | data_registro | situacao_revisao | publicacao_autorizada |
|---|---|---|---|---|---:|---:|---|---|---|
| REL01 | P01 | Construção da casa de farinha | História fictícia da construção coletiva. | Década de 1970 | 1970 | 1979 | 2026-08-12 | REVISADO | SIM |
| REL02 | P01 | Tradição da produção de farinha | História fictícia do trabalho e dos saberes transmitidos. | Década de 1980 | 1980 | 1989 | 2026-08-19 | REVISADO | SIM |
| REL03 | P01 | Festa dos produtores de farinha | História fictícia de uma celebração. | 2025 | 2025 | 2025 | 2026-08-26 | EM_REVISAO | NAO |
| REL04 | P02 | Festa tradicional na praça | História fictícia de uma festividade comunitária. | 1995 | 1995 | 1995 | 2026-09-02 | REVISADO | SIM |
| REL05 | P03 | Histórias do caminho antigo | Narrativa fictícia sobre um trajeto de uso comunitário. | Antigamente, sem ano confirmado | — | — | 2026-09-09 | EM_REVISAO | NAO |

#### TEMA

| id | nome | descricao |
|---|---|---|
| T01 | História | Acontecimentos e transformações do passado. |
| T02 | Trabalho | Práticas de trabalho e produção. |
| T03 | Tradição | Saberes e práticas transmitidos entre gerações. |
| T04 | Festa | Celebrações e festividades. |
| T05 | Paisagem | Lugares e caminhos associados à memória. |

#### RELATO_TEMA

| relato_id | tema_id |
|---|---|
| REL01 | T01 |
| REL01 | T02 |
| REL02 | T02 |
| REL02 | T03 |
| REL03 | T03 |
| REL03 | T04 |
| REL04 | T04 |
| REL04 | T03 |
| REL05 | T01 |
| REL05 | T05 |

#### FONTE

| id | tipo | descricao |
|---|---|---|
| F01 | Entrevista | Entrevista fictícia A. |
| F02 | Documento | Documento histórico fictício A. |
| F03 | Entrevista | Entrevista fictícia B. |

#### RELATO_FONTE

| relato_id | fonte_id |
|---|---|
| REL01 | F01 |
| REL01 | F02 |
| REL02 | F01 |
| REL03 | F03 |
| REL04 | F03 |

#### MIDIA

| id | relato_id | tipo | endereco_arquivo | descricao | publicacao_autorizada |
|---|---|---|---|---|---|
| MD01 | REL01 | Fotografia | arquivos/foto-a.jpg | Fotografia fictícia da casa de farinha. | SIM |
| MD02 | REL01 | Áudio | arquivos/audio-a.mp3 | Gravação fictícia sobre a construção. | NAO |
| MD03 | REL02 | Fotografia | arquivos/foto-b.jpg | Fotografia fictícia sobre a produção. | SIM |
| MD04 | REL03 | Vídeo | arquivos/video-a.mp4 | Gravação fictícia da festa. | NAO |
| MD05 | REL04 | Fotografia | arquivos/foto-c.jpg | Fotografia fictícia da praça. | SIM |

### 4.6. Consultas de referência e resultados esperados

| Pergunta | Caminho ou operação | Resultado na base fictícia |
|---|---|---|
| Quantos pontos de memória CO01 possui? | Comunidade → Ponto de Memória | 2: P01 e P02. |
| Quais relatos estão associados à casa de farinha? | Ponto de Memória P01 → Relato | REL01, REL02 e REL03. As coordenadas são as mesmas para os três relatos. |
| Quais relatos tratam de trabalho? | Tema T02 → Relato-Tema → Relato | REL01 e REL02. |
| Quais relatos utilizam a entrevista F01? | Fonte F01 → Relato-Fonte → Relato | REL01 e REL02. |
| Quais fontes fundamentam REL01? | Relato → Relato-Fonte → Fonte | F01 e F02. |
| Quais são os relatos de P01 em ordem histórica? | Relato; ordenar por década ou ano inicial | REL01 (1970–1979), REL02 (1980–1989), REL03 (2025). |
| Quais relatos podem aparecer no mapa público simulado? | Revisão concluída, autorização e pelo menos uma fonte | REL01, REL02 e REL04. |
| Quais mídias de REL01 podem aparecer na consulta pública simulada? | Relato REL01 → Mídia com autorização | MD01. MD02 permanece disponível apenas no acervo interno simulado. |

## 5. Relação entre os dois modelos

| Aspecto | EDA | Memórias |
|---|---|---|
| Estrutura do domínio | Campus, curso, ano curricular e turma | Comunidade e ponto de memória |
| Registro central | Matrícula anual do estudante | Relato histórico ou cultural |
| Relações entre múltiplos registros | Desempenho une Matrícula e Disciplina e armazena resultados da associação. | Relato-Tema e Relato-Fonte unem relatos a categorias e fontes reutilizáveis. |
| Dimensão temporal | Ano letivo da turma | Período histórico e data de registro do relato |
| Dimensão geográfica | Campus como recorte institucional | Latitude e longitude do ponto de memória |
| Consulta demonstrável | Trajetória acadêmica e resultados por disciplina | Mapa, linha do tempo e acervo documental |

## 6. Estudo dirigido e Laboratório Vivo da Aula 09

**Tema:** Do requisito ao modelo de dados — interpretação, exploração e evolução com IA.

[Abrir estudo dirigido e atividade avaliativa](https://thalesvalente.github.io/teaching-interdisciplinary-project/lessons/aula-09-do-requisito-ao-modelo/laboratorio.html?v=1.3).

O professor apresenta os modelos pela primeira vez nesta aula. Cada missão começa com conceitos em linguagem acessível, um exemplo do próprio projeto, exploração em etapas de recortes das tabelas fictícias deste documento e uma pergunta de debate com explicação consultável. Após essa exploração, os estudantes respondem quatro questões objetivas e recebem feedback imediato.

### Roteiro de 50 minutos

| Minutos | Etapa | Produto |
|---|---|---|
| 0–3 | Identificar a equipe e recuperar um requisito das atividades anteriores. | Trilha, integrantes e requisito de referência. |
| 3–15 | Missão 1 — entidades, atributos, PK, FK e cardinalidades. | Leitura inicial e quatro respostas. |
| 15–25 | Missão 2 — acompanhar um caminho entre tabelas com registros fictícios. | Interpretação de resultados e quatro respostas. |
| 25–35 | Missão 3 — detectar referências incoerentes e conferir regras de integridade. | Debate orientado e quatro respostas. |
| 35–47 | Missão 4 — entender a evolução do DER com um novo requisito, consultar o prompt de IA, escolher chaves e cardinalidades e comparar o trecho Mermaid de referência. | Quatro decisões sobre a alteração do modelo. |
| 47–50 | Conferir o resumo e gerar o PDF por equipe. | Comprovante da atividade. |

### Exploração guiada em cada questão

As 32 questões das duas trilhas possuem recortes visuais do modelo, cartões de entidades com atributos e marcas PK/FK, tabelas com registros relevantes e situações simuladas identificadas. O estudante examina os dados na própria pergunta. As pistas progressivas ensinam o caminho de raciocínio e podem ser consultadas antes da resposta. Quando uma tentativa é incorreta, a atividade apresenta uma pista adicional e permite revisar a resposta.

### Sinalização visual dos conceitos

O estudo dirigido aplica o **princípio da sinalização** (ou *cueing*) da aprendizagem multimídia. Palavras-chave como entidade, atributo, chave primária, chave estrangeira, cardinalidade e integridade referencial recebem destaque em negrito e verde-escuro nas explicações, exemplos, enunciados, alternativas, pistas e feedback. Identificadores e referências de campos usam realce em azul-escuro. As alternativas recebem o mesmo critério semântico de destaque, independentemente do gabarito.

A sinalização visual orienta a atenção para conceitos relevantes e suas relações com diagramas e tabelas (VAN GOG, 2021; SCHNEIDER et al., 2018). O uso combinado de peso tipográfico e cor segue o princípio de acessibilidade de não depender exclusivamente da cor para transmitir significado (W3C, WCAG 2.2, 1.4.1). A seleção é moderada e evita repetir realces de um mesmo termo no mesmo bloco de texto.

). A validação local normaliza espaços externos e letras minúsculas, preserva zeros à esquerda e exige confirmação idêntica. Matrículas duplicadas, vazias, divergentes ou fora do formato impedem a geração do comprovante. Os dados de identificação são mantidos no navegador e a entrega registra as matrículas no PDF. A validação local cobre a sintaxe e a redigitação. A conferência da existência da matrícula no SUAP depende do cadastro institucional.

As referências bibliográficas e técnicas desta documentação também estão disponíveis na seção **Referências da aula**, acessível a partir do material de consulta. A seção é dedicada à leitura na página e fica fora do comprovante em PDF.

### Pontuação e entrega

São 16 questões por trilha. Cada questão resolvida vale 0,25 ponto e 6,25 XP. Cada missão vale 1,0 ponto ou 25 XP. O total é 4,0 pontos ou 100 XP. Pistas e novas tentativas não reduzem a pontuação. Cada questão concede seus pontos uma única vez, ao ser resolvida. O registro de tentativas e de acertos iniciais permite ao docente compreender o percurso da equipe.

As questões incluem leitura do DER, exploração das tabelas, verificação de regras e decisões concretas sobre uma alteração de modelagem. No EDA, o desafio acrescenta resultados por bimestre vinculados ao desempenho consolidado. Em Memórias, o desafio torna possível associar uma mesma mídia a vários relatos. A solução de referência em Mermaid aparece após concluir as quatro questões da última missão.

Ao finalizar, a equipe gera o PDF com as matrículas validadas dos integrantes, respostas, gabarito, pontuação por missão, nota total, tentativas e pistas exibidas. Os itens e alternativas possuem identificadores estáveis para facilitar a correção. O progresso fica no navegador e a entrega é feita pelo PDF. A proposta mantém a adaptação didática da PPI1-4B, para decisão do docente no registro institucional.

Todos os exemplos usados em aula são fictícios. Os procedimentos institucionais de autorização e tratamento de dados reais permanecem previstos no plano de ensino.

## 7. Referências de contexto e implementação

- IFMA Campus Itapecuru-Mirim. Plano de Ensino de Prática Profissional Integrada I, 2026.2, estrutura SUAP. Seções 4–6, 8 e 9. Documento-base do planejamento da disciplina.
- PPI I. Aula 08 — Da evidência ao requisito. Guia pedagógico com dados sintéticos e dossiê progressivo. [Material da disciplina](https://github.com/thalesvalente/teaching-interdisciplinary-project/blob/main/docs/aula08/GUIA_DOSSIE_PROGRESSIVO.md).
- WATT, Adrienne. *Database Design*. 2. ed. BCcampus, 2014. Capítulo 8, Entity Relationship Data Model. [Livro aberto](https://opentextbc.ca/dbdesign01/chapter/chapter-8-entity-relationship-model/).
- Mermaid. *Entity Relationship Diagrams*. [Documentação da sintaxe](https://mermaid.js.org/syntax/entityRelationshipDiagram.html).
- GitHub Docs. *Creating diagrams*. [Renderização de diagramas no Markdown](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams).


- VAN GOG, Tamara. The signaling (or cueing) principle in multimedia learning. In: MAYER, Richard E.; FIORELLA, Logan (eds.). *The Cambridge Handbook of Multimedia Learning*. Cambridge University Press, 2021. p. 221–230. [DOI](https://doi.org/10.1017/9781108894333.022).
- SCHNEIDER, Sascha et al. A meta-analysis of how signaling affects learning with media. *Educational Research Review*, v. 23, p. 1–24, 2018. [Artigo](https://www.sciencedirect.com/science/article/pii/S1747938X17300581).
- W3C. *Web Content Accessibility Guidelines (WCAG)*. Critério 1.4.1, Use of Color. [Orientação](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html).

- PPI I / Desenvolvimento Web. Laboratório Vivo Web, Aula 05. [Validação local do formato de matrícula](https://github.com/thalesvalente/teaching-web-development/blob/main/lessons/aula-05-laboratorio-web-mobile/roster-client.js).
