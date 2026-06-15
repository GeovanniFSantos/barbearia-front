// =========================================================
// FUNÇÃO CENTRAL DE MODAIS (Essencial para a UI)
// =========================================================
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const content = document.getElementById(modalId + 'Content') || modal.firstElementChild;

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    } else {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    }
}

// =========================================================
// INICIALIZAÇÃO
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const inputData = document.getElementById('inputData');
    if (inputData) {
        const localDate = new Date();
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
        const dataFormatada = localDate.toISOString().split('T')[0];
        
        inputData.min = dataFormatada;
        inputData.value = dataFormatada;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sucesso') === 'true') {
        toggleModal('modalSucessoAgendamento');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// =========================================================
// AGENDAMENTO E CUPONS
// =========================================================
function abrirModalAgendamento(servicoId, servicoNome, isLogadoStr, precoServico) {
    const isLogado = isLogadoStr === 'true';
    if (!isLogado) { toggleModal('modalAvisoLogin'); return; }

    document.getElementById('inputServicoId').value = servicoId;
    document.getElementById('nomeServicoEscolhido').innerText = servicoNome;
    
    // Configura o preço inicial
    document.getElementById('precoOriginalServico').value = Number(precoServico) || 0;
    document.getElementById('descontoAtual').value = 0;
    
    // Reseta o produto se existir
    const selectProduto = document.getElementById('selectProdutoCliente');
    if (selectProduto) selectProduto.value = "";

    // Reseta Cupons e Pagamentos
    document.getElementById('inputCupomCodigo').value = "";
    document.getElementById('inputCupomId').value = "";
    document.getElementById('precoRiscado').classList.add('hidden');
    document.getElementById('msgCupom').classList.add('hidden');
    document.getElementById('selectPagamento').value = "";
    
    document.getElementById('paymentBrick_container').classList.add('hidden');
    document.getElementById('btnConfirmar').classList.remove('hidden');

    calcularTotalCliente(); // Chama a nova função mestre de cálculo
    
    // Resto do reset...
    document.getElementById('selectProfissional').value = "";
    document.getElementById('inputDataHora').value = "";
    document.getElementById('horariosDisponiveis').innerHTML = `<div class="col-span-4 text-center text-xs font-bold text-gray-400 py-4 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">Selecione um profissional.</div>`;
    
    toggleModal('modalAgendamentoCliente');
}

let isBuscandoHorarios = false;
async function buscarHorarios() {
    if (isBuscandoHorarios) return;

    const servicoId = document.getElementById('inputServicoId').value;
    const profissionalId = document.getElementById('selectProfissional').value;
    const data = document.getElementById('inputData').value;
    const barbeariaId = document.getElementById('inputBarbeariaId').value; 

    const container = document.getElementById('horariosDisponiveis');
    const loading = document.getElementById('loadingHorarios');
    const btnConfirmar = document.getElementById('btnConfirmar');

    if (!profissionalId || !data) return;

    isBuscandoHorarios = true;
    container.innerHTML = "";
    loading.classList.remove('hidden');
    
    document.getElementById('inputDataHora').value = "";
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = `Aguardando seleção...`;

    try {
        const response = await fetch(`/barbearia-app/api/horarios-disponiveis?barbearia_id=${barbeariaId}&colaborador_id=${profissionalId}&servico_id=${servicoId}&data=${data}`);
        const json = await response.json();

        loading.classList.add('hidden');

        if (json.mensagem || !json.disponiveis || json.disponiveis.length === 0) {
            container.innerHTML = `<div class="col-span-4 text-center text-sm font-bold text-red-500 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">${json.mensagem || 'Nenhum horário livre neste dia.'}</div>`;
            return;
        }

        json.disponiveis.forEach(hora => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hora-slot py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors shadow-sm';
            btn.innerText = hora;
            
            btn.onclick = () => {
                document.querySelectorAll('.hora-slot').forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                    b.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                });
                
                btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
                btn.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');

                document.getElementById('inputDataHora').value = `${data}T${hora}`;
                
                const formaPag = document.getElementById('selectPagamento').value;
                if (formaPag !== 'app') {
                    btnConfirmar.disabled = false;
                    btnConfirmar.innerHTML = `Confirmar para as ${hora}`;
                }
            };
            container.appendChild(btn);
        });
    } catch (error) {
        loading.classList.add('hidden');
        container.innerHTML = `<div class="col-span-4 text-center text-sm font-bold text-red-500 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl">Erro ao buscar horários.</div>`;
    } finally {
        isBuscandoHorarios = false;
    }
}

