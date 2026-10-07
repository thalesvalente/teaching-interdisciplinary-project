# Ficha guiada da equipe — 2.4.0

## Revisão didática do caso de Memórias Quilombolas

O caso de Memórias foi reescrito para ser autoexplicativo. A expressão ambígua “cópia para a oficina” foi eliminada. A situação agora apresenta três registros em sequência:

1. **Ficha completa da memória:** contém título, categoria e a orientação de uso.
2. **Folha de consulta da oficina:** preparada pela equipe do projeto, contém título e categoria, mas não a orientação sobre uso e publicação.
3. **Pergunta do participante:** a equipe entrega a folha a um participante, que pergunta oralmente se pode fotografar e publicar o material. O caso não informa a resposta.

Assim, a primeira troca tem atores e meio explícitos (equipe do projeto → folha de consulta → participante) e a segunda também (participante → pergunta oral → equipe do projeto). O ponto desconhecido foi deslocado para algo pedagogicamente útil: a resposta sobre autorização e o que ocorreu depois.

As 22 dicas de Memórias foram reescritas para apontar diretamente aos três registros, indicar onde procurar cada resposta e impedir que a equipe invente atores, meios ou consequências. A próxima tarefa passa a preparar a Aula 6: verificar quais orientações de uso e autorização precisam acompanhar uma memória antes de consulta, fotografia ou publicação.

## Linguagem da interface

“Cópia” deixou de ser usada também para o arquivo JSON de continuidade. A interface chama esse arquivo de **rascunho**, evitando que a mesma palavra signifique simultaneamente um artefato do caso e um backup da ficha.

## O que permanece

A seleção única do projeto continua controlando as dicas. Permanecem os 22 campos guiados, os dois cartões de troca, distinção entre campo vazio e dúvida registrada, integrantes, data local, exemplo preenchido de Horários IFMA, exportação PDF/Markdown e rascunho JSON.

O PDF formal permanece com o template aprovado: capa institucional, identificação, controle documental, seções numeradas, texto justificado e paginação A4. As dicas não entram no PDF como respostas dos estudantes.

Rascunhos de versões anteriores (schemas v1, v2 e v3) continuam importáveis. O schema permanece `ppi-f01-v3` para não quebrar arquivos já produzidos.

## Princípio didático adotado

A ficha deve fornecer todo o contexto necessário para que um estudante do 2º ano consiga compreender a situação antes de responder. Uma dúvida do caso deve ser uma **dúvida investigável**, não uma lacuna criada porque o enunciado deixou de explicar quem fez o quê.

## Verificação desta revisão — 07/10/2026

Verificações estáticas confirmam: ausência da expressão “cópia para a oficina”; caso de Memórias consistente entre ficha e apresentação; 22 dicas específicas preservadas; sintaxe JavaScript válida; seleção única de projeto; compatibilidade do schema; e linguagem de “rascunho” nos controles de continuidade.
