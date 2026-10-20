# Aula 06 — ativação da entrega automática (Google Sheets + Apps Script)

**Planilha privada:** [interdisciplinary-project-2026](https://docs.google.com/spreadsheets/d/1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE/edit)

## Habilitação

1. Abra a planilha e escolha **Extensões → Apps Script**.
2. Substitua o conteúdo de **Code.gs** pelo arquivo [appscript/Code.gs](appscript/Code.gs) desta pasta.
3. Salve e selecione **Implantar → Nova implantação → Aplicativo da Web**.
4. Configure **Executar como: eu**, permitindo acesso externo somente se isso for aprovado pela política institucional. A página pública não autentica o aluno; controle a identificação antes de usar os resultados como avaliação oficial.
5. Autorize as permissões solicitadas e copie a URL que termina em **/exec**.
6. Edite **entrega-appscript.js**, defina **ENDPOINT** com essa URL; faça o commit da configuração e publique a página.
7. Teste com uma equipe fictícia e duas submissões do mesmo nome. Confirme que permanece apenas uma linha por aluno+atividade, com a data mais recente.
8. Teste também um aluno com nome acentuado e a ordenação alfabética.

## Regras da integração

- Uma linha por componente da equipe por atividade; a última submissão de uma pessoa prevalece.
- A chave usa atividade + nome normalizado (não há matrícula ou autenticação nesta V1).
- O PDF **não é enviado nem armazenado**; somente seu SHA-256 acompanha os dados.
- O hash do PDF é obtido **no navegador**; não comprova por si só que os bytes correspondem às respostas do registro.
- SHA-256 das respostas e HMAC vinculado a aluno/equipe, data do servidor e documento.
- O HMAC é criado apenas dentro do Apps Script; a chave fica em Script Properties.
- A pontuação de risco (chance × impacto) **não é nota**. XP é pontuação formativa do cliente, **não é nota oficial**. A planilha recebe inicialmente **Nota vazia / Avaliação pendente**.
- Questões em branco são permitidas, com pontuação formativa parcial do modelo atual.
- O botão gera o PDF localmente e tenta registrar a entrega. Sem URL /exec, exibirá claramente que **não houve entrega**.
- Não publicar planilha, respostas ou tokens no repositório público.
- Uma contestação da nota exige decisão do docente. Os dados da última entrega substituem os anteriores; isto é a regra solicitada, logo não há histórico preservado.
- Se vários estudantes usarem o mesmo nome, eles conflitarão na chave. Para avaliação formal, adaptar para matrícula/identificador individual validado.
- O transporte usa POST em iframe, com nonce e verificação de origem no cliente. O uso público exige controles adicionais antiabuso e autenticação para notas oficiais.

## Limitações conhecidas

A API conectada ao ChatGPT não fornece uma operação para criar e publicar Apps Script na conta Google. A configuração do Code.gs e autorização de implantação precisam ocorrer na conta do responsável pela planilha. Não considerar a funcionalidade operacional antes do teste real de recebimento.

O professor não deve publicar notas ou respostas em repositório público, nem considerar os hashes um substituto para controle de identidade e verificação pedagógica.
