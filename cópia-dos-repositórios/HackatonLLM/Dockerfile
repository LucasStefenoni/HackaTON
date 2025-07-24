# Usa uma imagem base oficial do Python. A versão 'slim' é menor.
FROM python:3.10-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de dependências para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências listadas no requirements.txt
# A flag --no-cache-dir reduz o tamanho da imagem
RUN pip install --no-cache-dir -r requirements.txt

# Copia todos os arquivos do projeto (api.py, etc.) para o diretório de trabalho
COPY . .

# Expõe a porta que o gunicorn usará para rodar a aplicação dentro do container
EXPOSE 5000

# Comando para iniciar a aplicação usando Gunicorn
# - "api:app" refere-se à variável 'app' no arquivo 'api.py'
# - --bind 0.0.0.0:5000 torna a aplicação acessível de fora do container
# - --workers 4 é um bom ponto de partida para o número de processos
CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:5000", "api:app"]