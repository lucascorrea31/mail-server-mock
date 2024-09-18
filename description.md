## Descrição do Projeto

Foi usado o framework NestJS para construir um backend robusto e consistente, provendo uma API simples e funcional para o desafio.
Para persistência dos dados, foi usado arquivos JSON fazendo uma analogia/abstração ao NoSQL com o objetivo de simplificar a solução e facilitar a execução. Claramente reconheço não ser a melhor abordagem, mas assim foi feito apenas para viabilizar o projeto.

##### Usuário
Temos duas rotas de API para as preferências de usuário:
- [GET] user/preferences/{id}
  Busca a preferência de usuário já salva anteriormente OU cria uma nova com o valor `"auto"` pré-definida.

  Reponse:
  `{"id":"4","mode":"dark"}`

- [POST] user/preferences/{id}
  Salva a preferência de usuário, garantindo o modo como `"auto" | "dark" | "light"`.

  Request:
  `{"mode":"light"}`

  Reponse:
  `{"id":"4","mode":"light"}`

##### Email
Temos três rotas de API para tratar os emails:
- [GET] email/all
  Lista todos os emails válidos. Entendendo que os emails válidos são os que não são SPAM.

  Response:
  [
    {
      "from": "newsletter@company.com",
      "subject": "Weekly Update",
      "body": "Here are the latest updates from our company. We are proud to announce our new product line."
    }
  ]

- [POST] email/receive
  Rota para o recebimento de um novo email. Ao receber a requisição, o email passará pela classificação utilizando o método Bayesiano para definir se é ou não SPAM. Se não for considerado SPAM, o email será salvo e adicionado à lista de emails.

  Request:
  ```
  {
    "from": "newsletter@company.com",
    "subject": "Weekly Update",
    "body": "Here are the latest updates from our company. We are proud to announce our new product line."
  }
  ```
  Response:
  `"Email marked as spam by Bayesian filter."`
  OU
  `"Email received successfully."`

- [POST] email/train
  Rota de API responsável por treinar o algorítmo Bayesiano para a detecção de SPAM.

  Request:
  ```
  [
    {
      "email": {"from": "spam@spammer.com", "subject": "WIN big money", "body": "Click here to win now!"},
      "isSpam": true
    },
    {
      "email": {"from": "newsletter@trusted.com", "subject": "Monthly Update", "body": "Here are the updates for this month"},
      "isSpam": false
    }
  ]
  ```
  Response:
  `"Bayesian filter trained successfully."`

O sistema Bayesiano, a partir de um treinamento do que é e do que não é SPAM, ele tokeniza o novo email recebido e o avalia calculando a probabilidade deste ser ou não um SPAM.
Uma melhoria a se fazer, é fazer com que este treinamento seja constante e com a possibilidade de atuação do usuário para definir o que é ou não SPAM para poder tratar os falsos positivos e falsos negativos.
Atualmente, os emails marcados como SPAM são descartados.

O treinamento inicial acontece ao se criar uma instância do controlador de emails.