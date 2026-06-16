        function toggleModal() {
            const modal = document.getElementById('modalCadastro');
            const modalContent = document.getElementById('modalContent');
            
            console.log("Comando recebido: Acionando o Modal!");

            if (modal.classList.contains('hidden')) {
                // Remove a trava de visibilidade
                modal.classList.remove('hidden');
                // Pequeno delay para permitir que o Tailwind processe a animação
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            } else {
                // Inicia a animação de encolhimento
                modalContent.classList.remove('scale-100', 'opacity-100');
                modalContent.classList.add('scale-95', 'opacity-0');
                // Espera a animação terminar (300ms) para esconder a div inteira
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }