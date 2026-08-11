function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto || "--";
    return celula;
}

function criarBadge(texto, tipo) {
    const badge = document.createElement("span");
    badge.className = "badge " + (tipo || "badge-muted");
    badge.textContent = texto || "--";
    return badge;
}

function criarIcone(nome) {
    const icone = document.createElement("span");
    icone.className = "material-symbols-outlined";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = nome;
    return icone;
}

function atualizarEstadoTabela(tbodyId, dados) {
    const tbody = document.getElementById(tbodyId);

    if (!tbody) {
        return;
    }

    const tabela = tbody.closest(".table-card");

    if (tabela) {
        tabela.classList.toggle("has-data", dados.length > 0);
    }
}

function criarAcoes(editarModal, excluirModal) {
    const celula = document.createElement("td");
    const grupo = document.createElement("div");

    grupo.className = "table-actions";

    if (editarModal) {
        const editar = document.createElement("button");
        editar.className = "icon-button";
        editar.type = "button";
        editar.setAttribute("aria-label", editarModal === "pedido-detalhes" ? "Ver detalhes do registro" : "Editar registro");
        editar.dataset.modal = editarModal;
        editar.appendChild(criarIcone(editarModal === "pedido-detalhes" ? "visibility" : "edit"));
        grupo.appendChild(editar);
    }

    if (excluirModal) {
        const excluir = document.createElement("button");
        excluir.className = "icon-button danger";
        excluir.type = "button";
        excluir.setAttribute("aria-label", "Excluir registro");
        excluir.dataset.modal = excluirModal;
        excluir.appendChild(criarIcone("delete"));
        grupo.appendChild(excluir);
    }

    celula.appendChild(grupo);

    return celula;
}

function limparTabela(tbody) {
    if (tbody) {
        tbody.innerHTML = "";
    }
}

function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById("usuarios-tbody");
    limparTabela(tbody);

    usuarios.forEach(function (usuario) {
        const linha = document.createElement("tr");
        linha.appendChild(criarCelula(usuario.nome));
        linha.appendChild(criarCelula(usuario.email));
        linha.appendChild(criarCelula(usuario.senha ? "********" : "--"));
        linha.appendChild(criarCelula(usuario.cargo));
        linha.appendChild(criarAcoes("usuario-form", "usuario-delete"));
        tbody.appendChild(linha);
    });

    atualizarEstadoTabela("usuarios-tbody", usuarios);
    configurarBotoesModal();
}

function renderizarProdutos(produtos) {
    const tbody = document.getElementById("produtos-tbody");
    limparTabela(tbody);

    produtos.forEach(function (produto) {
        const linha = document.createElement("tr");
        const status = document.createElement("td");
        status.appendChild(criarBadge(produto.status, produto.status === "Ativo" ? "badge-success" : "badge-muted"));
        linha.appendChild(criarCelula(produto.nome));
        linha.appendChild(criarCelula(produto.categoria));
        linha.appendChild(criarCelula(produto.preco));
        linha.appendChild(criarCelula(produto.estoque));
        linha.appendChild(status);
        linha.appendChild(criarAcoes("produto-form", "produto-delete"));
        tbody.appendChild(linha);
    });

    atualizarEstadoTabela("produtos-tbody", produtos);
    configurarBotoesModal();
}

function renderizarPedidos(pedidos) {
    const tbody = document.getElementById("pedidos-tbody");
    limparTabela(tbody);

    pedidos.forEach(function (pedido) {
        const linha = document.createElement("tr");
        const status = document.createElement("td");
        status.appendChild(criarBadge(pedido.status, "badge-warning"));
        linha.appendChild(criarCelula(pedido.id));
        linha.appendChild(criarCelula(pedido.cliente));
        linha.appendChild(criarCelula(pedido.data));
        linha.appendChild(criarCelula(pedido.total));
        linha.appendChild(status);
        linha.appendChild(criarAcoes("pedido-detalhes", ""));
        tbody.appendChild(linha);
    });

    atualizarEstadoTabela("pedidos-tbody", pedidos);
    configurarBotoesModal();
}

function renderizarCategorias(categorias) {
    const tbody = document.getElementById("categorias-tbody");
    limparTabela(tbody);

    categorias.forEach(function (categoria) {
        const linha = document.createElement("tr");
        const status = document.createElement("td");
        status.appendChild(criarBadge(categoria.status, categoria.status === "Ativa" ? "badge-success" : "badge-muted"));
        linha.appendChild(criarCelula(categoria.nome));
        linha.appendChild(criarCelula(categoria.descricao));
        linha.appendChild(status);
        linha.appendChild(criarAcoes("categoria-form", "categoria-delete"));
        tbody.appendChild(linha);
    });

    atualizarEstadoTabela("categorias-tbody", categorias);
    configurarBotoesModal();
}
