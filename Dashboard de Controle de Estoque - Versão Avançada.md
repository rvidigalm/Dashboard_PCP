# Dashboard de Controle de Estoque - Versão Avançada

Um dashboard interativo e moderno em HTML5 para visualização e gerenciamento de dados de controle de estoque, com funcionalidade de upload de arquivos JSON e filtros avançados.

## 🚀 Funcionalidades Principais

### 📊 Visualizações Avançadas
- **Cards de estatísticas em tempo real** com animações e indicadores de tendência
- **Gráfico de distribuição de estoque** (rosca) com cores personalizadas
- **Gráfico de chegadas por período** (barras) com filtros de mês/ano
- **Gráfico de tendência de estoque** (linha) com projeções futuras

### 📁 Upload de Dados
- **Botão de upload de JSON** na sidebar para carregar novos dados
- **Validação de arquivo** com feedback visual
- **Processamento automático** dos dados carregados
- **Notificações toast** para feedback do usuário

### 🔍 Filtros Avançados
- **Busca por produto**: Filtro por código ou nome do produto
- **Filtro por mês**: Seleção específica de mês (Janeiro a Dezembro)
- **Filtro por ano**: Seleção de ano (2025, 2026)
- **Status de estoque**: Todos, Com Estoque, Sem Estoque, Estoque Baixo (<20)
- **Aplicação em tempo real** com debounce para otimização

### 📋 Tabela Interativa
- **Coluna 'Produto'** incluída conforme solicitado
- **Paginação** com controles de navegação
- **Status badges** coloridos para identificação rápida
- **Botões de ação** para cada produto (Ver detalhes, Editar)
- **Informações de paginação** detalhadas

### 🎨 Design Moderno
- **Sidebar escura** com navegação intuitiva
- **Layout responsivo** para desktop, tablet e mobile
- **Gradientes e sombras** modernas
- **Animações suaves** e micro-interações
- **Ícones Font Awesome** para melhor UX
- **Tema profissional** com cores harmoniosas

## 📁 Estrutura de Arquivos

```
dashboard_v2.html       - Arquivo principal do dashboard
styles_v2.css          - Estilos CSS modernos e responsivos
script_v2.js           - JavaScript avançado com todas as funcionalidades
json_structure_example.json - Exemplo da estrutura JSON para upload
processa_dados.py      - Script Python para processamento de dados
README_v2.md           - Esta documentação
```

## 📋 Estrutura do JSON para Upload

O dashboard aceita arquivos JSON com a seguinte estrutura:

```json
{
  "cabecalho": {
    "colunas": [
      "Cód. Produto",
      "Produto",
      "Estoque",
      "Chegada Mês Atual",
      "Chegada Mês Atual + 1",
      "..."
    ],
    "datas_chegada": [
      "01/07/2025",
      "01/08/2025",
      "01/09/2025",
      "..."
    ]
  },
  "produtos": [
    {
      "codigo": "10507",
      "nome": "Nome do Produto",
      "estoque": 36,
      "chegadas": [15, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
}
```

### Campos Obrigatórios:
- `codigo`: Código único do produto
- `nome`: Nome do produto (coluna 'Produto' solicitada)
- `estoque`: Quantidade atual em estoque
- `chegadas`: Array com quantidades previstas para cada período

## 🚀 Como Usar

### 1. Abrir o Dashboard
Abra o arquivo `dashboard_v2.html` em qualquer navegador moderno.

### 2. Carregar Dados
- Clique no botão "Selecionar JSON" na sidebar
- Escolha um arquivo JSON com a estrutura correta
- Os dados serão processados automaticamente

### 3. Aplicar Filtros
- **Busca**: Digite o código ou nome do produto
- **Mês/Ano**: Selecione períodos específicos
- **Status**: Filtre por status de estoque
- Clique em "Aplicar Filtros" ou use busca em tempo real

### 4. Navegar pelos Dados
- Use a paginação na tabela para navegar entre produtos
- Visualize gráficos interativos
- Monitore estatísticas em tempo real

## 🎯 Funcionalidades Técnicas

### Responsividade
- **Desktop**: Layout completo com sidebar
- **Tablet**: Adaptação de grid e componentes
- **Mobile**: Sidebar colapsável e layout otimizado

### Performance
- **Debounce** na busca para otimização
- **Lazy loading** de gráficos
- **Animações otimizadas** com CSS3
- **Processamento eficiente** de dados

### Acessibilidade
- **Ícones semânticos** para melhor compreensão
- **Cores contrastantes** para legibilidade
- **Tooltips informativos** em botões
- **Navegação por teclado** suportada

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Estilos avançados com variáveis CSS e gradientes
- **JavaScript ES6+**: Funcionalidades interativas e modernas
- **Chart.js**: Biblioteca para gráficos interativos
- **Font Awesome**: Ícones vetoriais
- **Design System**: Cores e componentes consistentes

## 📊 Tipos de Gráficos

1. **Distribuição de Estoque** (Doughnut)
   - Mostra proporção de estoque entre produtos
   - Cores diferenciadas para cada produto
   - Tooltips com percentuais

2. **Chegadas por Período** (Bar)
   - Visualiza chegadas previstas por mês/ano
   - Filtros aplicáveis
   - Escala automática

3. **Tendência de Estoque** (Line)
   - Projeção de estoque futuro
   - Baseado nas chegadas previstas
   - Área preenchida para melhor visualização

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `styles_v2.css`:
```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
}
```

### Dados
Substitua o arquivo `json_structure_example.json` ou use o upload para carregar seus próprios dados.

## 🌐 Compatibilidade

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 📈 Melhorias Implementadas

Comparado à versão anterior:
- ✅ Design muito mais moderno e profissional
- ✅ Funcionalidade de upload de JSON
- ✅ Coluna 'Produto' incluída
- ✅ Filtros por mês e ano
- ✅ Sidebar com navegação
- ✅ Gráficos mais sofisticados
- ✅ Paginação na tabela
- ✅ Notificações toast
- ✅ Loading states
- ✅ Responsividade aprimorada
- ✅ Animações e micro-interações

