<p>
    <img src=".github/ignews.png" width="100%">
</p>

## :rocket: Tecnologias

Foram usadas as seguintes tecnologias:

- [React.js](https://pt-br.reactjs.org)
- [Next.js](https://nextjs.org)
- [Sass](https://sass-lang.com)
- [Stripe](https://stripe.com/br) como serviço de pagamento

## :computer: Projeto

O ignews é uma plataforma com o objetivo de mostrar posts de notícias sobre React aos seus usuários diariamente. O usuário pode se cadastrar através do Github e assinar o plano mensal para ter uma lista disponível de posts. Outro objetivo da plataforma, é aprender os principais conceitos do Framework Next.JS.

## :thinking: Como rodar o projeto?

1. Rodar `yarn` no terminal para instalar as dependências

2. Criar uma conta no Stripe e criar um arquivo env.local na raiz do projeto

3. Copiar a secret_key do Stripe e colocar em uma no arquivo env.local da seguinte forma:

```
STRIPE_API_KEY=your_secret_key
```

4. Executar `yarn dev` para iniciar o projeto
