        function abrirModalExcluirCupom(id, codigo) {
            document.getElementById('codigoCupomExcluir').innerText = codigo;
            document.getElementById('btnConfirmarExclusaoCupom').href = `/barbearia-app/admin/cupons/excluir/${id}`;
            toggleModal('modalExcluirCupom'); // Esta função já existe globalmente no seu theme.js
        }