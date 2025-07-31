document.addEventListener("DOMContentLoaded", () => {
    // --- ESTADO DA APLICAÇÃO ---
    let dadosOriginais = [];
    let dadosProcessados = [];
    let estoqueChart, chegadasChart;

    // --- ELEMENTOS DO DOM ---
    const getEl = (id) => document.getElementById(id);
    const fileUploadEl = getEl("file-upload");
    const uploadBtnEl = getEl("upload-btn");
    const uploadStatusEl = getEl("upload-status");
    const loadingOverlayEl = getEl("loading-overlay");
    const navDashboard = getEl("nav-dashboard");
    const navProdutos = getEl("nav-produtos");
    const navChegadas = getEl("nav-chegadas");
    const navGrupoProduto = getEl("nav-grupo-produto");
    const filtroGrupoEl = getEl("filtro-grupo");
    const views = document.querySelectorAll(".view");
    const totalProdutosEl = getEl("total-produtos");
    const produtosComEstoqueEl = getEl("produtos-com-estoque");
    const totalEstoqueEl = getEl("total-estoque");
    const chegadasProximasEl = getEl("chegadas-proximas");
    
    // --- INICIALIZAÇÃO ---
    getEl("current-date").textContent = new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' });
    uploadBtnEl.addEventListener("click", () => fileUploadEl.click());
    fileUploadEl.addEventListener("change", handleFileUpload);
    navDashboard.addEventListener("click", () => mostrarView("view-dashboard"));
    navProdutos.addEventListener("click", () => {
        mostrarView("view-produtos");
        renderizarTabelaProdutos();
    });
    navChegadas.addEventListener("click", () => {
        mostrarView("view-chegadas");
        renderizarGraficosChegadasIndividuais();
    });
    navGrupoProduto.addEventListener("click", () => {
        mostrarView("view-grupo-produto");
        renderizarTabelaGrupoProduto();
    });

    // --- PROCESSAMENTO DE DADOS ---
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        mostrarLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dados = JSON.parse(e.target.result.replace(/NaN/g, 'null'));
                processarDadosCarregados(dados);
                uploadStatusEl.textContent = `Carregado: ${file.name}`;
            } catch (error) {
                console.error("Erro no JSON:", error);
            } finally {
                mostrarLoading(false);
            }
        };
        reader.readAsText(file);
    }

    function processarDadosCarregados(dados) {
        const sheetName = Object.keys(dados)[0];
        const sheetData = dados[sheetName];
        if (!sheetData || sheetData.length < 2) return;

        const headerRow = sheetData[0];
        const productsData = sheetData.slice(1);
        const datasChegadaKeys = Object.keys(headerRow).filter(key => key.startsWith("Chegada"));
        const datasChegada = datasChegadaKeys.map(key => headerRow[key]);

        dadosOriginais = productsData.map(p => ({
            codigo: String(p["Cód. Produto"] || ""),
            nome: String(p["Produto"] || ""),
            // Prepara para a futura coluna "Grupo de Produto"
            grupo: String(p["Grupo de Produto"] || "Não categorizado"), 
            estoque: parseFloat(p["Estoque"]) || 0,
            chegadas: datasChegadaKeys.map(key => parseFloat(p[key]) || 0)
        }));

        dadosProcessados = [];
        dadosOriginais.forEach(produto => {
            produto.chegadas.forEach((quantidade, index) => {
                if (quantidade > 0 && index < datasChegada.length) {
                    dadosProcessados.push({
                        codigo: produto.codigo,
                        nome: produto.nome,
                        grupo: produto.grupo,
                        dataChegada: datasChegada[index],
                        quantidade: quantidade
                    });
                }
            });
        });
        
        atualizarDashboardCompleto();
        popularFiltroGrupo();
    }
    
    // --- ATUALIZAÇÃO E RENDERIZAÇÃO ---
    function atualizarDashboardCompleto() {
        atualizarEstatisticas();
        criarGraficoEstoque();
        criarGraficoChegadas();
    }
    
    function mostrarView(viewId) {
        views.forEach(v => v.classList.remove('active'));
        getEl(viewId).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        getEl(`nav-${viewId.split('-')[1]}`).classList.add('active');
    }

    function atualizarEstatisticas() {
        animarNumero(totalProdutosEl, dadosOriginais.length);
        animarNumero(produtosComEstoqueEl, dadosOriginais.filter(p => p.estoque > 0).length);
        animarNumero(totalEstoqueEl, dadosOriginais.reduce((sum, p) => sum + p.estoque, 0));
        
        const chegadasFuturas = dadosProcessados.filter(d => {
            const [dia, mes, ano] = d.dataChegada.split("/").map(Number);
            return new Date(ano, mes - 1, dia) >= new Date();
        });
        const qtdeChegadasProximas = chegadasFuturas.reduce((sum, d) => sum + d.quantidade, 0);
        animarNumero(chegadasProximasEl, qtdeChegadasProximas);
    }

    function criarGraficoEstoque() {
        if (estoqueChart) estoqueChart.destroy();
        const produtosComEstoque = dadosOriginais.filter(p => p.estoque > 0);
        estoqueChart = new Chart(getEl("estoqueChart"), {
            type: 'doughnut',
            data: {
                labels: produtosComEstoque.map(p => p.nome),
                datasets: [{ 
                    data: produtosComEstoque.map(p => p.estoque),
                    backgroundColor: ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4'] 
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function criarGraficoChegadas() {
        if (chegadasChart) chegadasChart.destroy();
        
        // --- LÓGICA CORRIGIDA PARA MOSTRAR MESES FUTUROS ---
        const chegadasPorPeriodo = {};
        dadosProcessados.forEach(d => {
            const [dia, mes, ano] = d.dataChegada.split("/").map(Number);
            if (new Date(ano, mes - 1, dia) >= new Date()) {
                const chave = `${String(mes).padStart(2, '0')}/${ano}`;
                chegadasPorPeriodo[chave] = (chegadasPorPeriodo[chave] || 0) + d.quantidade;
            }
        });

        const labelsFuturas = [];
        const dataFutura = [];
        let dataAtual = new Date();

        for (let i = 0; i < 12; i++) { // Gera os próximos 12 meses
            const mes = dataAtual.getMonth() + 1;
            const ano = dataAtual.getFullYear();
            const chave = `${String(mes).padStart(2, '0')}/${ano}`;
            labelsFuturas.push(chave);
            dataFutura.push(chegadasPorPeriodo[chave] || 0);
            dataAtual.setMonth(dataAtual.getMonth() + 1);
        }

        chegadasChart = new Chart(getEl("chegadasChart"), {
            type: 'bar',
            data: { 
                labels: labelsFuturas, 
                datasets: [{ 
                    label: 'Qtde', 
                    data: dataFutura, 
                    backgroundColor: 'rgba(79, 70, 229, 0.8)',
                    barPercentage: 0.5,
                    categoryPercentage: 0.8
                }] 
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { grid: { display: true } } } }
        });
    }

    function renderizarTabelaProdutos() {
        const tbody = getEl('produtos-view-tbody');
        tbody.innerHTML = '';
        dadosOriginais
            .filter(p => p.estoque > 0 || p.chegadas.some(c => c > 0))
            .forEach(p => {
                const proxChegada = dadosProcessados.find(d => d.codigo === p.codigo);
                const row = `<tr>
                    <td>${p.codigo}</td><td>${p.nome}</td><td>${p.estoque}</td>
                    <td>${proxChegada ? proxChegada.dataChegada : 'N/A'}</td>
                    <td>${proxChegada ? proxChegada.quantidade : 'N/A'}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
    }
    
    function renderizarTabelaGrupoProduto() {
        const tbody = getEl('grupo-produto-view-tbody');
        tbody.innerHTML = '';
        dadosOriginais.forEach(p => {
            const proxChegada = dadosProcessados.find(d => d.codigo === p.codigo);
            const row = `<tr>
                <td>${p.grupo}</td><td>${p.codigo}</td><td>${p.nome}</td><td>${p.estoque}</td>
                <td>${proxChegada ? proxChegada.dataChegada : 'N/A'}</td>
                <td>${proxChegada ? proxChegada.quantidade : 'N/A'}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }

    function renderizarGraficosChegadasIndividuais() {
        const container = getEl('chegadas-individuais-section');
        container.innerHTML = '';
        const produtosComChegada = dadosOriginais.filter(p => p.chegadas.some(c => c > 0));

        if (produtosComChegada.length === 0) {
            container.innerHTML = '<p>Nenhuma chegada futura encontrada.</p>';
            return;
        }
        
        const grid = document.createElement('div');
        grid.className = 'charts-grid';
        container.appendChild(grid);

        produtosComChegada.forEach(p => {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-card';
            const canvasId = `chart-${p.codigo}`;
            chartContainer.innerHTML = `<div class="chart-header"><h3>${p.nome} (${p.codigo})</h3></div><div class="chart-content"><canvas id="${canvasId}"></canvas></div>`;
            grid.appendChild(chartContainer);

            const chegadasProduto = dadosProcessados.filter(d => d.codigo === p.codigo);
            new Chart(getEl(canvasId), {
                type: 'bar',
                data: {
                    labels: chegadasProduto.map(c => c.dataChegada.substring(0,5)),
                    datasets: [{ 
                        label: 'Qtde', 
                        data: chegadasProduto.map(c => c.quantidade), 
                        backgroundColor: 'rgba(79, 70, 229, 0.8)',
                        barPercentage: 0.5,
                        categoryPercentage: 0.8
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } } } }
            });
        });
    }

    function popularFiltroGrupo() {
        const grupos = [...new Set(dadosOriginais.map(p => p.grupo))];
        filtroGrupoEl.innerHTML = '<option value="">Todos</option>';
        grupos.forEach(g => {
            const option = document.createElement('option');
            option.value = g;
            option.textContent = g;
            filtroGrupoEl.appendChild(option);
        });
    }

    // --- FUNÇÕES UTILITÁRIAS ---
    function mostrarLoading(mostrar) { loadingOverlayEl.style.display = mostrar ? 'flex' : 'none'; }
    function animarNumero(el, valorFinal) {
        let valorAtual = 0;
        const duracao = 1000;
        if (valorFinal === 0) { el.textContent = 0; return; }
        const passo = (valorFinal / duracao) * 20;
        const timer = setInterval(() => {
            valorAtual += passo;
            if (valorAtual >= valorFinal) {
                el.textContent = Math.round(valorFinal).toLocaleString('pt-BR');
                clearInterval(timer);
            } else {
                el.textContent = Math.round(valorAtual).toLocaleString('pt-BR');
            }
        }, 20);
    }
});