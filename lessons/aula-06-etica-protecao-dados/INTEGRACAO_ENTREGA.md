# PPI I 2026 — implantação, testes e utilização

**Planilha privada:** [interdisciplinary-project-2026](https://docs.google.com/spreadsheets/d/1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE/edit)

## Contrato da disciplina

Uma planilha por disciplina, com cinco abas: `1º Bimestre`, `2º Bimestre`, `3º Bimestre`, `4º Bimestre` e `Auditoria`.

As abas bimestrais têm `Aluno | Equipe | atividades... | Média`. Uma linha por estudante, nomes em ordem alfabética, média **simples**; atividade não entregue contribui com **zero desde o início**.

A Aula 06 é a primeira atividade registrada: código `PPI1-AULA06-2026`, coluna `Aula 06` do 3º Bimestre. Outros instrumentos serão configurados no objeto `CFG.activities` do mesmo Apps Script. A Auditoria usa 14 colunas, sem Bimestre redundante.

Último envio substitui somente a mesma atividade do mesmo estudante. PDF permanece com o aluno; Google guarda dados estruturados, data/hora, ID, SHA-256 de PDF e respostas, e HMAC.

XP da ficha é **formativo** e não nota homologada. A nota aparece como zero provisório, com situação **Avaliação pendente** até aprovação da rubrica docente.

## Botões da ficha

- **Gerar PDF:** download local, inclusive com campos em branco; **nada enviado ao Google**.
- **Gerar PDF e entregar:** um clique baixa o PDF, calcula SHA-256 dos bytes baixados e envia respostas+hash. Só confirma após recibo válido.
- **Ver versão de impressão:** alternativa local sem recibo eletrônico.
- Erro ou timeout **não** equivalem a entrega confirmada.

## Atualizar Apps Script da conta

1. Abra [Apps Script](https://script.google.com/home), projeto `interdisciplinary-project-2026`, em sua conta proprietária.
2. Substitua o `Code.gs` inteiro pelo [arquivo atualizado da PR](appscript/Code.gs), sem manter definições antigas em duplicidade.
3. Salve e execute `testarConexao`; confirme `Diagnóstico estrutural: PASS`.
4. Clique **Deploy → Manage deployments → Edit (lápis) → Version: New version → Deploy**. Somente salvar NÃO atualiza a URL ` /exec ` de uma implantação versionada.
5. Mantenha **Execute as: Me** e **Who has access: Only myself** até passar todos os gates e definir proteção de identidade. Valide URL ` /exec ` novamente.
6. O cliente da PR já contém a URL informada. **Sem merge nem disponibilização pública** até avaliação final.

## Bateria implementada

| Nível | Como executar | Escopo |
| --- | --- | --- |
| Apps Script isolado (33 testes) | `node --test tests/ppi-entregas.test.cjs` | validação, XP, SHA-256 PDF, HMAC, notas, upsert, 30 integrantes, fórmulas, segurança |
| Navegador E2E | `node tests/ppi-browser-entrega.cjs` | botão, PDF gerado, hash, POST interceptado, recibo, erro por hash adulterado |
| Browser e acessibilidade | `npm run test:aula06` | Chromium, Firefox, WebKit; WCAG/reflow, PDFs, modo impressão, offline |
| PDF em profundidade | `python tests/aula06-pdf-qa.py tmp/aula06-qa` | texto PDF, XP, pendências, paginação e overflow |
| Google real (manual controlado) | `testarConexao` e envio fictício autorizado | versão implantada, permissões, escrita na planilha |

As suites de Node e browser usam apenas **mocks e dados fictícios**, nunca acessam a planilha real. Relatórios automáticos aparecem em [Actions](https://github.com/thalesvalente/teaching-interdisciplinary-project/actions).

## Gate para liberar aos estudantes

- [ ] Testes automatizados PASS no HEAD final da PR.
- [ ] Nova versão do `Code.gs` implantada na conta com o mesmo ID da planilha.
- [ ] Testar 2 envios reais fictícios + reenvio do mesmo aluno, conferindo ausência de duplicatas.
- [ ] Conferir o SHA-256 do PDF baixado com o hash registrado na planilha.
- [ ] Validar fluxo de falha sem falso recibo em desktop e celular.
- [ ] Implantar autenticação/controle de identidade adequado; nome fornecido no formulário sozinho é insuficiente.
- [ ] Definir nota oficial e política de correção pela rubrica pedagógica, separadamente de XP.
- [ ] Remover registros fictícios da planilha de produção.
- [ ] Definir retenção de dados, permissões e fluxo de recurso de nota.

**Trava adicional de segurança:** a versão candidata recusa POSTs externos por padrão. A propriedade privada `PPI_WEB_SUBMISSIONS_ENABLED` só poderá receber `true` após implantação de um mecanismo de autenticação/autorização de alunos. Não basta simplesmente alterar `Who has access` para `Anyone`. O teste direto `testarConexao` continua funcionando sem liberar o endpoint. 

**Acesso público NÃO deve ser habilitado enquanto estudantes não puderem ser identificados e autorizados.** A opção Only myself, apesar de segura para testes do professor, não recebe submissões abertas da turma.

## Limites de integridade

SHA-256 registra os bytes do PDF que o navegador afirma ter gerado. Sem guardar ou retransmitir o PDF, o servidor não comprova sozinho que ele contém exatamente as respostas do JSON; qualquer contestação deve confrontar arquivo e dados da planilha.

O HMAC atual assina a entrega **SEM_NOTA**. A nota acadêmica inserida posteriormente não ganha assinatura criptográfica automaticamente: para isso, será necessário um mecanismo específico de homologação com nova assinatura. Nome como chave pode colidir para homônimos: usar identificador acadêmico verificado antes da produção.

A integração Google disponível neste chat não permite alterar ou implantar o Apps Script diretamente; é necessário atualizar a implantação na conta proprietária.
