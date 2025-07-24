# Documentação do Repositório: HackathonTransferencePolling

## Visão Geral
Este repositório contém um serviço desenvolvido em **TypeScript** que utiliza **Prisma** para interagir com o banco de dados e gerenciar transferências financeiras. Ele é projetado para realizar polling de transferências e atualizar o estado das transações no banco de dados.

---

## Estrutura do Projeto

### Diretórios e Arquivos Principais:
- **src/index.ts**: Arquivo principal que implementa a lógica de polling e interação com o banco de dados.
- **prisma/schema.prisma**: Define o esquema do banco de dados, incluindo tabelas para transferências e estados.
- **package.json**: Lista as dependências do projeto e scripts para execução.
- **tsconfig.json**: Configuração do TypeScript para o projeto.
- **.gitignore**: Arquivos e diretórios ignorados pelo Git.

---

## Funcionalidades Principais

### 1. **Polling de Transferências**
- Verifica periodicamente o estado das transferências financeiras no banco de dados.
- Atualiza o estado das transferências com base em condições específicas.

### 2. **Banco de Dados**
- **Prisma**: Utilizado para gerenciar o banco de dados PostgreSQL.
- Esquema definido em `prisma/schema.prisma` com tabelas para:
  - **Transferências**: Registro de transferências financeiras.
  - **Estados**: Estados associados às transferências.

### 3. **TypeScript**
- Tipagem estática para maior segurança e clareza no desenvolvimento.
- Configuração personalizada no arquivo `tsconfig.json`.

---

## Pontos Chave

### **Prisma**
- ORM utilizado para gerenciar o banco de dados PostgreSQL.
- Esquema definido em `prisma/schema.prisma`.

### **Polling**
- Implementação eficiente de polling para verificar e atualizar transferências financeiras.

### **Configuração**
- Uso de variáveis de ambiente para configurar o banco de dados e outros parâmetros necessários.

---

## Observações
- O projeto utiliza **Prisma** para interagir com o banco de dados e realizar operações de leitura e escrita.
- A lógica de polling é implementada no arquivo `src/index.ts`.
- O esquema do banco de dados é projetado para gerenciar transferências financeiras e seus estados de
