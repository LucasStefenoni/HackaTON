# 💸 SplitBill – Despesas compartilhadas com IA e Web3 no Telegram

**SplitBill** é um mini-app descentralizado que vive dentro do Telegram e permite que amigos registrem e dividam despesas em grupo de forma **inteligente**, **automatizada** e **integrada à blockchain da TON**.

Projetado para situações como viagens, rolês, festas ou pedidos coletivos, o SplitBill entende mensagens escritas em linguagem natural, calcula quem deve para quem, e permite pagamentos diretos via **Toncoin** ou **stablecoins (jUSDT)** — tudo isso sem sair do Telegram.

## 🤖 Powered by IA + TON

Este projeto combina duas tecnologias de ponta:
- **Inteligência Artificial (IA)**: utilizamos um modelo de linguagem (LLM) para interpretar mensagens como “Paguei R$120 no Uber”, entendendo o contexto e calculando automaticamente os débitos e créditos entre os membros.
- **Blockchain da TON**: os pagamentos são feitos diretamente com **Toncoin** ou **jUSDT**, de forma segura, transparente e descentralizada, via carteiras integradas no Telegram.

## 🚀 Funcionalidades

- 🧠 Interpretação automática de mensagens com linguagem natural usando LLM.
- 📩 Registro rápido de despesas em grupo.
- 🧾 Painel individual de saldos (o que você pagou, deve ou tem a receber).
- 💸 Pagamentos Web3 com **Toncoin** ou **jUSDT**, direto no Telegram.
- 🔄 Experiência fluida e descentralizada, sem sair do app.

## 🧱 Arquitetura do Projeto

O projeto é composto por quatro módulos principais:

### 1. Mini App do Telegram (Frontend)
Interface leve e responsiva acessível diretamente no Telegram.

🔗 Repositório: [HackatonMiniApp](https://github.com/senderro/HackatonMiniApp)  
☁️ Hospedagem: Vercel

---

### 2. Bot do Telegram (Orquestrador)
Gerencia as interações com os usuários, aciona o LLM, atualiza os dados e interage com os demais serviços.

🔗 Repositório: [HackathonBot](https://github.com/senderro/HackathonBot)  
☁️ Hospedagem: _(preencher com a plataforma usada)_

---

### 3. LLM (Processamento de linguagem natural)
Recebe frases do usuário, identifica quem pagou, o valor, os envolvidos e responde com a divisão correta da despesa.

🔗 Repositório: _(em breve)_  
☁️ Hospedagem: Container no Railway

---

### 4. TonVerifyPaymentPolling (Verificação de Pagamentos)
Monitora a blockchain da TON para identificar pagamentos em Toncoin ou jUSDT, e vincula os valores quitados ao sistema de dívidas do app.

🔗 Repositório: _(em breve)_  
☁️ Hospedagem: _(em breve)_

---

## 📦 Tecnologias Utilizadas

- Telegram Mini App (HTML5 + JS)
- Telegram Bot API
- OpenAI / LLMs
- TON Blockchain (Toncoin, jUSDT)
- Carteiras Ton nativas no Telegram
- Railway (backend/LLM)
- Vercel (frontend)

---

## 🛠 Como usar

1. Crie um grupo no Telegram com seus amigos.
2. Adicione o bot SplitBill ao grupo.
3. Siga as instruções iniciais enviadas pelo bot.
4. Registre despesas com o comando `/g`, por exemplo:
   ```
   /g Eu paguei R$150 no jantar
   ```
5. Quando todos os gastos tiverem sido registrados, finalize com:
   ```
   /finalizar
   ```
6. Os saldos e os **pagamentos em Toncoin ou jUSDT** estarão disponíveis no **MiniApp**, com carteiras integradas diretamente no Telegram.

📽️ Veja a demo completa no YouTube: [https://www.youtube.com/watch?v=MCUPbeplv9Q](https://www.youtube.com/watch?v=MCUPbeplv9Q)


---

## 🌐 Feito para o Payments Hack-a-TON

Este projeto foi desenvolvido especialmente para o **[Payments Hack-a-TON](https://dorahacks.io/hackathon/ton-payments-hackathon/buidl)**, com o objetivo de explorar o potencial da **blockchain da TON** em experiências cotidianas como dividir contas entre amigos.

Combinamos o poder de **modelos de linguagem (LLMs)** com a **descentralização da Web3**, entregando uma solução fluida, inteligente e 100% integrada ao Telegram.

**SplitBill** prova que dividir despesas pode ser simples, automático e Web3.


