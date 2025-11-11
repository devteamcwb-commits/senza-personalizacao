# Instruções de Teste - Módulo de Personalização SENZA

Este documento fornece instruções passo a passo para testar o módulo Angular de personalização de presentes e sua integração com WordPress/WooCommerce.

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn instalado
- Um servidor HTTP local (pode usar o Live Server do VS Code, Python http.server, ou similar)

## Estrutura do Projeto

```
senza/
├── src/                          # Código fonte Angular
│   ├── app/
│   │   ├── components/          # Componentes do módulo
│   │   └── core/
│   │       └── services/        # Serviços (PersonalizacaoService)
│   └── ...
├── simulacao-carrinho.html      # Arquivo de simulação WordPress
├── package.json
└── README.md
```

## Passo 1: Instalar Dependências

```bash
npm install
```

## Passo 2: Iniciar o Servidor Angular

Abra um terminal e execute:

```bash
npm start
```

Ou:

```bash
ng serve --port 4200
```

O aplicativo Angular estará disponível em: **http://localhost:4200**

## Passo 3: Iniciar o Servidor de Simulação WordPress

Abra um **segundo terminal** e execute um dos seguintes comandos:

### Opção 1: Python (recomendado)

```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

### Opção 2: Node.js (http-server)

```bash
# Instalar http-server globalmente (se necessário)
npm install -g http-server

# Executar na porta 5500
http-server -p 5500
```

### Opção 3: Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique com o botão direito no arquivo `simulacao-carrinho.html`
3. Selecione "Open with Live Server"
4. Configure a porta para 5500 nas configurações do Live Server

O arquivo de simulação estará disponível em: **http://127.0.0.1:5500/simulacao-carrinho.html**

## Passo 4: Testar a Integração

1. **Abra o navegador** e acesse: `http://127.0.0.1:5500/simulacao-carrinho.html`

2. **Clique no botão "Personalizar Presente"** para abrir o modal com o iframe Angular

3. **Preencha os 6 passos de personalização:**
   - **Passo 1**: Digite o nome do destinatário e remetente
   - **Passo 2**: Escolha a cor do cartão cortesia
   - **Passo 3**: Escolha o tipo de mensagem (inspirar ou pessoal)
   - **Passo 4**: 
     - Se escolheu "inspirar": selecione uma intenção
     - Se escolheu "pessoal": escreva sua mensagem
   - **Passo 5**: Escolha a embalagem (Caixa Premium, Sacola ou Nenhuma)
   - **Passo 6**: Revise todos os itens e clique em "CHECK-OUT"

4. **Verifique o log de comunicação** na parte inferior da página:
   - Deve aparecer uma mensagem de sucesso
   - Os dados de personalização devem ser exibidos em JSON
   - O carrinho deve ser atualizado com o valor da embalagem (se selecionada)

5. **Abra o Console do Navegador** (F12) para ver logs adicionais:
   - Mensagens do Angular
   - Mensagens do script de integração
   - Erros (se houver)

## Passo 5: Verificar a Comunicação postMessage

### No Console do Navegador, você deve ver:

```
🔧 Sistema de integração SENZA inicializado
📡 Aguardando postMessages de: http://localhost:4200
🌐 URL base WordPress: http://127.0.0.1:5500
```

### Quando finalizar a personalização, deve aparecer:

```
Dados enviados via postMessage: {tipo: "personalizacao-finalizada", ...}
```

### Na página de simulação, o log deve mostrar:

- ✅ Mensagem recebida do Angular
- ✅ Dados de personalização em JSON
- ✅ Carrinho atualizado
- ✅ Personalização concluída com sucesso

## Estrutura dos Dados Enviados

O objeto JSON enviado via postMessage tem a seguinte estrutura:

```json
{
  "tipo": "personalizacao-finalizada",
  "destinatarioNome": "Nome do Destinatário",
  "remetenteNome": "Nome do Remetente",
  "cartaoCortesiaCor": "1",
  "tipoMensagem": "pessoal",
  "mensagemPessoal": "Sua mensagem pessoal...",
  "intencao": "aniversario",
  "intencaoSignificado": "Significado opcional",
  "mensagemPronta": "Mensagem gerada automaticamente",
  "embalagem": {
    "tipo": "caixa",
    "valor": 87.00,
    "nome": "Caixa Premium"
  },
  "produtos": [
    {
      "id": "1",
      "nome": "Sabonete Líquido Sândalo & Rosa",
      "valor": 89.90
    },
    {
      "id": "2",
      "nome": "Manteiga Corporal Sândalo & Figo",
      "valor": 79.20
    }
  ],
  "valorTotal": 256.10,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Troubleshooting

### Problema: Iframe não carrega

**Solução:**
- Verifique se o servidor Angular está rodando na porta 4200
- Verifique se há erros no console do navegador
- Verifique as políticas CORS (Cross-Origin Resource Sharing)

### Problema: postMessage não funciona

**Solução:**
- Verifique se a URL de origem está correta: `http://localhost:4200`
- Verifique se a URL de destino está correta: `http://127.0.0.1:5500`
- Abra o Console do Navegador para ver mensagens de erro
- Verifique se o tipo da mensagem é `personalizacao-finalizada`

### Problema: Carrinho não atualiza

**Solução:**
- Verifique o log de comunicação na página de simulação
- Verifique se os dados estão sendo recebidos corretamente
- Verifique o Console do Navegador para erros JavaScript

### Problema: Erro de CORS

**Solução:**
- Certifique-se de que ambos os servidores estão rodando nas portas corretas
- Para produção, configure os headers CORS no servidor WordPress
- Para desenvolvimento, pode ser necessário desabilitar a verificação de CORS no navegador (não recomendado para produção)

## Integração com WordPress/WooCommerce Real

Para integrar com WordPress/WooCommerce real, você precisa:

1. **Modificar a URL base** no `PersonalizacaoService`:
   ```typescript
   urlDominioWP: string = 'https://seu-site-wordpress.com';
   ```

2. **Implementar o endpoint AJAX no WordPress**:
   ```php
   // functions.php do tema WordPress
   add_action('wp_ajax_adicionar_personalizacao', 'adicionar_personalizacao_carrinho');
   add_action('wp_ajax_nopriv_adicionar_personalizacao', 'adicionar_personalizacao_carrinho');
   
   function adicionar_personalizacao_carrinho() {
       // Processar dados de personalização
       // Adicionar ao carrinho WooCommerce
       // Retornar resposta JSON
   }
   ```

3. **Atualizar o script de integração** no WordPress para fazer a chamada AJAX real:
   ```javascript
   jQuery.ajax({
       url: '/wp-admin/admin-ajax.php',
       method: 'POST',
       data: {
           action: 'adicionar_personalizacao',
           dados: dadosPersonalizacao
       },
       success: function(response) {
           // Atualizar carrinho
       }
   });
   ```

## Próximos Passos

1. ✅ Testar todos os passos de personalização
2. ✅ Verificar a comunicação postMessage
3. ✅ Validar os dados enviados
4. ⬜ Integrar com WooCommerce real
5. ⬜ Implementar tratamento de erros
6. ⬜ Adicionar validações adicionais
7. ⬜ Otimizar para produção

## Contato e Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.

