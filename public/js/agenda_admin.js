
    // 1. Controle Genérico de Modais com Animação Perfeita
    function toggleModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return; // Proteção extra caso o ID não exista
        
        let content;
        if (id === 'modalNovoAgendamento') content = document.getElementById('modalNovoContent');
        if (id === 'modalCancelarHorario') content = document.getElementById('modalCancelarContent');

        if (modal.classList.contains('hidden')) {
            // ABRIR: Tira o display:none e aplica flex
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Pequeno delay para o navegador processar a animação do Tailwind
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
                if(content) {
                    content.classList.remove('scale-95');
                    content.classList.add('scale-100');
                }
            }, 10);
        } else {
            // FECHAR: Tira a opacidade e encolhe
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            if(content) {
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
            }
            
            // Espera a animação de 300ms acabar para colocar display:none novamente
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }
    }

    // 2. Abre o modal de Cancelamento
    function abrirModalCancelarHorario(id) {
        document.getElementById('agendamentoCancelamentoId').value = id;
        toggleModal('modalCancelarHorario');
    }

    // 3. O Motor do Cancelamento
    async function executarCancelamentoAutomacao() {
        const id = document.getElementById('agendamentoCancelamentoId').value;
        const btn = document.getElementById('btnConfirmarCancelarHorario');
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Processando...';
        btn.disabled = true;

        try {
            const response = await fetch('/barbearia-app/api/cancelar-agendamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agendamentoId: id })
            });

            const result = await response.json();

            toggleModal('modalCancelarHorario');

            setTimeout(() => {
                if (result.sucesso) {
                    mostrarFeedbackModal(true, 'Cancelado!', result.mensagem);
                } else {
                    mostrarFeedbackModal(false, 'Atenção', result.erro);
                }
                btn.innerHTML = 'Sim, Cancelar';
                btn.disabled = false;
            }, 300);

        } catch (error) {
            console.error(error);
            toggleModal('modalCancelarHorario');
            
            setTimeout(() => {
                mostrarFeedbackModal(false, 'Erro de Conexão', 'Ocorreu um erro ao tentar cancelar.');
                btn.innerHTML = 'Sim, Cancelar';
                btn.disabled = false;
            }, 300);
        }
    }

    // Função para calcular o Total Dinâmico no Modal de Novo Agendamento
    function calcularTotalPrevisto() {
        const servicoSelect = document.getElementById('selectServico');
        const produtoSelect = document.getElementById('selectProduto');
        
        // Pega os valores armazenados nos atributos 'data-preco'
        const precoServico = parseFloat(servicoSelect.options[servicoSelect.selectedIndex]?.getAttribute('data-preco') || 0);
        const precoProduto = parseFloat(produtoSelect.options[produtoSelect.selectedIndex]?.getAttribute('data-preco') || 0);
        
        const total = precoServico + precoProduto;
        
        // Atualiza a tela com o valor formatado
        const displayTotal = document.getElementById('displayValorTotal');
        displayTotal.innerText = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        
        // Efeito visual de "piscar" para mostrar que atualizou
        displayTotal.classList.add('scale-110', 'text-green-400');
        setTimeout(() => {
            displayTotal.classList.remove('scale-110', 'text-green-400');
        }, 150);
    }

    // 4. Controla a aparência do Modal de Feedback
    function mostrarFeedbackModal(isSuccess, title, message) {
        const modal = document.getElementById('modalFeedbackCancelamento');
        const content = document.getElementById('modalFeedbackContent');
        const iconContainer = document.getElementById('feedbackIcon');
        const titleEl = document.getElementById('feedbackTitle');
        const messageEl = document.getElementById('feedbackMessage');

        if (isSuccess) {
            iconContainer.innerHTML = '<i class="fa-solid fa-circle-check text-green-500"></i>';
            window.feedbackSuccess = true;
        } else {
            iconContainer.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-500"></i>';
            window.feedbackSuccess = false;
        }

        titleEl.innerText = title;
        messageEl.innerText = message;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
    }

    // 5. Botão "Entendi" 
    function fecharFeedbackERecarregar() {
        const modal = document.getElementById('modalFeedbackCancelamento');
        const content = document.getElementById('modalFeedbackContent');
        
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            if (window.feedbackSuccess) {
                window.location.reload(); 
            }
        }, 300);
    }
