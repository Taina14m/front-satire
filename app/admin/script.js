const pageContent = document.getElementById("page-content");
const menuItems = document.querySelectorAll(".menu-item");

const pageFiles = {
    usuarios: "pages/usuarios.html",
    produtos: "pages/produtos.html",
    pedidos: "pages/pedidos.html",
    categorias: "pages/categorias.html"
};

document.addEventListener("DOMContentLoaded", function () {
    configurarMenu();
    carregarSecao("produtos");
});

function configurarMenu() {
    menuItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const section = item.dataset.section;
            carregarSecao(section);
        });
    });
}

async function carregarSecao(section) {
    marcarMenuAtivo(section);

    const arquivo = pageFiles[section];

    if (!arquivo) {
        return;
    }

    try {
        const resposta = await fetch(arquivo);
        const html = await resposta.text();
        const documento = new DOMParser().parseFromString(html, "text/html");
        pageContent.innerHTML = documento.body.innerHTML;
        configurarPaginaAtual(section);
    } catch (erro) {
        pageContent.innerHTML = '<section class="page-section"><p class="empty-state">Não foi possível carregar esta seção.</p></section>';
    }
}

function marcarMenuAtivo(section) {
    menuItems.forEach(function (item) {
        item.classList.toggle("active", item.dataset.section === section);
    });
}

function configurarPaginaAtual(section) {
    configurarBreadcrumbs();
    configurarBotoesModal();
    configurarFiltrosDeTabela();

    if (section === "usuarios") {
        renderizarUsuarios([]);
    }

    if (section === "produtos") {
        renderizarProdutos([]);
    }

    if (section === "pedidos") {
        renderizarPedidos([]);
    }

    if (section === "categorias") {
        renderizarCategorias([]);
    }
}

function configurarBreadcrumbs() {
    document.querySelectorAll("[data-section-link]").forEach(function (link) {
        link.addEventListener("click", function () {
            carregarSecao(link.dataset.sectionLink);
        });
    });
}
