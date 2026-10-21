# PPI I 2026 — implantação, testes e utilização

**Planilha privada:** [interdisciplinary-project-2026](https://docs.google.com/spreadsheets/d/1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE/edit)

## Contrato da disciplina

Uma planilha por disciplina, com cinco abas: `1º Bimestre`, `2º Bimestre`, `3º Bimestre`, `4º Bimestre` e `Auditoria`.

As abas bimestrais têm `Aluno | Equipe | atividades... | Média`. Uma linha por estudante, nomes em ordem alfabética, média **simples**; atividade não entregue contribui com **zero desde o início**.

A Aula 06 é a primeira atividade registrada: código `PPI1-AULA06-2026`, coluna `Aula 06` do 3º Bimestre. Outros instrumentos serão configurados no objeto `CFG.activities` do mesmo Apps Script. A Auditoria usa 14 colunas, sem Bimestre redundante.

Último envio substitui somente a mesma atividade do mesmo estudante. PDF permanece com o aluno; Google guarda dados estruturados, data/hora, ID, SHA-256 de PDF e respostas, e HMAC.

**Nota automática da Aula 06 = XP / 10** (0–100 XP → 0,0–10,0). A pontuação atual mede completude das respostas, não correção conceitual. O Apps Script recalcula XP no servidor, grava a nota numérica na atividade e na Auditoria, inclui a nota no recibo e vincula ao HMAC. Questões em branco recebem zero e o reenvio substitui a nota anterior.

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
| Apps Script isolado (35 testes) | `node --test tests/ppi-entregas.test.cjs` | validação, XP, SHA-256 PDF, HMAC, notas, upsert, 30 integrantes, fórmulas, segurança |
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
- [ ] Rubrica definida para Aula 06: nota = XP / 10, por completude; esclarecer aos alunos que não é correção conceitual.
- [ ] Remover registros fictícios da planilha de produção.
- [ ] Definir retenção de dados, permissões e fluxo de recurso de nota.

**Trava adicional de segurança:** a versão candidata recusa POSTs externos por padrão. A propriedade privada `PPI_WEB_SUBMISSIONS_ENABLED` só poderá receber `true` após implantação de um mecanismo de autenticação/autorização de alunos. Não basta simplesmente alterar `Who has access` para `Anyone`. O teste direto `testarConexao` continua funcionando sem liberar o endpoint. 

**Acesso público NÃO deve ser habilitado enquanto estudantes não puderem ser identificados e autorizados.** A opção Only myself, apesar de segura para testes do professor, não recebe submissões abertas da turma.

## Limites de integridade

SHA-256 registra os bytes do PDF que o navegador afirma ter gerado. Sem guardar ou retransmitir o PDF, o servidor não comprova sozinho que ele contém exatamente as respostas do JSON; qualquer contestação deve confrontar arquivo e dados da planilha.

O HMAC da Aula 06 passa a assinar a **nota automática (XP / 10)**. Para outras atividades com modo manual, continua `SEM_NOTA`; alterações manuais posteriores não atualizam automaticamente o HMAC. Nome como chave pode colidir para homônimos: usar identificador acadêmico verificado antes da produção.

A integração Google disponível neste chat não permite alterar ou implantar o Apps Script diretamente; é necessário atualizar a implantação na conta proprietária.


## Hotfix de nota automática — 21/10/2026

1. A versão da PR passa a ser **`ppi-entregas-1.3.0`**. Atualize integralmente o `Code.gs` no editor Apps Script, execute `testarConexao` e publique uma **nova versão da implantação** (manter o mesmo Deployment ID).
2. **Nunca habilite a propriedade `PPI_WEB_SUBMISSIONS_ENABLED` para receber estudantes antes de implementar identificação confiável**. O GET no `/exec` é apenas diagnóstico; não atesta recebimento POST.
3. O PDF local e a versão de impressão informam a nota automática estimada. A nota registrada é recalculada no backend sobre as respostas enviadas, independentemente da pontuação informada pelo navegador.
4. `Only myself` impede envios dos estudantes pela hospedagem GitHub Pages. O teste HTTP que falhou antes de gerar `doPost` não constitui homologação do botão. O professor pode apresentar a ficha, permitir PDF/rascunho e recolher documentos pelo canal institucional até que o recebimento seja liberado com identificação adequada.
5. Checklist de aceite: XP 0/14/100 → nota 0,0/1,4/10,0; ausência de duplicatas; reenvio substitui nota; assinatura autentica o valor numérico; impressão/PDF exibem nota e respostas pendentes; POST real pela ficha e uma conta de estudante só após autenticação.
