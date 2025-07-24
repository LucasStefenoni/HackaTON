# Resumo do Repositório: HackatonMiniApp

## Estrutura do Projeto
O repositório contém um projeto baseado em **Next.js** com integração ao **Telegram** e **TonConnect**. Ele é dividido em várias pastas e arquivos que implementam funcionalidades como autenticação, gerenciamento de bags, transações financeiras e integração com APIs externas.

### Principais Pastas:
- **hackatonminiapp/**: Contém o código principal do projeto.
  - **app/**: Implementa as páginas e APIs do projeto.
    - **group/[id]/page.tsx**: Página de detalhes de uma bag, incluindo transações e pagamentos pendentes.
    - **perfil/page.tsx**: Página de perfil do usuário, com integração de carteira.
    - **api/**: Contém rotas para APIs, como:
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
  - **lib/**: Contém funções auxiliares, como:
    - `telegramFetch.ts`: Realiza requisições autenticadas com o Telegram.
  - **contracts/**: Contém contratos inteligentes relacionados a pagamentos e taxas.
    - `fee_payment.tact`: Contrato para gerenciamento de taxas e pagamentos.
  - **public/**: Arquivos públicos, como favicon.

### Arquivos Importantes:
- **README.md**: Documentação básica do projeto.
- **package.json**: Dependências e scripts do projeto.
- **.env**: Configurações de ambiente, como chaves de API.
- **global.d.ts**: Declarações globais para integração com o Telegram.

## Funcionalidades Principais
1. **Gerenciamento de Bags**:
   - Criação, edição e finalização de bags.
   - Listagem de participantes e transações.

2. **Transações**:
   - Registro de transações financeiras.
   - Cálculo de pagamentos pendentes e divisão de contas.

3. **Integração com Telegram**:
   - Autenticação via Telegram.
   - Uso de tema e dados do usuário fornecidos pelo Telegram.

4. **Integração com APIs Externas**:
   - `splitbill`: Calcula divisão de contas.
   - `newtransaction`: Registra novas transações.

5. **TonConnect**:
   - Integração com carteiras Ton para pagamentos on-chain.

## Tecnologias Utilizadas
- **Next.js**: Framework para desenvolvimento web.
- **Prisma**: ORM para interação com o banco de dados.
- **Telegram SDK**: Integração com o Telegram.
- **TonConnect**: Integração com blockchain Ton.
- **TypeScript**: Tipagem estática para maior segurança.

## Como Executar
1. Instale as dependências:
   ```bash
   npm install
