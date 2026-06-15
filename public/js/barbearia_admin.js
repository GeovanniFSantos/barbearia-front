// Lógica para alternar as abas
function mudarAba(abaId) {
    // Esconde todas as abas
    document.querySelectorAll('.aba-conteudo').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('flex'); // Remove o flex caso a aba utilize (como a de Perfil e Empresa)
    });
    
    // Reseta estilo dos botões
    document.querySelectorAll('.aba-btn').forEach(btn => {
        btn.classList.remove('bg-amber-400', 'text-gray-900', 'shadow-sm');
        btn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-500', 'dark:text-gray-400');
    });

    // Mostra a aba clicada
    const abaSelecionada = document.getElementById('tab-' + abaId);
    abaSelecionada.classList.remove('hidden');
    // Adiciona o flex de volta para as abas que precisam do layout grid/flex
    if (abaId === 'empresa' || abaId === 'perfil') {
        abaSelecionada.classList.add('flex');
    }
    
    // Ativa o botão clicado
    const btnAtivo = document.getElementById('btn-' + abaId);
    btnAtivo.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-500', 'dark:text-gray-400');
    btnAtivo.classList.add('bg-amber-400', 'text-gray-900', 'shadow-sm');
}

// Lógica de Busca Rápida de CEP (ViaCEP)
async function buscarCEP(cepInput) {
    const cep = cepInput.replace(/\D/g, '');
    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('uf').value = data.uf;
            }
        } catch (error) {
            console.log("Erro ao buscar CEP");
        }
    }
}

// Lógica para Pré-visualizar imagens antes do upload
function preVisualizarImagem(event, imgId, placeholderId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgElement = document.getElementById(imgId);
            const placeholderElement = document.getElementById(placeholderId);
            
            imgElement.src = e.target.result;
            imgElement.classList.remove('hidden');
            placeholderElement.classList.add('hidden');
        }
        
        reader.readAsDataURL(file);
    }
}

// Lógica de Proteção de Senha
function validarSenha() {
    const senha = document.getElementById('senha_nova').value;
    const confirma = document.getElementById('senha_confirma').value;
    const erroMsg = document.getElementById('erroSenha');

    if (senha && senha !== confirma) {
        erroMsg.classList.remove('hidden');
        document.getElementById('senha_nova').classList.add('border-red-500', 'focus:ring-red-500');
        document.getElementById('senha_confirma').classList.add('border-red-500', 'focus:ring-red-500');
        // Impede o formulário de ser enviado
        return false; 
    }
    
    // Se estiver tudo certo, permite o envio
    erroMsg.classList.add('hidden');
    return true;
}