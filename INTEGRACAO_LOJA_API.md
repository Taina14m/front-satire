# Integração da loja com a API

Este documento descreve o esqueleto e as conexões já feitos entre `front-satire/app/store` e a Satire API. A referência de rotas é `satire-api/docs/ENDPOINTS.md`; antes da integração, os controllers atuais também foram conferidos.

Autenticação não faz parte desta etapa. Por isso, não há login, armazenamento de token, `Authorization: Bearer ...`, refresh nem tratamento de `401` implementados aqui.

## Arquivos adicionados ou alterados

| Arquivo | Alteração | Motivo |
|---|---|---|
| `app/store/js/api.js` | Criado anteriormente e ampliado com `isApiConfigured()`. | Centraliza chamadas HTTP da loja no mesmo estilo do painel administrativo: `API_URL`, `apiRequest()` e funções globais. |
| `app/store/js/catalog.js` | Criado. | Busca produtos, cria cards usando os dados reais e preenche os carrosséis existentes por categoria. |
| `app/store/js/modal.js` | Substituído. | Abre detalhes reais do produto, carrega variações e envia ao carrinho somente o `variationId` escolhido. |
| `app/store/js/cart.js` | Substituído. | Renderiza o `CartResponse` real, altera quantidade, remove, esvazia e inicia checkout. |
| `app/store/pages/home.html` | Carrega `api.js` e `catalog.js`; recebeu seletor de variação e botão de esvaziar carrinho. | São os elementos mínimos para escolher uma variação real e executar as ações já disponibilizadas pelo backend. |

Não foram criados produtos, variações, IDs, respostas simuladas ou rotas alternativas. Os cards estáticos originais só permanecem visíveis enquanto `API_URL` estiver vazia ou a chamada de catálogo falhar; com a API configurada e respondendo, `catalog.js` os substitui pelos dados retornados.

## Como a interface funciona

```text
home.html
  -> api.js
  -> API Spring
  -> catalog.js / modal.js / cart.js
  -> componentes já existentes da interface
```

1. `catalog.js` chama `getProducts()` e agrupa os produtos por `product.category`.
2. Cada card recebe o `data-product-id` real, além de nome, imagem e preço vindos da resposta.
3. Ao abrir o card, `modal.js` chama `getProduct(productId)` e `getVariations(productId)`.
4. O seletor apresenta as variações retornadas; o valor da opção é o campo real `variation.id`.
5. Após uma escolha explícita, o botão chama `addCartItem(variationId, 1)`.
6. `cart.js` usa os IDs reais de item retornados no carrinho para atualizar ou remover itens.
7. No checkout, a implementação usa o endereço marcado como `primary`. Sem endereço principal, não tenta escolher um endereço arbitrariamente.

## Significado dos comentários e `TODO`

Os comentários não simulam funcionalidade. Eles registram uma dependência concreta antes de a interface poder chamar uma rota com segurança.

| Local | Significado |
|---|---|
| `getProducts()` | O documento prevê paginação e filtros públicos, mas não define seus nomes e formatos. A função chama a listagem sem parâmetros até esse contrato existir. |
| Favoritos e avaliações | As rotas estão documentadas como planejadas, mas faltam controllers e/ou formatos de request e resposta. |
| Disponibilidade | Falta o controller e o formato da resposta da rota de disponibilidade. |
| Pedidos planejados | Listagem, detalhe, cancelamento e histórico ainda não possuem controller público. O body de cancelamento também não foi definido. |
| Pagamentos | A rota e a chave `Idempotency-Key` estão documentadas, mas o body e as respostas ainda não foram especificados. O webhook é externo e não é chamado pelo navegador. |
| Entrega e rastreio | As rotas de consulta do cliente permanecem sem controller e sem resposta definida. |
| Checkout em `cart.js` | Falta uma interface de seleção de endereço para o caso em que o cliente não tenha endereço principal. |

## Endpoints que teoricamente precisam funcionar

As funções abaixo existem em `api.js`. As marcadas como **encontradas no código** possuem controller no backend atual; as marcadas como **planejadas** foram deixadas somente preparadas.

### Encontrados no código atual

