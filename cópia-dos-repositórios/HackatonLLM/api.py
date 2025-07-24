import google.generativeai as genai
from dotenv import load_dotenv
import json
import os
import logging
from functools import wraps
from flask import Flask, request, jsonify

# --- 1. Configuração Inicial ---

# Configura o sistema de logs para exibir informações no console
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Carrega as variáveis de ambiente e configura a API Gemini
load_dotenv()
try:
    # Chave para a API do Gemini
    API_KEY = os.getenv("GEMINI_API_KEY")
    if not API_KEY:
        logging.critical("Variável de Ambiente 'GEMINI_API_KEY' não está definida. Encerrando.")
        exit()
    genai.configure(api_key=API_KEY)

    # Token de segurança para a nossa API
    API_BEARER_TOKEN = os.getenv("API_BEARER_TOKEN")
    if not API_BEARER_TOKEN:
        logging.critical("Variável de Ambiente 'API_BEARER_TOKEN' não está definida. Encerrando.")
        exit()

except Exception as e:
    logging.critical(f"Erro fatal ao configurar a API do Gemini: {e}")
    exit()

# --- 2. Definição dos System Prompts ---

SYSTEM_PROMPT_LLM1 = """
You are an intelligent JSON data processing assistant. Your task is to update a JSON object based on a natural language instruction. You will receive a current JSON object and a new transaction description. 1. Identify the user ID and the value of the new transaction from the description. 2. Calculate the total value if necessary (e.g., '3 items at $12 each' is $36). 3. Add this new value to the existing 'gastos' (spend) for the correct user ID. 4. Return the ENTIRE, UPDATED JSON object. You MUST provide a brief, one-sentence explanation of the calculation you performed BEFORE providing the final JSON block.
"""

SYSTEM_PROMPT_LLM2 = """
You are a JSON extraction tool. Your sole purpose is to find and extract a valid JSON object from the given text. Do NOT add any explanation, commentary, or any text before or after the JSON. Only return the JSON object itself. Your output must be *only* the JSON object itself, starting with `{` and ending with `}`. If no JSON is found, output an empty JSON object: {}.
"""

# PROMPT ATUALIZADO: Agora pede o ID do usuário em "de" e "para".
SYSTEM_PROMPT_LLM3 = """
You are an expert financial analyst specializing in settling group expenses. Your task is to calculate how to split expenses equally among a group of people and provide a simplified payment plan. You will receive a JSON object containing 'usuarios' (a mapping of user IDs to names) and 'gastos' (a mapping of user IDs to the total amount they paid).

Follow these steps precisely:
1.  Calculate the total amount spent by everyone by summing up all values in the 'gastos' object.
2.  Calculate the average cost per person by dividing the total by the number of people.
3.  For each person, calculate their balance: (amount they paid) - (average cost). A positive balance means they are owed money; a negative balance means they owe money.
4.  Determine the simplest set of transactions required to settle all debts. The goal is to have those who owe money pay those who are owed money.
5.  Return a single, valid JSON object as your final answer. This JSON object MUST conform to the following structure. Use the user ID for the 'de' and 'para' fields.

{
  "total_gastos": <float, total expenses rounded to 2 decimal places>,
  "gasto_por_pessoa": <float, average cost per person rounded to 2 decimal places>,
  "balancos": {
    "NomeDoUsuario1": <float, balance for user 1>,
    "NomeDoUsuario2": <float, balance for user 2>
  },
  "transacoes_para_acerto": [
    {
      "de": "ID_DO_USUARIO_PAGADOR",
      "para": "ID_DO_USUARIO_RECEPTOR",
      "valor": <float, amount of the transaction>
    }
  ]
}

Do NOT include any extra text, explanations, apologies, or commentary before or after the JSON object. Your entire response must be ONLY the valid JSON object itself.
"""

# --- 3. Definição dos Modelos de IA ---
llm1_calculator = genai.GenerativeModel(model_name='gemini-2.0-flash', system_instruction=SYSTEM_PROMPT_LLM1)
llm2_guardrail = genai.GenerativeModel(model_name='gemini-2.0-flash', system_instruction=SYSTEM_PROMPT_LLM2)
llm3_splitter = genai.GenerativeModel(model_name='gemini-2.0-flash', system_instruction=SYSTEM_PROMPT_LLM3)

# --- 4. Aplicação Flask e Segurança ---
app = Flask(__name__)

