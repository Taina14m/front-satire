function configurarFormularios() {
    const formulario = document.querySelector(".modal-form");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const dados = new FormData(formulario);
        const valores = Object.fromEntries(dados.entries());
        console.log("Dados preparados para futura API:", valores);
        fecharModal();
    });
}

function configurarFiltrosDeTabela() {
    const campoPesquisa = document.querySelector(".search-field input");

    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", function () {
            filtrarTabela(campoPesquisa.value);
        });
    }

    document.querySelectorAll(".tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tab").forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-selected", "false");
            });

            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
        });
    });
}

function filtrarTabela(texto) {
    const tbody = document.querySelector("tbody");
    const linhas = tbody ? tbody.querySelectorAll("tr") : [];
    const busca = texto.toLowerCase().trim();

    linhas.forEach(function (linha) {
        const conteudo = linha.textContent.toLowerCase();
        linha.hidden = !conteudo.includes(busca);
    });
}
