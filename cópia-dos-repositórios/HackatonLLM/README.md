# Documentação do Repositório: HackatonLLM

## Visão Geral
O repositório contém uma API baseada em **Flask** que utiliza modelos de IA da **Google Generative AI** para processar transações financeiras e calcular divisões de contas. Ele é projetado para ser executado em um ambiente Docker e fornece endpoints seguros para integração com sistemas externos.

---

## Estrutura do Projeto

### Diretórios e Arquivos Principais:
- **Dockerfile**: Define a imagem Docker para o projeto, incluindo dependências e configuração do servidor Gunicorn.
- **docker-compose.yml**: Configura o serviço Docker para executar a API, mapeando portas e carregando variáveis de ambiente.
- **api.py**: Contém a lógica principal da API, incluindo integração com modelos de IA e definição de endpoints.
- **requirements.txt**: Lista as dependências do projeto, como Flask e Google Generative AI.
- **.env**: Arquivo para variáveis de ambiente, como chaves de API e tokens de autenticação.
- **.env.example**: Exemplo de configuração de variáveis de ambiente.
- **.gitignore**: Lista de arquivos e diretórios ignorados pelo Git.

---

## Funcionalidades Principais

### 1. **Processamento de Transações**
- Endpoint `/newtransaction`: Recebe uma nova transação e atualiza os dados financeiros de um grupo.
- Utiliza o modelo de IA `gemini-2.0-flash` para interpretar e atualizar o JSON com base na descrição da transação.

### 2. **Divisão de Contas**
- Endpoint `/splitbill`: Calcula como os gastos devem ser divididos entre os participantes de um grupo.
- Utiliza o modelo de IA `gemini-2.0-flash` para gerar um plano de pagamento simplificado.

### 3. **Segurança**
- Autenticação via Bearer Token para proteger os endpoints.
- Logs detalhados para monitorar acessos e erros.

### 4. **Modelos de IA**
- **LLM1 (Calculadora)**: Atualiza um JSON com base em uma nova transação.
- **LLM2 (Guardião de JSON)**: Extrai e valida JSONs gerados pelos modelos de IA.
- **LLM3 (Divisão de Contas)**: Calcula a divisão de despesas e gera um plano de pagamento.

---

## Pontos Chave

### **Docker**
- O projeto é containerizado usando Docker, garantindo portabilidade e facilidade de configuração.
- O `docker-compose.yml` simplifica a execução do serviço, mapeando portas e carregando variáveis de ambiente.

### **Flask**
- Framework utilizado para criar a API.
- Endpoints bem definidos para processar transações e calcular divisões de contas.

### **Google Generative AI**
- Modelos de IA avançados para interpretar descrições de transações e calcular divisões financeiras.
- Configuração via chave de API (`GEMINI_API_KEY`).

### **Segurança**
- Autenticação via Bearer Token (`API_BEARER_TOKEN`) para proteger os endpoints.
- Logs detalhados para monitorar acessos e erros.

---

## Observações
- O projeto utiliza modelos de IA para processar e calcular dados financeiros.
- As variáveis de ambiente devem ser configuradas corretamente para garantir o funcionamento da API.
- A estrutura do Docker garante que o projeto seja executado de forma consistente em
