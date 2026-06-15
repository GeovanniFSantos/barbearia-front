    // Função para abrir o modal de edição de colaborador
    function abrirModalEditarColaborador(id, nome, telefone) {
        // Preenche os inputs com os dados do banco
        document.getElementById('edit_colab_nome').value = nome;
        
        // Tratamento seguro: se o telefone vier como "null" da query, deixa vazio
        if (telefone === 'null' || !telefone) {
            document.getElementById('edit_colab_telefone').value = '';
        } else {
            document.getElementById('edit_colab_telefone').value = telefone;
        }
        
        // Altera o destino do formulário para o ID específico
        document.getElementById('formEditarColaborador').action = `/admin/colaboradores/editar/${id}`;
        
        // Chama o gerenciador de modais do theme.js
        toggleModal('modalEditarColaborador');
    }

    // Função para abrir o modal de exclusão
    function abrirModalExcluirColaborador(id, nome) {
        // Coloca o nome do profissional em negrito na tela de aviso
        document.getElementById('nomeColaboradorExcluir').innerText = nome;
        
        // Define a rota do botão de deletar
        document.getElementById('btnConfirmarExclusaoColaborador').href = `/admin/colaboradores/excluir/${id}`;
        
        toggleModal('modalExcluirColaborador');
    }

    // Função para abrir o Modal de Performance
    function abrirModalPerformance(nome, cortes, hoje, semana, mes, ano) {
        document.getElementById('perfLetra').textContent = nome.charAt(0).toUpperCase();
        document.getElementById('perfNome').textContent = nome;
        document.getElementById('perfCortes').textContent = cortes;
        document.getElementById('perfHoje').textContent = hoje;
        document.getElementById('perfSemana').textContent = semana;
        document.getElementById('perfMes').textContent = mes;
        document.getElementById('perfAno').textContent = ano;
        
        toggleModal('modalPerformance');
    }