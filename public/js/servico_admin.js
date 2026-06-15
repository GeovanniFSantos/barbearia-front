// Função que pega os dados da linha clicada e joga no modal de edição
function abrirModalEditarServico(id, nome, descricao, preco, duracao) {
    document.getElementById('edit_nome').value = nome;
    document.getElementById('edit_descricao').value = descricao;
    document.getElementById('edit_preco').value = preco;
    document.getElementById('edit_duracao').value = duracao;
    
    // Altera a rota do formulário para o ID correto
    document.getElementById('formEditarServico').action = `/barbearia-app/admin/servicos/editar/${id}`;
    
    // O toggleModal agora mora globalmente no theme.js!
    toggleModal('modalEditarServico');
}

// Função para abrir o modal de exclusão e injetar a rota correta no botão
function abrirModalExcluirServico(id, nome) {
    document.getElementById('nomeServicoExcluir').innerText = nome;
    
    // Atualiza o link do botão vermelho para a rota correta do backend
    document.getElementById('btnConfirmarExclusaoServico').href = `/barbearia-app/admin/servicos/excluir/${id}`;
    
    toggleModal('modalExcluirServico');
}