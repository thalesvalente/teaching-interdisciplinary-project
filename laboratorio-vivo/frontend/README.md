# Interface do Laboratório Vivo

`index.html`, `styles.css`, `lib.js` e `app.js` funcionam sem bibliotecas externas. O modo estático permite preparação e importação/exportação local; não escreve em planilhas nem simula recibos de servidor.

## Gerar a interface Apps Script

Na raiz de `laboratorio-vivo/`, execute:

```sh
node scripts/build-ui.mjs
node scripts/build-ui.mjs --check
node --test tests/frontend.test.cjs
```

O gerador produz `apps-script/Index.html`, `Styles.html` e `Client.html`. O backend precisa expor `include_` limitado a `Styles` e `Client`, e avaliar o template `Index`. As operações conectadas usam exclusivamente `google.script.run` com retorno estruturado, tratamento de falhas e tempo limite sem presumir sucesso.

`deployment.js` começa com URL vazia e gates `false`. O link público só pode ser configurado pelo coordenador depois da prova de QA conectada, revisão de privacidade e autorização de ativação. Nenhum ID de planilha, credencial ou token pertence ao frontend.

A área docente aparece somente após o bootstrap autenticado informar as capacidades correspondentes. Ela permite carregar uma submissão para ler respostas e corrigir por critério; criar atividades/versões formativas a partir dos oito campos; aprovar explicitamente uma rubrica; e ativar ou arquivar a versão selecionada. O seletor distingue `activity_id` e `activity_version`. Criar uma versão não a ativa, e nenhuma dessas ações aprova o plano institucional.

## Comportamentos de privacidade e integridade

- Não há salvamento automático nem coleta de nome, e-mail ou matrícula.
- Rascunho local é gravado em `localStorage` somente após o botão explícito; pode ser apagado pelo usuário.
- JSON usa o contrato `1.0.0`, limites de 4.000 caracteres por resposta, 3.000 na reflexão, 60.000 bytes no payload e 80.000 no arquivo. O SHA-256 do JSON canônico é verificado antes de alterar o formulário. Ele não autentica autoria.
- Um envio tem `request_id` preservado em uma repetição após falha. Alterar respostas cria outra requisição e uma revisão associada ao último `submission_id` conhecido.
- Identidade, papel, vínculo e permissões vêm do servidor. O código docente de registro mediado é validado novamente no backend.
- Conteúdo importado ou devolvido pelo servidor entra no DOM por `textContent` e propriedades de formulário, nunca por HTML executável.
- Impressão gera respostas, reflexão, autoavaliação, identificação da atividade e distinção explícita de rascunho/recibo. Não cria nota oficial.

## Acessibilidade

Meta: WCAG 2.2 AA. A interface usa rótulos visíveis, ligação com instruções e contadores, foco explícito, áreas de toque de 44 px, navegação por teclado, mensagens de estado/erro, alternativa de impressão, layouts responsivos e redução de movimento. Testes automatizados e inspeção visual não substituem a validação assistiva com usuários; a auditoria final deve registrar o que foi e não foi executado.

Verificar pelo menos 1280×720, 1280×650, 390×844 e 320 CSS px. Importar JSON malformado, hash divergente e versões desconhecidas não deve alterar respostas existentes. Falhas da ponte Apps Script não podem resultar em recibo local ou indicação de entrega concluída.

## Teste de navegador

Com Playwright, seus navegadores e axe-core instalados:

```sh
PPI_LAB_BROWSERS=chromium,firefox,webkit node tests/browser.cjs
```

`PPI_LAB_BROWSER_OUTPUT` permite escolher a pasta de evidências. O teste executa os quatro tamanhos, análise automática de critérios WCAG 2.2 AA, foco do link de salto, fluxo local, importação adulterada, impressão em Chromium e contratos docentes com uma ponte Apps Script simulada. A simulação nunca é registrada como homologação conectada. Se um navegador ou suas bibliotecas de sistema estiverem ausentes, o teste falha e registra a causa; não produz aprovação falsa. Use uma lista explícita de navegadores para uma execução parcial e relate o escopo efetivamente executado.
