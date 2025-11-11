# Resumo do Projeto - Módulo de Personalização SENZA

## Visão Geral

Este projeto implementa um módulo Angular 17+ isolado para personalização de presentes, projetado para ser executado em um iframe e integrado em WordPress/WooCommerce através de comunicação postMessage.

## Estrutura do Projeto

```
senza/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── personalizacao-main/          # Componente principal multi-step
│   │   │   ├── passo-identificacao/          # Passo 1: Identificação
│   │   │   ├── passo-cartao-cortesia/        # Passo 2: Cartão Cortesia
│   │   │   ├── passo-tipo-mensagem/          # Passo 3: Tipo de Mensagem
│   │   │   ├── passo-intencao/               # Passo 4: Intenção/Mensagem
│   │   │   ├── passo-embalagem/              # Passo 5: Embalagem
│   │   │   ├── passo-revisao/                # Passo 6: Revisão
│   │   │   └── cartao-visualizacao/          # Pré-visualização do Cartão
│   │   └── core/
│   │       └── services/
│   │           └── personalizacao.service.ts # Serviço de gerenciamento
│   ├── environments/                          # Configurações de ambiente
│   └── styles.scss                            # Estilos globais
├── simulacao-carrinho.html                   # Arquivo de simulação WordPress
├── INSTRUCOES_TESTE.md                       # Instruções de teste
└── package.json                              # Dependências do projeto
```

## Componentes Principais

### 1. PersonalizacaoService
- **Localização**: `src/app/core/services/personalizacao.service.ts`
- **Responsabilidade**: Gerencia os dados de personalização e envia via postMessage
- **Métodos principais**:
  - `atualizarDados()`: Atualiza os dados de personalização
  - `obterDados()`: Obtém os dados atuais
  - `calcularValorTotal()`: Calcula o valor total
  - `enviarParaWordPress()`: Envia dados via postMessage

### 2. PersonalizacaoMainComponent
- **Localização**: `src/app/components/personalizacao-main/`
- **Responsabilidade**: Gerencia o fluxo multi-step (6 passos)
- **Funcionalidades**:
  - Navegação entre passos
  - Barra de progresso
  - Controle de estado

### 3. Componentes de Passo
Cada passo é um componente standalone:
- **PassoIdentificacaoComponent**: Coleta nome do destinatário e remetente
- **PassoCartaoCortesiaComponent**: Escolha da cor do cartão
- **PassoTipoMensagemComponent**: Escolha do tipo de mensagem
- **PassoIntencaoComponent**: Seleção de intenção ou mensagem pessoal
- **PassoEmbalagemComponent**: Escolha da embalagem
- **PassoRevisaoComponent**: Revisão final e envio

### 4. CartaoVisualizacaoComponent
- **Localização**: `src/app/components/cartao-visualizacao/`
- **Responsabilidade**: Pré-visualização do cartão personalizado
- **Tecnologia**: HTML/CSS puro com `position: absolute`
- **Funcionalidades**:
  - Visualização da frente do cartão
  - Visualização do interior do cartão
  - Nomes posicionados com CSS
  - Padrão floral (para cor vermelha)

## Fluxo de Dados

1. **Coleta de Dados**: Cada passo coleta dados específicos e armazena no `PersonalizacaoService`
2. **Armazenamento Temporário**: Dados são armazenados em `BehaviorSubject`
3. **Validação**: Cada passo valida os dados antes de avançar
4. **Envio Final**: No passo de revisão, os dados são enviados via `postMessage` para o WordPress

## Comunicação postMessage

### Estrutura da Mensagem

```typescript
interface DadosPersonalizacao {
  tipo: 'personalizacao-finalizada';
  destinatarioNome: string;
  remetenteNome: string;
  cartaoCortesiaCor: string;
  tipoMensagem: 'inspirar' | 'pessoal';
  mensagemPessoal?: string;
  intencao?: string;
  intencaoSignificado?: string;
  mensagemPronta?: string;
  embalagem: {
    tipo: 'nenhuma' | 'caixa' | 'sacola';
    valor: number;
    nome: string;
  };
  produtos: Array<{
    id: string;
    nome: string;
    valor: number;
  }>;
  valorTotal: number;
  timestamp: string;
}
```

### Envio (Angular)

```typescript
window.parent.postMessage(dadosCompletos, urlDominioWP);
```

### Recepção (WordPress)

```javascript
window.addEventListener('message', function(event) {
  if (event.origin !== URL_ORIGEM_ANGULAR) return;
  if (event.data.tipo === 'personalizacao-finalizada') {
    // Processar dados
  }
});
```

