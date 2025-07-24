# Documentação do Repositório: HackatonMiniApp

## Visão Geral
O repositório contém um projeto baseado em **Next.js** com integração ao **Telegram** e **TonConnect**, focado em gerenciamento de grupos financeiros (bags). Ele permite criar, gerenciar e finalizar bags, registrar transações financeiras, e realizar divisão de contas entre os participantes.

---

## Estrutura do Projeto

### Diretórios Principais:
- **hackatonminiapp/**: Diretório principal do projeto.
  - **app/**: Contém as páginas e APIs do projeto.
    - **group/[id]/page.tsx**: Página de detalhes de uma bag, incluindo transações e pagamentos pendentes.
    - **perfil/page.tsx**: Página de perfil do usuário, com integração de carteira.
    - **api/**: Rotas para APIs, como:
      - `userBags`: Retorna as bags associadas ao usuário.
      - `bagDetails`: Detalhes de uma bag específica.
      - `pendingPayments`: Pagamentos pendentes de uma bag.
      - `saveWallet`: Salva a carteira do usuário.
      - `markPaid`: Marca um pagamento como realizado.
  - **components/**: Contém componentes reutilizáveis, como:
    - `TransactionItem.tsx`: Exibe detalhes de uma transação.
    - `MemberCard.tsx`: Exibe informações de um membro da bag.
  - **contexts/**: Gerencia o contexto do Telegram e tema do aplicativo.
    - `TelegramContext.tsx`: Fornece dados do usuário e tema do Telegram.
  - **contracts/**: Contém contratos inteligentes relacionados a pagamentos e taxas.
    - `fee_payment.tact`: Contrato para gerenciamento de taxas e pagamentos.
  - **prisma/**: Configuração e esquema do banco de dados.
  - **public/**: Arquivos públicos, como favicon.

### Arquivos Importantes:
- **README.md**: Documentação básica do projeto.
- **package.json**: Dependências e scripts do projeto.
- **.env**: Configurações de ambiente, como chaves de API.
- **global.d.ts**: Declarações globais para integração com o Telegram.

---

## Funcionalidades Principais

### 1. **Gerenciamento de Bags**
- Criação, edição e finalização de bags.
- Listagem de participantes e transações.

### 2. **Transações**
- Registro de transações financeiras.
- Cálculo de pagamentos pendentes e divisão de contas.

### 3. **Integração com Telegram**
- Autenticação via Telegram.
- Uso de tema e dados do usuário fornecidos pelo Telegram.

### 4. **Integração com APIs Externas**
- **`splitbill`**: Calcula divisão de contas entre os participantes.
- **`newtransaction`**: Registra novas transações financeiras.

### 5. **TonConnect**
- Integração com carteiras Ton para pagamentos on-chain.

---

## Tecnologias Utilizadas
- **Next.js**: Framework para desenvolvimento web.
- **Prisma**: ORM para interação com o banco de dados.
- **Telegram SDK**: Integração com o Telegram.
- **TonConnect**: Integração com blockchain Ton.
- **TypeScript**: Tipagem estática para maior segurança.

---
