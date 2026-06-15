
   // 1. SISTEMA DE BUSCA EM TEMPO REAL
    document.getElementById('searchInput').addEventListener('keyup', function() {
        const termo = this.value.toLowerCase();
        const linhas = document.querySelectorAll('.cliente-row');
        
        linhas.forEach(linha => {
            const nome = linha.querySelector('.cliente-nome').textContent.toLowerCase();
            const telefone = linha.querySelector('.cliente-telefone').textContent.toLowerCase();
            
            if (nome.includes(termo) || telefone.includes(termo)) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });

    // 2. FUNÇÕES DO MODAL
    function abrirModalCliente(nome, telefone, email, cortes, gasto, ultima, proxima) {
        // Preenche os dados
        document.getElementById('modalLetra').textContent = nome.charAt(0).toUpperCase();
        document.getElementById('modalNome').textContent = nome;
        document.getElementById('modalTelefone').textContent = telefone;
        document.getElementById('modalCortes').textContent = cortes;
        document.getElementById('modalGasto').textContent = gasto;
        document.getElementById('modalUltima').textContent = ultima;
        document.getElementById('modalProxima').textContent = proxima;
        
        // Configura o botão do WhatsApp
        const btnWhats = document.getElementById('modalBtnWhats');
        if (telefone && telefone !== 'Não informado') {
            btnWhats.href = `https://wa.me/55${telefone.replace(/\\D/g, '')}`;
            btnWhats.style.display = 'flex';
        } else {
            btnWhats.style.display = 'none';
        }

        // Animação de abertura
        const modal = document.getElementById('modalCliente');
        const content = document.getElementById('modalClienteContent');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
        }, 10);
    }

    function fecharModalCliente() {
        const modal = document.getElementById('modalCliente');
        const content = document.getElementById('modalClienteContent');
        modal.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // Fecha o modal se clicar fora da caixa
    document.getElementById('modalCliente').addEventListener('click', function(e) {
        if (e.target === this) fecharModalCliente();
    });
