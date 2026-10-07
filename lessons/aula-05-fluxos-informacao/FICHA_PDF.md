# Ficha guiada da equipe — 2.3.0

## O que muda nesta versão

A escolha única do projeto controla as orientações dos 22 campos de resposta. Cada campo tem uma dica específica, um painel “Ver trecho e ajuda para escrever”, os registros originais relevantes e um início de frase para o estudante completar. As orientações não preenchem respostas nem entram no PDF.

Os textos dos casos fictícios de Memórias Quilombolas e Permanência e Evasão Escolar foram mantidos literalmente. A ajuda aponta também os limites do material: no caso de Memórias, por exemplo, não são identificados o responsável pela cópia nem os leitores. Não se exige inventar participantes ou um repasse posterior.

A seção 4 apresenta cada troca em um cartão: quem envia, conteúdo, meio, destinatário e finalidade. Campos vazios são distinguidos de frases que expressam dúvida. As trocas não são ligadas automaticamente, e as setas não comprovam envio, recebimento ou leitura. O contador informa apenas quantos campos têm texto, não a qualidade das respostas.

Expressões genéricas como “emissor”, “receptor”, “mensagem” e “para saber” acionam dicas de escrita por comparação textual simples. Não há nota, correção factual ou inteligência artificial avaliando o conteúdo.

Ao mudar de projeto depois de responder, a ficha pede confirmação e preserva o texto, lembrando que a equipe precisa revê-lo. O exemplo preenchido de Horários IFMA continua em outra aba.

## O que permanece

Nomes dos componentes, professor e instituição fixos, data local do dispositivo, uma ficha por equipe, exportação PDF/Markdown e cópia JSON. Os identificadores de campo e o schema ppi-f01-v3 são preservados. Rascunhos v1, v2 e v3 podem ser importados.

O gerador formal aprovado, extraído sem alterações do HTML da versão anterior, permanece em atividade-pdf.js. Mantém capa, identificação, controle documental, corpo justificado e paginação A4. As dicas não são exportadas como se fossem respostas. O esquema visual da seção 4 auxilia o preenchimento; o PDF mantém os campos textuais do template aprovado.

O PDF direto usa fontes padrão Times-Roman/Times-Bold e caracteres WinAnsi, sem arquivos de fontes distribuídos. Para caracteres não suportados, oferece a versão HTML de impressão sem descartá-los silenciosamente. Não declara conformidade ABNT, PDF/A ou PDF/UA.

Os arquivos são locais ao site, sem bibliotecas externas, login, armazenamento automático ou envio de nomes e respostas. Guarde a cópia JSON antes de atualizar ou fechar a página. Não publique documentos com nomes em repositórios públicos.

## Organização técnica

Ficha_Equipe_Aula_05_PPI.html carrega ficha.css e, com defer e nesta ordem, atividade-pdf.js, ficha-ajuda.js e ficha.js. A inicialização principal também espera DOMContentLoaded quando necessário, impedindo a regressão que deixava data e integrantes vazios.

## Verificação — 07/10/2026

52 verificações locais aprovadas: inicialização e data; adicionar/remover integrantes; seleção única; 22 dicas por projeto; trechos de apoio; ausência de preenchimento automático; dicas para expressões genéricas; dúvidas versus campos vazios; confirmação e cancelamento de troca do projeto; preservação de respostas; exportações reais em PDF, JSON e Markdown; nomes acentuados; professor; importação v1/v2/v3; rejeição de JSON inválido sem alterar campos; texto longo; proteção contra HTML digitado; layouts de 320, 390, 768, 1024 e 1440 px; ausência de exceções JavaScript; casos originais inalterados.

A interface foi renderizada em memória no Chromium, com os mesmos conteúdos de CSS/JS e inicialização após o DOM. O navegador do ambiente bloqueia navegação para URLs externas e localhost; por isso esse teste não equivale a um teste de navegação no site publicado. Downloads por clique foram executados. O PDF de regressão foi extraído e inspecionado visualmente no PyMuPDF. A publicação é verificada separadamente pelos jobs do GitHub Pages.

Os cinco blobs de produção foram comparados aos hashes dos arquivos efetivamente testados antes de integrar ao main.
