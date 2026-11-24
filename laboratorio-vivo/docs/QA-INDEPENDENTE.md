# QA independente — PPI-LV-01

## Parecer e limites

**Parecer: `PASS_CODE_LOCAL_AND_SHEETS_SCOPED`.** Os três defeitos de implementação reproduzidos pela revisão independente foram corrigidos pelos autores e passaram nos testes de regressão independentes. A última execução conjunta terminou com **66 testes aprovados, zero falhas e zero testes ignorados**. A geração dos arquivos HtmlService também passou na comparação byte a byte com o frontend.

Este parecer cobre o código examinado, os testes locais e a conferência documental do ensaio de fórmulas no Google Sheets QA novo. **F5 permanece `NOT_RUN`: não existe evidência de um Web App Apps Script implantado e acessado por uma sessão Google real.** Não autoriza publicação, tratamento de dados educacionais reais ou ativação de produção. O resultado de CI/PR é uma evidência separada, registrada pelo coordenador após execução efetiva.

## Independência da revisão

A revisão foi realizada por **C4**, agente distinto dos autores de backend, frontend, contratos e integração. C4 não alterou a implementação, não criou projetos Google, não modificou planilhas e não executou operações Git. Os achados foram enviados aos autores, que fizeram as correções; C4 escreveu e executou as regressões sem transferir a autoria desses testes aos implementadores.

Arquivos de autoria de C4 nesta revisão:

- `tests/independent-security.test.cjs`;
- `tests/independent-browser.test.cjs`;
- `docs/QA-INDEPENDENTE.md`;
- `evidence/independent-qa.json`.

A infraestrutura de serviços Google simulados foi reutilizada de `tests/backend-harness.cjs`. Isso permite testar a implementação `.gs` efetiva, mas não constitui independência do runtime Google nem prova de permissões nativas. O relatório legível por máquina registra hashes dos arquivos examinados para distinguir este estado de mudanças posteriores.

## Evidências executadas e examinadas

| Evidência | Resultado | Origem e alcance |
| --- | --- | --- |
| Suíte local conjunta | 66/66 PASS; zero falhas, zero skips | Executada por C4: 32 backend, 6 contratos, 16 frontend, 11 segurança independentes e 1 integração Chromium independente. |
| Integração UI → implementação `.gs` | PASS | Chromium real, UI real, funções Apps Script reais executadas em VM, serviços Google simulados. Não usa respostas de negócio inventadas por um adaptador separado. |
| Arquivos HtmlService gerados | PASS | `node scripts/build-ui.mjs --check`: conteúdo gerado idêntico às fontes. |
| Fórmulas nativas de N3/N4 | 18/18 PASS | `evidence/native-formulas.json`, produzido pelo coordenador no Google Sheets QA novo e examinado por C4. Teste de motor de fórmula; `connectedAppsScript: false`. |
| QA de layout do autor | 8 combinações de navegador/resolução PASS e 2 cenários de adaptador PASS | Evidência do autor examinada: Chromium e Firefox, 1280×720, 1280×650, 390×844 e 320×700; zero violações automatizadas reportadas, com verificações axe incompletas ainda identificadas. |
| WebKit local | NOT_RUN | Dependências de sistema ausentes no ambiente de execução do autor. A configuração de CI instala os navegadores e suas dependências; aprovação depende de execução real. |
| CI remoto / PR | PENDING | A revisão de configuração não equivale a execução bem-sucedida. O coordenador registra o resultado real depois. |
| Apps Script nativo, OAuth, `/exec` e round-trip Google | NOT_RUN | Nenhum projeto/deploy/sessão real foi comprovado. |

Zero violações em axe e uma inspeção visual não demonstram conformidade integral com WCAG 2.2 AA. Leitor de tela real, projeção em sala, identidade Google, políticas do domínio e permissões efetivas continuam sujeitos aos gates previstos na matriz de aceite.

## Achados e regressões

| ID | Defeito reproduzido | Correção feita pelo autor | Revalidação independente |
| --- | --- | --- | --- |
| C4-01 | Uma falha na gravação do recibo deixava o ledger em `RECOVERY_REQUIRED`, mas a auditoria já afirmava `SUCCESS / TRANSACTION_COMMITTED`. | O evento de commit passou para depois do recibo completo, da marca `COMMITTED` e do flush. Replay repara um evento ausente. O recibo de submissão não confirma uma transação cuja auditoria ainda está pendente. | PASS: falha antes do marker não cria evento de sucesso; falha de auditoria depois do marker retorna recuperação; replay restaura um único evento sem duplicar a submissão. |
| C4-02 | A projeção de nota comparava revisões de versões de atividade diferentes. Uma v1.0/revisão 3 podia vencer a v1.1/revisão 1 pertencente ao plano novo e suprimir a nota aprovada atual. | A seleção restringe primeiro plano, versão da atividade e versão da rubrica. A ordenação por revisão ocorre dentro da versão vinculada. | PASS: depois de três revisões da versão antiga, a primeira revisão da versão nova produz o item correto; IDs de avaliação projetados correspondem à nova aprovação. |
| C4-03 | A importação do frontend aceitava request IDs curtos ou iniciados por pontuação e texto com Unicode malformado/controles recusados pelo backend. Também rejeitava um ID válido de 128 caracteres. | Validação de IDs, controles, pares UTF-16 e limites de serialização alinhada ao backend. | PASS: casos inválidos são recusados antes da importação; ID de 128 caracteres é aceito em ambos os lados; Unicode válido e conteúdo literal preservam hash e texto. |
| C4-04 | O job de testes sem dependências passaria a incluir um teste Playwright. A variável de saída dos testes de navegador não coincidia com a lida pelo script, prejudicando o upload de evidências. | O coordenador separou o teste Chromium no job com instalação, listou os testes sem navegador e usou `PPI_LAB_BROWSER_OUTPUT`. | PASS na revisão da configuração corrigida em `.github/workflows/qa-ppi-laboratorio-vivo.yml`; execução remota continua PENDING. |
| C4-05 | O contrato dizia que a exportação continha notas, embora a implementação exporte progresso formativo/metadados com `official_grade: false`. A operação `revokePlan` não constava da tabela administrativa. | O coordenador descreveu o escopo implementado e documentou a revogação. | PASS na releitura de `CONTRATO-API.md` e das instruções de teste do README. |

