document.addEventListener("DOMContentLoaded", function() {
    const canvasElement = document.getElementById('faturamentoChart');
    if (!canvasElement) return;

    // Puxa os dados injetados pelo EJS
    const dadosBrutos = canvasElement.getAttribute('data-dados');
    if (!dadosBrutos || dadosBrutos === "[]") return;

    const dadosFaturamento = JSON.parse(dadosBrutos);
    
    // Inverte os arrays para a linha do tempo crescer da esquerda (mais antigo) para a direita (mais novo)
    const labelsMeses = dadosFaturamento.map(item => item.mes).reverse();
    const valoresDinheiro = dadosFaturamento.map(item => parseFloat(item.total)).reverse();

    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Paleta de Cores Premium (Estilo Fintech)
    const corLinha = '#10b981'; // Tailwind Emerald-500 (Mais sofisticado que o verde base)
    const corTexto = isDarkMode ? '#9ca3af' : '#9ca3af'; 
    const corGrade = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
    const corFundoTooltip = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'; // Slate-900 / Branco com Blur
    const corBordaTooltip = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    const ctx = canvasElement.getContext('2d');
    
    // Degradê suave que desvanece até ficar invisível na base
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)'); 
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)'); 

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsMeses,
            datasets: [{
                label: 'Receita Bruta',
                data: valoresDinheiro,
                borderColor: corLinha,
                backgroundColor: gradient,
                borderWidth: 4, 
                
                // Esconde os pontos para um visual "Clean", só aparecem no Hover
                pointRadius: 0, 
                pointHoverRadius: 8,
                pointHoverBackgroundColor: corLinha,
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 3,
                
                fill: true,
                tension: 0.45 // Curvatura da onda super suave
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false, // Permite que a tooltip apareça mesmo que o rato não esteja exatamente em cima da linha
            },
            plugins: {
                legend: { display: false }, // Esconde a legenda padrão feia
                tooltip: {
                    enabled: true,
                    backgroundColor: corFundoTooltip,
                    titleColor: isDarkMode ? '#9ca3af' : '#6b7280', // Cor do mês
                    bodyColor: corLinha, // Cor do R$
                    borderColor: corBordaTooltip,
                    borderWidth: 1,
                    padding: 16,
                    titleFont: { size: 12, family: "'Inter', sans-serif", weight: '700' },
                    bodyFont: { size: 20, family: "'Inter', sans-serif", weight: '900' },
                    displayColors: false, // Esconde o quadradinho de cor da tooltip
                    cornerRadius: 16, // Bordas bem arredondadas
                    caretSize: 0, // Remove a setinha da tooltip (visual mais limpo)
                    callbacks: {
                        title: function(context) {
                            return 'Faturamento • ' + context[0].label;
                        },
                        label: function(context) {
                            return 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {minimumFractionDigits: 2});
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: corTexto, 
                        font: { family: "'Inter', sans-serif", size: 11, weight: '600' },
                        padding: 12
                    },
                    grid: { display: false }, // Esconde linhas verticais
                    border: { display: false } // Remove a linha dura do eixo X
                },
                y: {
                    beginAtZero: true,
                    border: { display: false }, // Remove a linha dura do eixo Y
                    ticks: { 
                        color: corTexto,
                        font: { family: "'Inter', sans-serif", size: 11, weight: '600' },
                        padding: 16,
                        maxTicksLimit: 6, // Mostra menos números no eixo Y para não poluir
                        callback: function(value) { 
                            // Formata números grandes (ex: 15000 vira 15k)
                            if(value >= 1000) return 'R$ ' + (value/1000).toFixed(1).replace('.0', '') + 'k';
                            return 'R$ ' + value; 
                        }
                    },
                    grid: { 
                        color: corGrade, 
                        drawBorder: false,
                        tickLength: 0 // Remove os tracinhos para fora do gráfico
                    }
                }
            }
        }
    });
});