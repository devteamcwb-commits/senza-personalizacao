<?php
/**
 * Exemplo de Integração WordPress/WooCommerce
 * 
 * Este arquivo demonstra como integrar o módulo Angular de personalização
 * com WordPress/WooCommerce usando postMessage e AJAX
 * 
 * INSTRUÇÕES:
 * 1. Adicione este código ao functions.php do seu tema WordPress
 * 2. Ajuste as URLs conforme necessário
 * 3. Teste a integração
 */

// Adiciona o script de integração no carrinho
function senza_adicionar_script_personalizacao() {
    if (is_cart() || is_checkout()) {
        ?>
        <script>
        /**
         * Configurações
         */
        const URL_ORIGEM_ANGULAR = 'https://seu-dominio-angular.com'; // URL do módulo Angular
        const URL_BASE_WP = '<?php echo home_url(); ?>'; // URL base do WordPress

        /**
         * Abre o modal de personalização
         */
        function abrirPersonalizacao() {
            // Cria o iframe
            const iframe = document.createElement('iframe');
            iframe.src = URL_ORIGEM_ANGULAR;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.id = 'iframe-personalizacao';

            // Cria o modal
            const modal = document.createElement('div');
            modal.id = 'modal-personalizacao';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.right = '0';
            modal.style.bottom = '0';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modal.style.zIndex = '10000';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';

            // Cria o container do iframe
            const container = document.createElement('div');
            container.style.width = '90%';
            container.style.maxWidth = '900px';
            container.style.height = '90%';
            container.style.maxHeight = '700px';
            container.style.backgroundColor = 'white';
            container.style.borderRadius = '8px';
            container.style.position = 'relative';

            // Botão de fechar
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.width = '30px';
            closeBtn.style.height = '30px';
            closeBtn.style.border = 'none';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.zIndex = '10001';
            closeBtn.onclick = function() {
                document.body.removeChild(modal);
            };

            // Monta a estrutura
            container.appendChild(closeBtn);
            container.appendChild(iframe);
            modal.appendChild(container);
            document.body.appendChild(modal);
        }

        /**
         * Escuta mensagens do iframe Angular
         */
        window.addEventListener('message', function(event) {
            // Validação de segurança: verifica a origem da mensagem
            if (event.origin !== URL_ORIGEM_ANGULAR) {
                console.warn('Mensagem rejeitada - origem inválida:', event.origin);
                return;
            }

            // Verifica se a mensagem é do tipo esperado
            if (event.data && event.data.tipo === 'personalizacao-finalizada') {
                console.log('Mensagem recebida do Angular:', event.data);
                
                // Processa os dados de personalização
                const dadosPersonalizacao = event.data;
                
                // Envia para o backend WordPress via AJAX
                jQuery.ajax({
                    url: '<?php echo admin_url('admin-ajax.php'); ?>',
                    method: 'POST',
                    data: {
                        action: 'senza_adicionar_personalizacao',
                        dados: dadosPersonalizacao
                    },
                    success: function(response) {
                        console.log('Item adicionado ao carrinho:', response);
                        
                        // Atualiza o carrinho
                        if (response.success) {
                            // Recarrega a página do carrinho
                            location.reload();
                        } else {
                            alert('Erro ao adicionar ao carrinho: ' + response.data.message);
                        }
                        
                        // Fecha o modal
                        const modal = document.getElementById('modal-personalizacao');
                        if (modal) {
                            document.body.removeChild(modal);
                        }
                    },
                    error: function(error) {
                        console.error('Erro ao adicionar ao carrinho:', error);
                        alert('Erro ao adicionar ao carrinho. Tente novamente.');
                    }
                });
            }
        });
        </script>
        <?php
    }
}
add_action('wp_footer', 'senza_adicionar_script_personalizacao');

