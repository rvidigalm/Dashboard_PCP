import json

file_path = 'dashboard_teste.json'

with open(file_path, 'r', encoding='utf-8') as f:
    dados = json.load(f)

sheet_name = list(dados.keys())[0]
sheet_data = dados[sheet_name]

header_row = sheet_data[0]
products_data = sheet_data[1:]

datas_chegada_keys = [key for key in header_row if key.startswith('Chegada Mês Atual')]
datas_chegada = [header_row[key] for key in datas_chegada_keys]

dados_originais = []
dados_processados = []

for produto_raw in products_data:
    produto = {
        'codigo': str(produto_raw.get('Cód. Produto', '')),
        'nome': str(produto_raw.get('Produto', '')),
        'estoque': float(produto_raw.get('Estoque', 0)) if produto_raw.get('Estoque') not in [None, 'NaN'] else 0,
        'chegadas': []
    }

    for key in datas_chegada_keys:
        quantidade = float(produto_raw.get(key, 0)) if produto_raw.get(key) not in [None, 'NaN'] else 0
        produto['chegadas'].append(quantidade)
    dados_originais.append(produto)

    for index, quantidade in enumerate(produto['chegadas']):
        if index < len(datas_chegada):
            data_str = datas_chegada[index]
            try:
                dia, mes, ano = map(int, data_str.split('/'))
                # Mês é 0-indexado em JavaScript, mas não em Python para datetime
                # Apenas para fins de depuração, não é necessário criar um objeto Date completo
                # O importante é que os valores sejam extraídos corretamente
                dados_processados.append({
                    'codigo': produto['codigo'],
                    'nome': produto['nome'],
                    'estoque': produto['estoque'],
                    'dataChegada': data_str,
                    'mes': mes,
                    'ano': ano,
                    'quantidade': quantidade
                })
            except ValueError:
                print(f"Erro ao processar data: {data_str}")
                continue

print("Dados Originais Processados:")
for p in dados_originais:
    print(p)

print("\nDados Processados para Gráficos/Filtros:")
for d in dados_processados:
    print(d)

# Verificar se os dados estão sendo lidos corretamente
if not dados_originais:
    print("Erro: Nenhum produto foi processado.")

if not dados_processados:
    print("Erro: Nenhum dado para gráficos/filtros foi processado.")


