document.addEventListener("DOMContentLoaded", function() {
    const canvasClientes = document.getElementById('clientesGrafico');
    if (canvasClientes) {
        const rawData = canvasClientes.getAttribute('data-dados');
        if(rawData) {
            const dadosGrafico = JSON.parse(rawData);
            const labels = dadosGrafico.map(d => d.data_dia);
            const valores = dadosGrafico.map(d => d.total_clientes);

            const isDarkMode = document.documentElement.classList.contains('dark');
            const corTexto = isDarkMode ? '#9ca3af' : '#9ca3af';
            const corGrade = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
            const corFundoTooltip = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
            
            const ctx = canvasClientes.getContext('2d');
            
            // Degradê Roxo/Índigo nas barras
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)'); // Purple 500
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)'); // Indigo 500

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Clientes Atendidos',
                        data: valores,
                        backgroundColor: gradient,
                        hoverBackgroundColor: '#8b5cf6',
                        borderRadius: 8, // Barras super arredondadas
                        borderSkipped: false, // Arredonda na base também
                        maxBarThickness: 32 // Finas e elegantes
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: corFundoTooltip,
                            titleColor: isDarkMode ? '#9ca3af' : '#6b7280',
                            bodyColor: '#8b5cf6',
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderWidth: 1,
                            padding: 12,
                            titleFont: { size: 11, family: "'Inter', sans-serif", weight: '700' },
                            bodyFont: { size: 16, family: "'Inter', sans-serif", weight: '900' },
                            displayColors: false,
                            cornerRadius: 12,
                            caretSize: 0,
                            callbacks: {
                                title: function(context) { return 'Dia ' + context[0].label; },
                                label: function(context) { return context.parsed.y + ' Clientes'; }
                            }
                        }
                    },
                    scales: {
                        x: { 
                            ticks: { color: corTexto, font: { family: "'Inter', sans-serif", size: 11, weight: '600' } }, 
                            grid: { display: false }, border: { display: false } 
                        },
                        y: { 
                            beginAtZero: true, 
                            ticks: { color: corTexto, stepSize: 1, font: { family: "'Inter', sans-serif", size: 11, weight: '600' }, padding: 10 }, 
                            grid: { color: corGrade, drawBorder: false, tickLength: 0 },
                            border: { display: false }
                        }
                    }
                }
            });
        }
    }
});

function toggleModal(id) { document.getElementById(id).classList.toggle('hidden'); }
