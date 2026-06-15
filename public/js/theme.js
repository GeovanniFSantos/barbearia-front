// 1. Executa imediatamente para evitar o "piscar" branco antes de carregar (FOUC)
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// 2. Aguarda o HTML terminar de desenhar na tela para ligar o botão de tema
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Ajusta o ícone do botão com base no tema atual
    if (themeIcon) {
        themeIcon.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    }

    // Cria a função de clique para o Dark Mode
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.textContent = '🌙';
            }
        });
    }
});

// 3. Função Global de Modais Animados para TODO o sistema CrieSobMedida
window.toggleModal = function(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Pega automaticamente a "caixa branca" dentro do modal para fazer o efeito de zoom (scale)
    const content = modal.firstElementChild;

    if (modal.classList.contains('hidden')) {
        // ABRIR MODAL
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Delay minúsculo para o Tailwind processar a transição
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            
            if (content && content.classList.contains('scale-95')) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
        }, 10);
    } else {
        // FECHAR MODAL
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        
        if (content && content.classList.contains('scale-100')) {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
        }
        
        // Aguarda a animação (300ms) terminar antes de aplicar o display:none
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    }
};