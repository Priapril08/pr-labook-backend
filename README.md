PROJETO BACKEND LABOOK


    O projeto Labook foi desenvolvido durante o BootCamp Labenu no módulo BackEnd, com o intuito de promover conexão e interação entre as pessoas.Após feito cadastro no aplicativo pode ser feito posts, e dar like e dislike nestas publicações.
    
--

##  Sobre

Aplicação com criação de API e banco de dados, no qual foi feito a implementação de segurança, códigos escaláveis e arquitetura. Baseado em um app no qual os usuários se cadastram, e após feito, poderão fazer seus posts, e terão a possibilidade de interagir entre si, dando like e dislikes nas publicações. 

--

##  Quem Fez 

- Projeto feito individual, by me *Priscila de Assumpção de Moraes, sob supervisão dos instrutores da Labenu.

--

##  🧭Status do Projeto

 ☑️ ⌛ Feito

--

##  🎯Objetivo do Projeto

Este é um projeto de Back-end, desenvolvido no bootcamp da Labenu, cujo o principal objetivo é estudar e compreender: 
> NodeJS
> Typescript
> Express
> SQL e SQLite
> Knex
> POO
> Arquitetura em camadas
> Geração de UUID
> Geração de hashes
> Autenticação e autorização
> Roteamento
> Postman - (API documentada)

--

## ☑️ Listas dos Requisitos 

- O enum roles e o payload do token JWT, estão no formato que segue:

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
}

- Documentação Postman de todos os endpoints (todos protegidos):

* USERS:
- [x] SIGNUP => Utilizado para cadastrar os users, e devolve um token jwt;
- [x] LOGIN => Utilizado para logar, e devolve um token jwt;
- [x] GET (acessa todos os users) => Requer o token e apenas o role ADMIN, tem acesso.

* POSTS:
- [x] POST (cria um post) => Requer o token jwt gerado no signup ou login;  
- [x] GET (acessa todos os posts) => Requer o token, porém apenas o user role ADMIN, tem acesso;
- [x] EDIT (edita o post) => Requer o token, sendo que apenas quem criou o post poderá editá-lo;
- [x] DELETE (deleta o post) => Requer o token, sendo que ADMIN é o único que poderá deletar o post.

* LIKES _ DISLIKES:
- [x] LIKE_DISLIE => Em um único endpoint funciona para ambos. Requer token, quem cria não pode dar like e dislike ao mesmo tempo.

--

## 💡Concepção do Projeto

- **Modelagem do Banco de Dados : https://dbdiagram.io/d/63ebc288296d97641d80ea1c 

Para esse projeto são modelados três entidades : Users, Posts e Likes e Dislikes.  Cada um com as seguintes caracteristicas :

→ Users -  id, name, email, password, role e created_at;
→ Posts - id, creator_id, content, likes, dislikes, created_at e update_at;
→ Likes_dislikes - user_id, post_id e like. Sendo que este é uma relação entre users e posts

--

## 🛰Rodando o Projeto

Segue o link do Postman com os Endpoints para serem testados:

Para Rodar o projeto, siga as seguintes etapas :

* USERS: http://localhost:3003//users/

- SignUp - Incluir no http após users incluir /signup. No Body: incluir name, email e password. E deixar raw + JSON clicados ( vide exemplo doc postman);

- Login - Incluir no http após users incluir /login. No Body: incluir email e password. E deixar raw + JSON clicados ( vide exemplo doc postman);

- GetAllUsers - Em Headers, clicar em Authorization e incluir em Value um token de um user ADMIN, para visualizar todos os users cadastrados. 


* POSTS: http://localhost:3003/posts

- CreatePost - Em Headers, clicar em Authorization e incluir em Value o token do user que vai criar o post. Incluir o creatorId e content. E deixar raw + JSON clicados ( vide exemplo doc postman);

- EditPost - Incluir no http após posts incluir /:id . Em Params/Path Variables, incluir o id do post, que será editado.Em Headers, clicar em Authorization e incluir em Value o token do próprio user que criou o post que terá o content editado. Incluir o novo content. E deixar raw + JSON clicados ( vide exemplo doc postman);

- DeletePost - Incluir no http após posts incluir /:id . Em Params/Path Variables, incluir o id do post, que será deletado.Em Headers, clicar em Authorization e incluir em Value o token do próprio user que criou o post ou de um user ADMIN. ( vide exemplo doc postman);

- GetAllPosts - Em Headers, clicar em Authorization e incluir em Value um token de um user ADMIN, para visualizar todos os posts dos users cadastrados. 


* LIKES _ DISLIKES: http://localhost:3003/posts/:id/like

- Likes_Dislikes - Em Params/Path Variables, incluir o id do post, que será dado like ou dislike.Em Headers, clicar em Authorization e incluir em Value o token do próprio user que dará o like ou dislike. Incluir o like: false (vale como dislike) ou true (vale como like) ( vide exemplo doc postman);


###  Documentação API 

https://documenter.getpostman.com/view/27687742/2s9Xy5MW6W 




