# Laboratório Vivo — PPI I 2026.2

Ambiente da Prática Profissional Integrada I, IFMA Campus Itapecuru-Mirim, para produzir evidências, requisitos, critérios de aceitação, rastreabilidade e reflexão individual nas trilhas **Mapa de Memórias Quilombolas** e **Permanência/Evasão Estudantil**.

**Estado da entrega: `PPI_LAB_PARTIAL_CHAT_FIRST`.** A implementação, os testes locais e as duas planilhas novas estão preparados. O projeto nativo Apps Script e a implantação `/exec` ainda precisam ser criados e homologados. A rota transacional permanece indisponível a estudantes. Os IDs privados e os links de planilhas constam no recibo entregue ao responsável, fora deste repositório.

## Usar o modo offline

Abra [a entrada do laboratório](index.html) e escolha o roteiro offline. Para executar a cópia local, inicie um servidor estático na raiz do repositório:

```sh
python -m http.server 8765
```

Acesse `http://localhost:8765/laboratorio-vivo/`. O roteiro permite trabalhar sem backend, exportar e importar JSON com verificação de integridade e imprimir em PDF. Guardar rascunho neste dispositivo exige escolha explícita. Um arquivo local não é um recibo de envio.

Os **100 XP de autoavaliação são exclusivamente formativos**. Não geram nota oficial nem se somam aos XP dos slides. O docente registra avaliação por critério, com justificativa e revisão. Uma projeção de nota exige aprovação docente e plano institucional aprovado na versão correta.

## Estrutura

| Diretório | Conteúdo |
| --- | --- |
| `frontend/` | Interface estática/offline e adaptador `google.script.run` |
| `apps-script/` | Backend Apps Script, manifesto privado e HTML gerado |
| `contracts/` | Schemas de tabelas, submissão, revisão e integração provisória Aula 08 |
| `fixtures/` | Catálogo em rascunho e exemplos exclusivamente sintéticos |
| `tests/` | Contratos, segurança, recuperação de falhas e navegador |
| `scripts/` | Geração determinística dos HTML e do workbook inicial |
| `deploy/` | Inicialização, propriedades privadas e implantação manual mínima |
| `docs/` | Arquitetura, esquema, manuais, rubricas, ameaças, privacidade e QA |
| `evidence/` | Resultados sem identificadores privados e sem registros educacionais reais |

## Garantias de projeto

- Produção e QA têm IDs novos e distintos. A planilha antiga de PPI e a referência Web foram consultadas somente por metadados e permanecem protegidas contra escrita neste fluxo.
- Produção começa com catálogo/rubricas em rascunho e sem equipes, participantes, submissões ou notas. Não existe migração automática.
- O vínculo de execução exige ID, ambiente, projeto, título e nonce conferidos. Não há fallback para planilhas conhecidas.
- A identidade vem da sessão autenticada e da allowlist restrita no servidor. Uma identidade indisponível bloqueia a operação. Identificação enviada pelo navegador não concede autoridade.
- As mutações são serializadas e usam hash canônico, idempotência, detecção de conflito e recuperação explícita. O ledger e a auditoria distinguem preparação, confirmação, rejeição e reconciliação.
- N3 e N4 utilizam os limites versionados do plano em rascunho, inicialmente 2+3+5 e 2+4+4. Ausência e proposta não viram zero. Não se calcula média anual sem N1/N2 regularizadas.

## Validar

Com Node.js 22 ou posterior:

```sh
node --test laboratorio-vivo/tests/backend.test.cjs laboratorio-vivo/tests/contracts.test.cjs laboratorio-vivo/tests/frontend.test.cjs laboratorio-vivo/tests/independent-security.test.cjs
node laboratorio-vivo/scripts/build-ui.mjs --check
```

Para os testes de navegador, use as dependências existentes do repositório:

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
PPI_LAB_BROWSERS=chromium,firefox,webkit node laboratorio-vivo/tests/browser.cjs
node --test laboratorio-vivo/tests/independent-browser.test.cjs
```

A suíte verifica quatro resoluções, navegação por teclado, verificações automatizáveis de acessibilidade, rascunhos, importação com hash adulterado, PDF e integração com um adaptador Google simulado. **Esses testes não constituem homologação conectada Apps Script.** O workflow da PR repete a verificação sem segredos ou acesso a planilhas.

O cálculo foi exercitado também no motor real do Google Sheets, em QA sintético, incluindo zeros válidos, valores ausentes, extrapolação de limites e revogação do plano. Consulte [as evidências](evidence/native-formulas.json). Esse teste não chamou um Web App.

## Próxima etapa operacional

Siga [deploy/README.md](deploy/README.md) para criar projetos Apps Script novos, configurar os IDs privados do recibo, autorizar o projeto e implantar o QA com acesso restrito. A prova conectada deve partir do navegador e terminar com leitura do recibo e das linhas em QA, incluindo NO_OP, CONFLICT e revisão docente. Registre o resultado; mantenha produção e acesso discente bloqueados até os gates de segurança, privacidade, homologação e autorização.

Nenhuma Aula 01–07 foi alterada. O contrato Aula 08 permanece provisório e isolado até a integração da versão publicada da aula.
