# SENZA - Módulo de Personalização de Presentes

Módulo Angular 17+ isolado para personalização de presentes, projetado para ser executado em um iframe e integrado em WordPress/WooCommerce.

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── personalizacao.service.ts
│   ├── components/
│   │   ├── personalizacao-main/
│   │   │   ├── personalizacao-main.component.ts
│   │   │   ├── personalizacao-main.component.html
│   │   │   └── personalizacao-main.component.scss
│   │   ├── passo-identificacao/
│   │   ├── passo-cartao-cortesia/
│   │   ├── passo-tipo-mensagem/
│   │   ├── passo-intencao/
│   │   ├── passo-embalagem/
│   │   ├── passo-revisao/
│   │   └── cartao-visualizacao/
│   └── app.component.ts
├── styles.scss
└── main.ts
```

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm start
```

O aplicativo será executado em `http://localhost:4200`

## Build de Produção

```bash
npm run build
```

## Teste de Integração

1. Inicie o servidor Angular: `npm start` (porta 4200)
2. Abra o arquivo `simulacao-carrinho.html` em um servidor local (porta 5500)
3. Teste a comunicação postMessage entre os dois ambientes

## Integração WordPress

Veja o arquivo `simulacao-carrinho.html` para exemplo de integração com WordPress/WooCommerce.

