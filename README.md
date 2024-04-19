# pass.in

`Node.js` | `TypeScript` | `Fastify` | `Prisma` | `Swagger` | `Vitest`

O pass.in é uma aplicação de gestão de participantes em eventos presenciais.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos funcionais

- [x] O organizador deve poder cadastrar um novo evento;
- [x] O organizador deve poder visualizar dados de um evento;
- [x] O organizador deve poder visualizar a lista de participantes;
- [x] O participante deve poder se inscrever em um evento;
- [x] O participante deve poder visualizar seu crachá de inscrição;
- [x] O participante deve poder realizar check-in no evento;

### Regras de negócio

- [x] O participante só pode se inscrever em um evento uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [x] O check-in no evento será realizado através de um QRCode;

## Teste a aplicação em sua máquina

Certifique-se de ter o Docker instalado em sua máquina antes de prosseguir.

- [Docker](https://www.docker.com/)

1. Faça o clone do projeto

```bash
git clone https://github.com/marcosparreiras/nlw-15-node.git
```

2. Navegue até diretório do projeto e execute os containers docker com o comando:

```bash
docker compose up -d --build
```

3. Com os conatiners em execução, você pode abrir a documentação swagger da aplicação acessando a seguinte URL:

Seguindo a documentação você pode usar a api livremente

```bash
http://localhost:3000/docs
```

4. Caso queira executar os testes automatizados voce pode executar:

Para testes de unidade:

```bash
npm run test:unit
```

ou

Para testes end-to-end: (certifique-se de ter o container do banco de dados em execução)

```bash
npm run test:unit
```
