const API_URL = "";

async function apiRequest(path, options) {
    if (!API_URL) {
        return null;
    }

    const resposta = await fetch(API_URL + path, options || {});

    if (!resposta.ok) {
        throw new Error("Erro ao acessar a API");
    }

    return resposta.json();
}

async function getUsuarios() {
    const dados = await apiRequest("/usuarios");
    return dados || [];
}

async function criarUsuario(usuario) {
    return apiRequest("/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
}

async function editarUsuario(id, usuario) {
    return apiRequest("/usuarios/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
}

async function excluirUsuario(id) {
    return apiRequest("/usuarios/" + id, {
        method: "DELETE"
    });
}

async function getProdutos() {
    const dados = await apiRequest("/produtos");
    return dados || [];
}

async function criarProduto(produto) {
    return apiRequest("/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    });
}

async function editarProduto(id, produto) {
    return apiRequest("/produtos/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    });
}

async function excluirProduto(id) {
    return apiRequest("/produtos/" + id, {
        method: "DELETE"
    });
}

async function getPedidos() {
    const dados = await apiRequest("/pedidos");
    return dados || [];
}

async function getCategorias() {
    const dados = await apiRequest("/categorias");
    return dados || [];
}

async function criarCategoria(categoria) {
    return apiRequest("/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria)
    });
}

async function editarCategoria(id, categoria) {
    return apiRequest("/categorias/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria)
    });
}

async function excluirCategoria(id) {
    return apiRequest("/categorias/" + id, {
        method: "DELETE"
    });
}
