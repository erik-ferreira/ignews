<p>
    <img src=".github/ignews.png" width="100%">
</p>

## :rocket: Tecnologias

Foram usadas as seguintes tecnologias:

- [React.js](https://pt-br.reactjs.org)
- [Next.js](https://nextjs.org)
- [Sass](https://sass-lang.com)
- [Github](https://github.com) para autenticação
- [Stripe](https://stripe.com/br) como serviço de pagamento
- [FaunaDB](https://fauna.com) como banco de dados

## :computer: Projeto

O ignews é uma plataforma com o objetivo de mostrar posts de notícias sobre React aos seus usuários diariamente. O usuário pode se cadastrar através do Github e assinar o plano mensal para ter uma lista disponível de posts. Outro objetivo da plataforma, é aprender os principais conceitos do Framework Next.JS.

## :thinking: Como rodar o projeto?

1. Rodar `yarn` no terminal para instalar as dependências

2. Criar um arquivo env.local na raiz do projeto

3. No seu Github, nas `developers settings > OAuth Props > New OAuth App`

   - Em Homepage URL = http://localhost:3000
   - Em Authorization callback URL = http://localhost:3000/api/auth/callback
   - Os outros dados são de sua preferência

4. Copie sua Client ID, e clique em Generate a new client secret(essa secret key não fica disponível sempre, depois de um tempo ela será ocultada), e cole da seguinte forma no env

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

5. Criar uma conta e um projeto no [Stripe](https://stripe.com/br)

6. Copiar a secret_key e a public_key do Stripe e colocar em uma variavel ambiente no arquivo env

```
STRIPE_API_KEY=your_secret_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_public_key

// Cole também essas variaveis
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000
```

7. Crie uma conta no [FaunaDB](https://dashboard.fauna.com) e crie um database com a region group Classic

8. Va no database que foi criado, em `Security > New key`

9. Crie essa key com a role Admin, e copie essa key, pois ela também vai ser ocultada depois de um tempo, e coloque da seguinte forma no arquivo env

```
FAUNADB_KEY=your_faunadb_key
```

10. Volte na dashboard do [Stripe](https://stripe.com/br), adicione um novo produto(de preferência com o nome Subscription e o preço pode ser de sua escolha).
    Copie o ID da API desse produto, e troque nos arquivos:

```js
// pages/index.tsx
const price = await stripe.prices.retrieve("your_id_api_product");

// pages/api/subscribe.ts
line_items: [{ price: "your_id_api_product", quantity: 1 }],
```

11. Agora instale o Stripe CLI seguinda essa [documentação](https://stripe.com/docs/stripe-cli) ou instale através do [Chocolatey](https://community.chocolatey.org/packages/stripe-cli) no Windows.

    - No terminal rode `stripe login`
    - Depois rode `stripe listen --forward-to localhost:3000/api/webhooks`

      - Esse comando vai te retornar uma `webhook secret key`, copie ela e cole no arquivo env e deixe o terminal executando

      ```
      STRIPE_WEBHOOK_SECRET=your_webhook_secret
      ```

12. Agora basta executar `yarn dev` para iniciar o projeto