// Endpoint AJAX para adicionar personalização ao carrinho
function senza_adicionar_personalizacao_carrinho() {
    // Verifica se o WooCommerce está ativo
    if (!class_exists('WooCommerce')) {
        wp_send_json_error(array('message' => 'WooCommerce não está ativo'));
        return;
    }

    // Obtém os dados de personalização
    $dados = json_decode(stripslashes($_POST['dados']), true);

    if (!$dados) {
        wp_send_json_error(array('message' => 'Dados inválidos'));
        return;
    }

    // Valida dados obrigatórios
    if (empty($dados['destinatarioNome']) || empty($dados['remetenteNome'])) {
        wp_send_json_error(array('message' => 'Dados obrigatórios não fornecidos'));
        return;
    }

    // Obtém o carrinho
    $cart = WC()->cart;

    // Adiciona os produtos ao carrinho (se ainda não estiverem)
    if (!empty($dados['produtos'])) {
        foreach ($dados['produtos'] as $produto) {
            $product_id = $produto['id'];
            $quantity = 1;
            
            // Verifica se o produto já está no carrinho
            $cart_item_key = $cart->find_product_in_cart($product_id);
            
            if (!$cart_item_key) {
                // Adiciona o produto ao carrinho
                $cart->add_to_cart($product_id, $quantity);
            }
        }
    }

    // Adiciona a embalagem como item do carrinho (se selecionada)
    if (!empty($dados['embalagem']) && $dados['embalagem']['tipo'] !== 'nenhuma') {
        $embalagem_id = 0; // ID do produto de embalagem no WooCommerce
        $embalagem_preco = $dados['embalagem']['valor'];
        $embalagem_nome = $dados['embalagem']['nome'];
        
        // Aqui você adicionaria a embalagem como um item do carrinho
        // ou como meta dos produtos existentes
        // Exemplo: $cart->add_to_cart($embalagem_id, 1);
    }

    // Adiciona os dados de personalização como meta dos itens do carrinho
    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        // Adiciona os dados de personalização como meta
        $cart->cart_contents[$cart_item_key]['personalizacao'] = array(
            'destinatarioNome' => $dados['destinatarioNome'],
            'remetenteNome' => $dados['remetenteNome'],
            'cartaoCortesiaCor' => $dados['cartaoCortesiaCor'],
            'tipoMensagem' => $dados['tipoMensagem'],
            'mensagemPessoal' => $dados['mensagemPessoal'] ?? '',
            'intencao' => $dados['intencao'] ?? '',
            'intencaoSignificado' => $dados['intencaoSignificado'] ?? '',
            'mensagemPronta' => $dados['mensagemPronta'] ?? '',
            'embalagem' => $dados['embalagem'] ?? array(),
        );
    }

    // Salva o carrinho
    $cart->set_session();

    // Retorna sucesso
    wp_send_json_success(array(
        'message' => 'Personalização adicionada ao carrinho com sucesso',
        'cart_total' => $cart->get_total()
    ));
}
add_action('wp_ajax_senza_adicionar_personalizacao', 'senza_adicionar_personalizacao_carrinho');
add_action('wp_ajax_nopriv_senza_adicionar_personalizacao', 'senza_adicionar_personalizacao_carrinho');

// Exibe os dados de personalização no carrinho
function senza_exibir_personalizacao_carrinho($item_data, $cart_item) {
    if (isset($cart_item['personalizacao'])) {
        $personalizacao = $cart_item['personalizacao'];
        
        $item_data[] = array(
            'key' => 'Destinatário',
            'value' => $personalizacao['destinatarioNome']
        );
        
        $item_data[] = array(
            'key' => 'Remetente',
            'value' => $personalizacao['remetenteNome']
        );
        
        if (!empty($personalizacao['mensagemPessoal'])) {
            $item_data[] = array(
                'key' => 'Mensagem',
                'value' => $personalizacao['mensagemPessoal']
            );
        }
        
        if (!empty($personalizacao['intencao'])) {
            $item_data[] = array(
                'key' => 'Intenção',
                'value' => $personalizacao['intencao']
            );
        }
    }
    
    return $item_data;
}
add_filter('woocommerce_get_item_data', 'senza_exibir_personalizacao_carrinho', 10, 2);

// Adiciona botão de personalização no carrinho
function senza_adicionar_botao_personalizacao() {
    if (is_cart()) {
        ?>
        <div class="senza-personalizacao-section" style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="margin-bottom: 10px;">Personalização de Presente</h3>
            <p style="margin-bottom: 15px;">Personalize seu presente com uma mensagem especial e embalagem.</p>
            <button 
                type="button" 
                class="button" 
                onclick="abrirPersonalizacao()"
                style="background-color: #d32f2f; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">
                Personalizar Presente
            </button>
        </div>
        <?php
    }
}
add_action('woocommerce_cart_collaterals', 'senza_adicionar_botao_personalizacao', 20);

?>

