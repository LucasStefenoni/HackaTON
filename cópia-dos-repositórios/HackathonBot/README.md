# Documentação do Repositório: HackathonBot

## Visão Geral
O repositório contém um bot do Telegram desenvolvido em **Node.js** com integração ao **Prisma** e **Express**. Ele é projetado para gerenciar grupos financeiros (bags), registrar transações, calcular divisões de contas e facilitar pagamentos entre os participantes.

---

## Estrutura do Projeto

### Diretórios e Arquivos Principais:
- **index.js**: Arquivo principal que implementa o bot do Telegram e define as rotas para interações.
- **prisma/schema.prisma**: Define o esquema do banco de dados, incluindo tabelas para usuários, bags, transações e pagamentos pendentes.
- **cronjobacorda.js**: Implementa uma rota de saúde para verificar se o bot está ativo.
- **package.json**: Lista as dependências do projeto e scripts para execução.
- **.env**: Configurações de ambiente, como chaves de API e conexão com o banco de dados.
- **.gitignore**: Arquivos e diretórios ignorados pelo Git.

---

## Funcionalidades Principais

### 1. **Gerenciamento de Bags**
- Criação de bags com comando `/createBag`.
- Listagem de participantes e transações.
- Finalização de bags com cálculo de divisão de contas.

### 2. **Transações**
- Registro de transações financeiras com o comando `/g`.
- Integração com APIs externas para atualizar os gastos dos participantes.

### 3. **Divisão de Contas**
- Cálculo de quem deve pagar a quem ao finalizar uma bag.
- Registro de pagamentos pendentes no banco de dados.

### 4. **Integração com Telegram**
- Autenticação e interação com grupos e usuários via Telegram API.
- Mensagens formatadas com Markdown e HTML.

### 5. **Banco de Dados**
- **Prisma**: Utilizado para gerenciar o banco de dados PostgreSQL.
- Tabelas principais:
  - **User**: Informações dos usuários, incluindo carteira conectada.
  - **Bag**: Detalhes das bags, como nome, estado e participantes.
  - **Transaction**: Registro de transações financeiras.
  - **PendingPayment**: Pagamentos pendentes entre os participantes.

---

## Pontos Chave

### **Telegram API**
- O bot interage com grupos e usuários via Telegram API.
- Mensagens e botões inline são utilizados para facilitar a interação.

### **Prisma**
- ORM utilizado para gerenciar o banco de dados PostgreSQL.
- Esquema definido em `prisma/schema.prisma`.

### **APIs Externas**
- **`newtransaction`**: Atualiza os gastos dos participantes com base em uma nova transação.
- **`splitbill`**: Calcula a divisão de contas ao finalizar uma bag.

### **Segurança**
- Uso de variáveis de ambiente para armazenar chaves de API e tokens.
- Autenticação via carteira TON para garantir que os participantes estejam conectados.

---

## Observações
- O bot utiliza comandos específicos para interações, como `/g` para registrar transações e `/finalizar` para finalizar uma bag.
- A integração com APIs externas requer chaves de autenticação configuradas no `.env`.
- O esquema do banco de dados é projetado para gerenciar usuários, bags, transações e pagamentos pendentes de forma eficiente.