// A FUNÇÃO MESTRE: Calcula Serviço + Produto - Cupom
function calcularTotalCliente() {
    const precoServico = Number(document.getElementById('precoOriginalServico').value) || 0;
    const desconto = Number(document.getElementById('descontoAtual').value) || 0;
    
    let precoProduto = 0;
    const selectProduto = document.getElementById('selectProdutoCliente');
    if (selectProduto && selectProduto.selectedIndex > -1) {
        precoProduto = Number(selectProduto.options[selectProduto.selectedIndex].getAttribute('data-preco')) || 0;
    }

    // Calcula: (Serviço - Desconto) + Produto
    // O desconto do cupom só se aplica ao serviço, não aos produtos!
    let totalServicoComDesconto = precoServico - desconto;
    if (totalServicoComDesconto < 0) totalServicoComDesconto = 0;

    const totalFinal = totalServicoComDesconto + precoProduto;
    
    const displayTotal = document.getElementById('precoFinalExibicao');
    displayTotal.innerText = `R$ ${totalFinal.toFixed(2)}`;
    
    // Animação de pulso
    displayTotal.classList.add('scale-110');
    setTimeout(() => displayTotal.classList.remove('scale-110'), 150);

    // Se o mercado pago estiver aberto, recarrega ele com o novo preço
    recarregarMercadoPagoSeNecessario();
}

// Adaptação da função aplicarCupom
async function aplicarCupom() {
    const codigo = document.getElementById('inputCupomCodigo').value.trim();
    const barbeariaId = document.getElementById('inputBarbeariaId').value;
    const precoOriginal = Number(document.getElementById('precoOriginalServico').value);
    const msg = document.getElementById('msgCupom');
    
    if(!codigo) {
        // Se limpar o cupom, zera o desconto
        document.getElementById('descontoAtual').value = 0;
        document.getElementById('inputCupomId').value = "";
        document.getElementById('precoRiscado').classList.add('hidden');
        msg.classList.add('hidden');
        calcularTotalCliente();
        return;
    }

    try {
        const response = await fetch(`/barbearia-app/api/validar-cupom?codigo=${codigo}&barbearia_id=${barbeariaId}`);
        const data = await response.json();

        msg.classList.remove('hidden');

        if (data.erro) {
            msg.className = "text-xs font-bold text-red-500 mt-1 px-1";
            msg.innerText = data.erro;
            document.getElementById('inputCupomId').value = "";
            document.getElementById('descontoAtual').value = 0;
            document.getElementById('precoRiscado').classList.add('hidden');
            calcularTotalCliente();
            return;
        }

        // Calcula qual é o valor numérico do desconto
        let valorDesconto = 0;
        if (data.tipo === 'percentual') {
            valorDesconto = precoOriginal * (Number(data.valor) / 100);
        } else {
            valorDesconto = Number(data.valor);
        }

        document.getElementById('descontoAtual').value = valorDesconto;
        document.getElementById('inputCupomId').value = data.id;
        
        msg.className = "text-xs font-bold text-green-500 mt-1 px-1";
        msg.innerText = `Cupom aplicado! Desconto de ${data.tipo === 'percentual' ? data.valor + '%' : 'R$ ' + data.valor}`;
        
        document.getElementById('precoRiscado').innerText = `R$ ${precoOriginal.toFixed(2)}`;
        document.getElementById('precoRiscado').classList.remove('hidden');
        
        calcularTotalCliente();
    } catch (error) {
        msg.className = "text-xs font-bold text-red-500 mt-1 px-1";
        msg.innerText = "Erro ao validar cupom.";
    }
}

// =========================================================
// PAGAMENTO
// =========================================================
function verificarFormaPagamento() {
    const forma = document.getElementById('selectPagamento').value;
    const btnNormal = document.getElementById('btnConfirmar');
    const containerBrick = document.getElementById('paymentBrick_container');
    const dataHoraSelecionada = document.getElementById('inputDataHora').value;

    if (forma === 'app') {
        btnNormal.classList.add('hidden');
        containerBrick.classList.remove('hidden');
        
        const inputKey = document.getElementById('mpPublicKeyInput');
        if(!inputKey || !inputKey.value) {
            alert("Erro de configuração. Entre em contato com o salão.");
            return;
        }
        iniciarMercadoPago();
    } else {
        btnNormal.classList.remove('hidden');
        containerBrick.classList.add('hidden');
        
        if (dataHoraSelecionada) {
            const horaTratada = dataHoraSelecionada.split('T')[1].substring(0,5);
            btnNormal.disabled = false;
            btnNormal.innerHTML = `Confirmar para as ${horaTratada}`;
        }
    }
}

function recarregarMercadoPagoSeNecessario() {
    const formaPag = document.getElementById('selectPagamento').value;
    if (formaPag === 'app') {
        document.getElementById('paymentBrick_container').innerHTML = '';
        window.paymentBrickController = null;
        iniciarMercadoPago();
    }
}