O primeiro baseline também identificou duas expectativas incorretas nos testes de contratos: `official_max: null` significa ausência de nota na atividade formativa, e os cabeçalhos do backend estão em `LV_TABLES_`. O coordenador corrigiu seus testes. Esses casos não foram classificados como defeitos da implementação.

## Propriedades de segurança verificadas

**Alvo e ambiente.** A revisão exercitou ausência e corrupção da denylist, IDs duplicados, destino incluído na lista proibida, ambiente divergente, nonce inválido, Script ID divergente, título diferente, timezone/locale incompatíveis e identificação de sessão desconhecida. Esses casos bloqueiam operações antes de gravações de negócio. A inicialização no editor exige ADMIN e binding verificado; preenche somente metadados vazios ou coincidentes, fecha as flags e é idempotente. Não afirma que houve round-trip.

**Autorização e privacidade.** A identidade vem de `Session.getActiveUser().getEmail()` e da allowlist privada, com ausência de fallback para o usuário efetivo. Foram verificadas revogações atuais da allowlist, autoria, participante e equipe também em replay. Uma pessoa da mesma equipe pode acompanhar o progresso autorizado, mas não ler a reflexão de outra pessoa. IDs ou papéis enviados pelo cliente não concedem acesso. Revisões docentes não conservam autoridade depois da revogação do papel.

**Integridade transacional.** Locks impedem escrita concorrente no harness. Falhas entre respostas e antes/depois do commit deixam estados explícitos; o mesmo pedido retoma a operação. Request divergente produz conflito sem sobrescrever dados. Uma perda simulada da resposta após commit foi executada pela interface no Chromium: o segundo envio preservou o envelope e retornou `NO_OP`, com uma única submissão e um conjunto único de respostas. Sheets continua sendo um armazenamento sem transação ACID entre abas; a recuperação depende do ledger e da repetição do pedido preservado.

**Avaliação individual e versões.** Alfa e Beta receberam avaliações sintéticas diferentes, em registros separados. A tentativa de avaliar uma submissão com outro participante foi recusada. Plano, versão da atividade, rubrica, revisão esperada, critérios completos e limites de pontuação são verificados no servidor. O fluxo formativo completo de três critérios foi exercitado pela UI contra as funções `.gs` e não criou linhas de nota oficial. Os testes de fórmula comprovam resultados 10 e zero quando autorizados, e resultado vazio para item ausente, excesso, proposta, versão antiga, rascunho, texto semelhante a fórmula e revogação do plano.

**Dados literais e importação.** Os testes preservam acentos, marcas combinantes, emoji, HTML como texto, aspas, vírgulas, quebras de linha, apóstrofo e prefixos de fórmula. A saída CSV é delimitada/escapada e protege o primeiro caractere significativo. Backend e frontend concordam sobre o hash canônico dos payloads testados. Arquivo com conteúdo adulterado é recusado, e uma importação não concede autoridade de escrita. Essas verificações locais não substituem o round-trip completo de texto no Apps Script nativo.

## Fronteira do parecer

As evidências conferidas não sustentam `PPI_LAB_CONNECTED_QA_PASS` nem `PPI_LAB_PRODUCTION_READY`. Os seguintes fatos continuam pendentes de comprovação efetiva:

1. Projetos Apps Script nativos separados, propriedades privadas por ambiente e implantação QA real.
2. Identidade Google não vazia no contexto do Web App, OAuth e acesso restrito efetivos.
3. Envio pela interface real, recibo, readback QA, replay, conflito e revisão docente com reconciliação de notas/auditoria.
4. Execução de CI em todos os navegadores configurados e os demais testes manuais de acessibilidade.
5. Autorização de ativação/publicação, privacidade e preservação das fontes no gate final do coordenador.

O ensaio nativo de fórmulas teve uma falha inicial de parse, mantida em `evidence/native-formulas-initial-failure.json`. A evidência posterior documenta a correção para inglês com separador `;` em `pt_BR`, 18 casos aprovados e restauração da QA para plano em rascunho e chaves de notas vazias. Registrar a falha inicial evita que a aprovação posterior apague a trajetória de verificação.

## Como reproduzir a revisão local

Com as dependências de desenvolvimento instaladas e o Chromium Playwright disponível, a partir de `laboratorio-vivo/`:

```sh
node --test tests/backend.test.cjs tests/contracts.test.cjs tests/frontend.test.cjs tests/independent-security.test.cjs
node --test tests/independent-browser.test.cjs
node scripts/build-ui.mjs --check
```

Os testes usam somente fixtures sintéticas e serviços simulados. Não incluem IDs privados, credenciais nem chamadas conectadas ao Google. O teste de navegador pode gravar uma captura opcional quando `PPI_LAB_INDEPENDENT_SCREENSHOT` contém um caminho de saída autorizado.

Referências de evidência: [relatório legível por máquina](../evidence/independent-qa.json), [regressões independentes](../tests/independent-security.test.cjs), [integração Chromium independente](../tests/independent-browser.test.cjs), [ensaio nativo de fórmulas](../evidence/native-formulas.json), [matriz de aceite](MATRIZ-ACEITE-QA.md) e [roteiro de implantação privada](../deploy/README.md).
