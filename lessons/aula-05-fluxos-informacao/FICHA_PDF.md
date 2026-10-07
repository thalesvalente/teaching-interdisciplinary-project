# Ficha da equipe 2.0.0

## Uso

Abra `Ficha_Equipe_Aula_05_PPI.html` pelo portal. Preencha nomes dos componentes, projeto/eixo, data e respostas. O nome/número da equipe é opcional. O professor e a identificação institucional são fixos. O botão **Gerar PDF da atividade** baixa o documento diretamente, sem servidor de geração.

A autoria é identificada pelos nomes dos componentes; os dados usados nas respostas sobre os casos continuam fictícios. Nomes e respostas não são enviados ao GitHub, ao professor ou a outros serviços. Não publique PDFs ou rascunhos com nomes em repositórios públicos. Não há salvamento automático: use a cópia JSON antes de fechar a aba.

## Formato do PDF

A4, margens de 25 mm, Times-Roman/Times-Bold, corpo de 12 pontos e entrelinha de 18 pontos. Parágrafos justificados, exceto última linha; identificação e textos curtos alinhados à esquerda. Cabeçalho, identificação, títulos numerados e rodapé com página/total. Texto selecionável, não captura de tela. O modelo é didático; não declara conformidade ABNT, PDF/A ou PDF/UA.

O gerador local usa fontes padrão do PDF, sem distribuir arquivos de fontes e sem dependências externas. Aceita acentuação portuguesa e caracteres WinAnsi. Para caracteres fora desse conjunto, não substitui nem descarta silenciosamente: informa a limitação e oferece o documento HTML de impressão, que preserva o texto. A paginação dessa alternativa depende do navegador; prefira o botão de geração direta quando possível.

## Rascunhos

Exporta JSON `ppi-f01-v2`, incluindo identificação e campos anteriores. Importa v1 e v2. Ao reabrir v1, preserva as respostas e solicita os nomes/data/eixo. A importação valida o arquivo inteiro antes de substituir dados e nunca altera o professor a partir do JSON. Texto da atividade também pode ser baixado em Markdown. Gerar arquivos não realiza a entrega ao professor.

## Verificação desta revisão — 07/10/2026

35 verificações locais no Chromium com os arquivos montados em uma página de teste, além de extração e inspeção visual do PDF gerado: adicionar/remover nomes; preenchimento obrigatório; download real; nomes acentuados; nome do professor; A4; paginação; justificação; conservação das respostas; texto de 3000 caracteres; palavra longa; rejeição explícita de caractere não suportado; JSON v1/v2; importação inválida sem perda de dados; responsividade em 320, 390, 768 e 1280 pixels; ausência de chamadas externas e de erros JavaScript. Os hashes dos quatro arquivos enviados foram comparados aos arquivos efetivamente testados.

Referência técnica de fontes padrão: HexaPDF, Standard PDF Fonts, https://hexapdf.gettalong.org/examples/standard_pdf_fonts.html (consulta: 07/10/2026).
