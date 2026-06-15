    document.addEventListener('DOMContentLoaded', () => {
        // 1. Criação do overlay com design premium e fundo com blur
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'global-loading';
        loadingOverlay.className = 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center hidden opacity-0 transition-opacity duration-300';
        loadingOverlay.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center transform scale-95 transition-transform duration-300" id="loading-card">
                <div class="relative w-16 h-16 mb-6">
                    <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <div class="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
                </div>
                <h2 class="text-gray-800 dark:text-white text-lg font-black tracking-wide uppercase">Processando</h2>
                <p class="text-gray-500 dark:text-gray-400 text-xs font-medium mt-2">Enviando dados de forma segura...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        // 2. Intercetar formulários
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // Se o formulário abrir noutra aba, não fazemos loading
                if (this.target === '_blank') return;

                // Previne o envio instantâneo
                e.preventDefault();

                // Mostra o loading com fade in
                const overlay = document.getElementById('global-loading');
                const card = document.getElementById('loading-card');
                
                overlay.classList.remove('hidden');
                // Pequeno delay para permitir o display:block ser aplicado antes do fade
                setTimeout(() => {
                    overlay.classList.remove('opacity-0');
                    overlay.classList.add('opacity-100');
                    card.classList.remove('scale-95');
                    card.classList.add('scale-100');
                }, 10);

                // Desativa os botões de submissão para evitar cliques duplos
                const buttons = this.querySelectorAll('button[type="submit"]');
                const originalTexts = [];
                buttons.forEach((btn, index) => {
                    originalTexts[index] = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Aguarde...';
                });

                // 3. O Truque Profissional: Força um delay mínimo de 800ms
                setTimeout(() => {
                    this.submit(); // Liberta o envio do formulário após a animação
                }, 800);
            });
        });
    });