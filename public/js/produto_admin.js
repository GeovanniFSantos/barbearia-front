    // Função para abrir e fechar modais suavemente
    function toggleModal(modalID) {
        const modal = document.getElementById(modalID);
        if (modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.children[0].classList.remove('scale-95');
            }, 10);
        } else {
            modal.classList.add('opacity-0');
            modal.children[0].classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }
    }

    // Função de pre-visualizar imagem no upload
    function previewImagem(event, previewId, placeholderId) {
        const reader = new FileReader();
        reader.onload = function() {
            const preview = document.getElementById(previewId);
            const placeholder = document.getElementById(placeholderId);
            preview.src = reader.result;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    // Função para preencher e abrir o modal de Editar
    function abrirModalEditarProduto(id, nome, descricao, preco, estoque, imagemUrl) {
        document.getElementById('formEditarProduto').action = '/admin/produtos/editar/' + id;
        document.getElementById('edit_nome_produto').value = nome;
        document.getElementById('edit_descricao_produto').value = descricao !== 'null' ? descricao : '';
        document.getElementById('edit_preco_produto').value = preco;
        document.getElementById('edit_estoque_produto').value = estoque;

        const preview = document.getElementById('previewEditImagem');
        const placeholder = document.getElementById('placeholderEditImagem');

        if (imagemUrl && imagemUrl !== 'null' && imagemUrl !== '') {
            preview.src = imagemUrl;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            preview.src = '';
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }

        toggleModal('modalEditarProduto');
    }

    // Função para preencher e abrir o modal de Excluir
    function abrirModalExcluirProduto(id, nome) {
        document.getElementById('nomeProdutoExcluir').textContent = nome;
        document.getElementById('btnConfirmarExclusaoProduto').href = '/admin/produtos/excluir/' + id;
        toggleModal('modalExcluirProduto');
    }

    function previewImagem(event, previewId, placeholderId) {
        const reader = new FileReader();
        reader.onload = function() {
            const preview = document.getElementById(previewId);
            const placeholder = document.getElementById(placeholderId);
            preview.src = reader.result;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
    }