| Método | Endpoint | Uso no frontend |
|---|---|---|
| `GET` | `/api/v1/categories` | `getCategories()`; pronto para uso futuro. |
| `GET` | `/api/v1/categories/{categoryId}` | `getCategory(categoryId)`; pronto para uso futuro. |
| `GET` | `/api/v1/products` | Alimenta os carrosséis em `catalog.js`. |
| `GET` | `/api/v1/products/{productId}` | Carrega detalhes no modal. |
| `GET` | `/api/v1/products/slug/{slug}` | `getProductBySlug(slug)`; pronto para uso futuro. |
| `GET` | `/api/v1/products/{productId}/variations` | Carrega as opções reais do modal. Ver ressalva sobre `productId` abaixo. |
| `GET` | `/api/v1/products/{productId}/images` | `getProductImages(productId)`; pronto para uso futuro. Ver ressalva sobre `productId` abaixo. |
| `GET` | `/api/v1/me` | `getMe()`. |
| `PATCH` / `DELETE` | `/api/v1/me` | `updateMe()` e `deactivateMe()`. |
| `GET` / `POST` | `/api/v1/me/addresses` | Consultar e criar endereços. |
| `GET` / `PATCH` / `DELETE` | `/api/v1/me/addresses/{addressId}` | Consultar, editar e remover endereço. |
| `PATCH` | `/api/v1/me/addresses/{addressId}/primary` | Definir endereço principal. |
| `GET` | `/api/v1/me/cart` | Carrega o carrinho no drawer. |
| `POST` | `/api/v1/me/cart/items` | Adiciona `{ variationId, quantity }`. |
| `PATCH` / `DELETE` | `/api/v1/me/cart/items/{itemId}` | Atualiza quantidade ou remove item. |
| `DELETE` | `/api/v1/me/cart` | Esvazia o carrinho. |
| `POST` | `/api/v1/orders` | Cria pedido com `{ addressId }`. |

### Dependentes de implementação no backend

| Área | Endpoints preparados |
|---|---|
| Favoritos | `GET /api/v1/me/favorites`, `PUT` e `DELETE /api/v1/me/favorites/{productId}` |
| Avaliações | `GET /api/v1/products/{productId}/reviews`, `PUT` e `DELETE /api/v1/me/reviews/{productId}` |
| Disponibilidade | `GET /api/v1/products/{productId}/variations/{variationId}/availability` |
| Pedidos | `GET /api/v1/orders`, `GET /api/v1/orders/{orderId}`, `POST /api/v1/orders/{orderId}/cancel`, `GET /api/v1/orders/{orderId}/status-history` |
| Pagamentos | `POST` e `GET /api/v1/orders/{orderId}/payments`, `GET /api/v1/payments/{paymentId}` |
| Entrega | `GET /api/v1/orders/{orderId}/shipping` e `GET /api/v1/orders/{orderId}/tracking` |

## Problema atual com `productId`

O `ProductController` do backend declara as rotas:

```java
@GetMapping("{productId}/variations")
ResponseEntity<List<ProductVariationSummary>> findVariationByProductId(@PathVariable UUID id)

@GetMapping("{productId}/images")
ResponseEntity<List<ProductImageSummary>> findImageByProductId(@PathVariable UUID id)
```

O nome da variável na URL é `productId`, mas o `@PathVariable` tenta resolver `id`. Isso pode resultar em falha de binding em execução, mesmo que a URL chamada pelo frontend esteja correta.

A correção deve ser feita no backend, por exemplo usando `@PathVariable("productId") UUID productId` nos dois métodos, e repassando `productId` aos casos de uso. O frontend usa a rota documentada e não tenta compensar esse erro com IDs artificiais.

Há também uma divergência de documentação: o `ENDPOINTS.md` marca o catálogo público como planejado, mas os controllers de categorias, produtos, detalhe, slug, variações e imagens já existem no código atual. Esta integração prioriza o código real para decidir o que pode ser conectado.

## Configuração necessária antes de uso real

`API_URL` em `app/store/js/api.js` está vazia, reproduzindo o padrão atual de `app/admin/js/api.js`. Ela deve apontar para a origem da API antes das chamadas reais. Além disso, como autenticação foi deixada fora do escopo, as rotas protegidas ainda exigirão uma etapa futura de Bearer token e o backend precisará estar configurado para CORS quando frontend e API usarem origens diferentes.