## Integração WordPress

### Arquivo de Simulação
- **Localização**: `simulacao-carrinho.html`
- **Funcionalidades**:
  - Simula o ambiente WordPress/WooCommerce
  - Abre iframe com o módulo Angular
  - Escuta postMessages
  - Atualiza carrinho simulado
  - Log de comunicação

### Script de Integração
O arquivo `simulacao-carrinho.html` contém o script JavaScript necessário para:
1. Abrir o iframe do módulo Angular
2. Escutar postMessages
3. Validar a origem da mensagem
4. Processar os dados recebidos
5. Atualizar o carrinho (simulado)

## Configuração

### Ambiente de Desenvolvimento
- **URL Angular**: `http://localhost:4200`
- **URL WordPress**: `http://127.0.0.1:5500`

### Ambiente de Produção
- **URL Angular**: Configurar no build
- **URL WordPress**: Configurar em `environment.prod.ts`

## Testes

### Passos para Testar

1. **Instalar dependências**: `npm install`
2. **Iniciar Angular**: `npm start` (porta 4200)
3. **Iniciar simulação WordPress**: Servir `simulacao-carrinho.html` na porta 5500
4. **Abrir navegador**: `http://127.0.0.1:5500/simulacao-carrinho.html`
5. **Testar fluxo**: Preencher os 6 passos e verificar comunicação

### Verificações

- ✅ Dados são coletados corretamente em cada passo
- ✅ Validação funciona em cada passo
- ✅ Pré-visualização do cartão exibe corretamente
- ✅ postMessage é enviado corretamente
- ✅ WordPress recebe e processa os dados
- ✅ Carrinho é atualizado corretamente

## Próximos Passos

### Integração Real com WooCommerce

1. **Criar endpoint AJAX no WordPress**:
   ```php
   add_action('wp_ajax_adicionar_personalizacao', 'adicionar_personalizacao_carrinho');
   ```

2. **Processar dados no WordPress**:
   - Adicionar item ao carrinho WooCommerce
   - Salvar dados de personalização como meta do item
   - Retornar resposta JSON

3. **Atualizar script de integração**:
   - Fazer chamada AJAX real
   - Tratar erros
   - Atualizar interface do usuário

### Melhorias Futuras

- [ ] Adicionar animações entre passos
- [ ] Melhorar responsividade mobile
- [ ] Adicionar mais opções de personalização
- [ ] Implementar salvamento de rascunho
- [ ] Adicionar preview 3D do cartão
- [ ] Integrar com API de pagamento
- [ ] Adicionar testes unitários
- [ ] Adicionar testes e2e

## Tecnologias Utilizadas

- **Angular 17+**: Framework front-end
- **TypeScript**: Linguagem de programação
- **SCSS**: Pré-processador CSS
- **RxJS**: Programação reativa
- **postMessage API**: Comunicação entre iframes
- **HTML5/CSS3**: Estrutura e estilização

## Estrutura de Arquivos Criados

### Componentes
- ✅ `personalizacao-main.component.ts/html/scss`
- ✅ `passo-identificacao.component.ts/html/scss`
- ✅ `passo-cartao-cortesia.component.ts/html/scss`
- ✅ `passo-tipo-mensagem.component.ts/html/scss`
- ✅ `passo-intencao.component.ts/html/scss`
- ✅ `passo-embalagem.component.ts/html/scss`
- ✅ `passo-revisao.component.ts/html/scss`
- ✅ `cartao-visualizacao.component.ts/html/scss`

### Serviços
- ✅ `personalizacao.service.ts`

### Configuração
- ✅ `package.json`
- ✅ `angular.json`
- ✅ `tsconfig.json`
- ✅ `environment.ts`
- ✅ `environment.prod.ts`

### Documentação
- ✅ `README.md`
- ✅ `INSTRUCOES_TESTE.md`
- ✅ `RESUMO_PROJETO.md`

### Integração
- ✅ `simulacao-carrinho.html`

## Conclusão

O módulo está completo e pronto para testes. Todos os 6 passos de personalização estão implementados, a comunicação postMessage está funcionando, e a pré-visualização do cartão está implementada com HTML/CSS puro.

Para integração real com WordPress/WooCommerce, será necessário:
1. Configurar a URL do WordPress em produção
2. Implementar o endpoint AJAX no WordPress
3. Processar os dados no backend
4. Adicionar os itens ao carrinho WooCommerce