def token_required(f):
    """Decorador para proteger rotas com um Bearer Token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            # Extrai o token do cabeçalho 'Bearer <token>'
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            logging.warning(f"Acesso negado: Token de autorização ausente. IP: {request.remote_addr}")
            return jsonify({"erro": "Token de autorização ausente."}), 401

        if token != API_BEARER_TOKEN:
            logging.warning(f"Acesso negado: Token de autorização inválido. IP: {request.remote_addr}")
            return jsonify({"erro": "Token de autorização inválido."}), 401
        
        return f(*args, **kwargs)
    return decorated

# --- Funções de Lógica ---

def _run_guardrail(text_from_llm):
    """Função auxiliar que usa a LLM2 para limpar e extrair um JSON."""
    try:
        response_guardrail = llm2_guardrail.generate_content(text_from_llm)
        json_str = response_guardrail.text.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:]
        if json_str.endswith("```"):
            json_str = json_str[:-3]
        return json.loads(json_str.strip())
    except Exception as e:
        logging.error(f"Falha no Guardião de JSON: {e}")
        logging.debug(f"Texto recebido pelo guardião que causou o erro: {text_from_llm}")
        return None

def run_fluxo_completo(dados_iniciais, nova_transacao):
    """Executa o fluxo completo para processar uma nova transação."""
    logging.info("Iniciando fluxo de processamento de transação.")
    prompt_llm1 = f"""
    Here is the current data:
    ```json
    {json.dumps(dados_iniciais, indent=2)}
    ```
    Now, process the following new transaction:
    - User ID: {nova_transacao['usuario_id']}
    - Description: "{nova_transacao['descricao']}"
    Update the JSON and provide the full new object.
    """
    try:
        response_llm1 = llm1_calculator.generate_content(prompt_llm1)
        logging.info("LLM1 (Calculadora) respondeu com sucesso.")
        return _run_guardrail(response_llm1.text)
    except Exception as e:
        logging.error(f"Falha ao chamar a LLM1 (Calculadora): {e}")
        return None

def run_fluxo_divisao(dados):
    """Executa o fluxo completo para calcular a divisão de dívidas."""
    logging.info("Iniciando fluxo de divisão de contas.")
    prompt_llm3 = json.dumps(dados, indent=2)
    try:
        response_llm3 = llm3_splitter.generate_content(prompt_llm3)
        logging.info("LLM3 (Calculadora de Divisão) respondeu com sucesso.")
        return _run_guardrail(response_llm3.text)
    except Exception as e:
        logging.error(f"Falha ao chamar a LLM3 (Calculadora de Divisão): {e}")
        return None

# --- 5. Endpoints da API ---

@app.route('/newtransaction', methods=['POST'])
@token_required
def processar_transacao_api():
    """Endpoint para registrar uma nova transação."""
    logging.info(f"Recebida requisição em /newtransaction do IP: {request.remote_addr}")
    dados_requisicao = request.get_json()
    if not all(k in dados_requisicao for k in ['usuarios', 'gastos', 'ultima_transacao']):
        logging.warning("Requisição em /newtransaction com JSON inválido.")
        return jsonify({"erro": "JSON inválido ou chaves 'usuarios', 'gastos', 'ultima_transacao' ausentes."}), 400
    
    dados_iniciais = {"usuarios": dados_requisicao['usuarios'], "gastos": dados_requisicao['gastos']}
    nova_transacao = dados_requisicao['ultima_transacao']
    
    resultado_json = run_fluxo_completo(dados_iniciais, nova_transacao)
    
    if resultado_json:
        logging.info("Transação processada e respondida com sucesso.")
        return jsonify(resultado_json), 200
    else:
        logging.error("Ocorreu um erro interno no fluxo de processamento de transação.")
        return jsonify({"erro": "Ocorreu um erro interno ao processar a transação com a IA."}), 500

@app.route('/splitbill', methods=['POST'])
@token_required
def calcular_divisao_api():
    """Endpoint para calcular como os gastos devem ser divididos."""
    logging.info(f"Recebida requisição em /splitbill do IP: {request.remote_addr}")
    dados_requisicao = request.get_json()
    if not all(k in dados_requisicao for k in ['usuarios', 'gastos']):
        logging.warning("Requisição em /splitbill com JSON inválido.")
        return jsonify({"erro": "JSON inválido ou chaves 'usuarios' e 'gastos' ausentes."}), 400

    resultado_json = run_fluxo_divisao(dados_requisicao)

    if resultado_json:
        logging.info("Divisão de contas calculada e respondida com sucesso.")
        return jsonify(resultado_json), 200
    else:
        logging.error("Ocorreu um erro interno no fluxo de divisão de contas.")
        return jsonify({"erro": "Ocorreu um erro interno ao calcular a divisão com a IA."}), 500

# --- 6. Execução do Servidor ---
if __name__ == "__main__":
    logging.info("Iniciando servidor Flask em modo de desenvolvimento.")
    app.run(host='0.0.0.0', port=5000, debug=True)
