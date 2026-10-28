# Decisões de implementação e integração — Aula 07

## Produto e acesso

A ficha é um recurso próprio em `lessons/aula-07-da-pergunta-a-evidencia/ficha/`, acessível pelo cartão da Aula 07 e pelo destaque do portal. A navegação estudantil abre páginas HTML; documentos Markdown de manutenção permanecem no repositório. Nenhum conteúdo ou XP dos 26 slides foi alterado.

A ficha mantém o stack estático da Aula 06: HTML semântico, CSS local com tokens institucionais, JavaScript local, módulos testáveis e construção segura de elementos com `textContent`. A implementação não carrega a integração de entrega da Aula 06 porque esta missão exige dados locais e nenhuma submissão. Não há framework, backend, login, analytics, fonte remota ou nova etapa de build. As únicas dependências de QA são as versões já fixadas de Playwright e axe-core.

## Avaliação e privacidade

O contrato pedagógico contém 33 critérios de completude/processo. A revisão docente permanece pendente, pois preencher a ficha não é uma revisão humana. A nota oficial PPI1-3B não é calculada ou convertida de 0–10 para 0–3,0. A Aula 07 termina em necessidades candidatas; a formalização de RF, RNF e dados pertence à Aula 08.

Os dois percursos compartilham o modelo de dados e a rubrica. A troca de trilha preserva identificação compatível e limpa respostas contextuais após confirmação; a equipe pode guardar um JSON antes de trocar. Integrantes têm IDs estáveis. A autoria da equipe é proporcional ao número de integrantes cadastrados e ativos, com revisão humana da composição da equipe.

O rascunho fica no armazenamento do navegador. Isso facilita retomada offline, mas não comprova autoria nem impede alteração local por quem possui acesso ao dispositivo. Em equipamento compartilhado, a interface orienta a baixar JSON e apagar os dados ao concluir. Não se usa identificação de terceiros reais nos cenários ou fixtures.

## Impressão

Imprimir/salvar como PDF usa o recurso nativo do navegador, com prévia HTML e CSS A4. O mesmo modelo alimenta os modos preenchido, parcial e em branco. Essa escolha evita bibliotecas externas e mantém texto selecionável. Configurações da impressora podem alterar paginação; as evidências automatizadas usam Chromium em A4, e Firefox/WebKit verificam a prévia e estilos de impressão.

## Verificação e gates

WCAG 2.2 AA orienta os critérios testáveis. A referência técnica é a [Recomendação W3C](https://www.w3.org/TR/WCAG22/), consultada em 2026-10-27. Axe, navegação por teclado, reflow, contraste, redução de movimento, estados de erro e inspeção visual se complementam. Um resultado automatizado não é certificação integral WCAG nem ensaio com todas as tecnologias assistivas.

O baseline tinha CI “QA Aula 07” concluído com sucesso no [run 40582333311](https://github.com/thalesvalente/teaching-interdisciplinary-project/actions/runs/40582333311), para `dc5ed18ebdab8dea9035f56a8f3bdedb2520af68`. A publicação Pages já existente na base não é publicação desta missão.

### Fixture legada do quarto bimestre

A regressão encontrou 12 falhas em 35 testes de entrega da Aula 06 antes de qualquer alteração nesses paths. O produto já usava o 4º bimestre desde `9263d567bc4886c4045e6216d927de17d1f786f2`, mas o teste consultava o 3º. O ajuste exclusivo da fixture preserva as verificações de valor, reenvio, outras abas e notas anteriores. Resultado após o alinhamento: 35 PASS. O agente QA revisou o diff em modo somente leitura e não encontrou relaxamento das assertions. Nenhum arquivo do produto da Aula 06 foi alterado.

As evidências de regressão e seus hashes estão em `REGRESSION.json` e nos logs deste diretório. Os relatórios específicos da nova ficha ficam em `docs/reviews/aula07-ficha/`.

## Publicação autorizada

A entrega usa apenas a branch da missão e uma Pull Request para revisão. Não inclui merge nem publicação no GitHub Pages. O próximo gate é a avaliação visual e pedagógica humana da candidata.