async function iniciarMercadoPago() {
    const chavePublica = document.getElementById('mpPublicKeyInput').value.replace(/\s/g, '');
    if (!chavePublica) return;

    try {
        const mp = new MercadoPago(chavePublica, { locale: 'pt-BR' });
        const bricksBuilder = mp.bricks();

        const precoTexto = document.getElementById('precoFinalExibicao').innerText;
        const precoTotal = Number(precoTexto.replace('R$', '').replace(',', '.').trim());
        const tituloServico = document.getElementById('nomeServicoEscolhido').innerText;
        const barbeariaId = document.getElementById('inputBarbeariaId').value;

        if (precoTotal === 0) {
            document.getElementById('selectPagamento').value = 'Dinheiro';
            verificarFormaPagamento();
            alert("Como o valor é Zero, não é necessário cartão.");
            return;
        }

        const response = await fetch('/barbearia-app/api/criar-preferencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: tituloServico, preco: precoTotal, quantidade: 1, barbeariaId })
        });
        
        const preferencia = await response.json();

        if (preferencia.erro) {
            document.getElementById('paymentBrick_container').innerHTML = `<p class="text-red-500 font-bold p-3 text-sm text-center">Não foi possível gerar pagamento.</p>`;
            return;
        }

        const settings = {
            initialization: { amount: precoTotal },
            customization: {
                paymentMethods: { bankTransfer: "all", creditCard: "all" },
                visual: { style: { theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default' } }
            },
            callbacks: {
                onReady: () => { console.log("Mercado Pago pronto!"); },
                onError: (error) => { console.error("Erro no Brick:", error); },
                onSubmit: async ({ selectedPaymentMethod, formData }) => {
                    const dataHora = document.getElementById('inputDataHora').value;
                    if(!dataHora) {
                        alert("Por favor, selecione um horário na grade acima antes de pagar.");
                        return Promise.reject(); 
                    }

                    const agendamento = {
                        servico_id: document.getElementById('inputServicoId').value,
                        colaborador_id: document.getElementById('selectProfissional').value,
                        data_hora: dataHora,
                        cupom_id: document.getElementById('inputCupomId').value,
                        valor_total: precoTotal
                    };
                    
                    const resPagamento = await fetch('/barbearia-app/api/processar-pagamento', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ formData, agendamento, barbeariaId })
                    });

                    const result = await resPagamento.json();
                    
                    if (result.sucesso) {
                        if (result.metodo === 'pix') {
                            const container = document.getElementById('paymentBrick_container');
                            container.innerHTML = `
                                <div class="text-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-green-200 dark:border-green-900 mt-4 shadow-lg">
                                    <h3 class="text-xl font-black text-green-600 dark:text-green-400 mb-2"><i class="fa-brands fa-pix"></i> Pix Gerado!</h3>
                                    <img src="data:image/png;base64,${result.pixQrCode64}" class="w-48 h-48 mx-auto rounded-lg mb-4 border border-gray-200">
                                    <div class="flex items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-lg border border-gray-200">
                                        <input type="text" id="pixCopiaCola" value="${result.pixCopiaECola}" readonly class="w-full text-xs p-2 bg-transparent dark:text-white outline-none">
                                        <button type="button" onclick="const i=document.getElementById('pixCopiaCola');i.select();document.execCommand('copy');alert('Copiado!');" class="bg-blue-600 text-white px-3 py-2 rounded-md font-bold text-xs">Copiar</button>
                                    </div>
                                    <button type="button" onclick="window.location.href=window.location.pathname+'?sucesso=true'" class="w-full bg-green-500 text-white font-black py-3 rounded-xl">Já Paguei! Fechar</button>
                                </div>
                            `;
                            return Promise.resolve();
                        } else {
                            window.location.href = window.location.pathname + "?sucesso=true";
                            return Promise.resolve();
                        }
                    } else {
                        // Dicionário de tradução dos erros do Mercado Pago
                        let mensagemAmigavel = "Ocorreu um erro inesperado ao processar seu pagamento. Tente novamente.";
                        const motivoErro = result.erro || "";

                        if (motivoErro.includes('cc_rejected_insufficient_amount')) {
                            mensagemAmigavel = "O cartão possui saldo ou limite insuficiente.";
                        } else if (motivoErro.includes('cc_rejected_bad_filled_security_code')) {
                            mensagemAmigavel = "O código de segurança (CVV) está incorreto.";
                        } else if (motivoErro.includes('cc_rejected_bad_filled_date')) {
                            mensagemAmigavel = "A data de vencimento do cartão está incorreta.";
                        } else if (motivoErro.includes('cc_rejected_call_for_authorize')) {
                            mensagemAmigavel = "O banco bloqueou a compra. Ligue para o banco para autorizar.";
                        } else if (motivoErro.includes('cc_rejected_other_reason')) {
                            mensagemAmigavel = "O banco recusou o pagamento. Tente usar outro cartão.";
                        } else if (motivoErro.includes('cc_rejected_bad_filled_other')) {
                            mensagemAmigavel = "Algum dado do cartão foi preenchido incorretamente.";
                        }

                        document.getElementById('mensagemErroPagamento').innerText = mensagemAmigavel;
                        toggleModal('modalErroPagamento');
                        return Promise.reject();
                    }
                }
            }
        };

        if (window.paymentBrickController) window.paymentBrickController.unmount();
        window.paymentBrickController = await bricksBuilder.create("payment", "paymentBrick_container", settings);
    } catch (error) {
        console.log("Ignorando erro temporário do MP", error);
    }
}