const modalContainer = document.getElementById("modal-container");

function configurarBotoesModal() {
    document.querySelectorAll("[data-modal]").forEach(function (botao) {
        if (botao.dataset.modalReady === "true") {
            return;
        }

        botao.dataset.modalReady = "true";

        botao.addEventListener("click", function () {
            abrirModal(botao.dataset.modal);
        });
    });
}

async function abrirModal(nome) {
    if (!modalContainer || !nome) {
        return;
    }

    try {
        const resposta = await fetch("modals/" + nome + ".html");
        const html = await resposta.text();
        modalContainer.innerHTML = html;
        configurarModalAberto();
    } catch (erro) {
        modalContainer.innerHTML = "";
    }
}

function configurarModalAberto() {
    const modal = modalContainer.querySelector(".modal");
    const primeiroCampo = modalContainer.querySelector("input, select, textarea, button");

    if (primeiroCampo) {
        primeiroCampo.focus();
    }

    modalContainer.querySelectorAll("[data-close-modal], .modal-close").forEach(function (botao) {
        botao.addEventListener("click", fecharModal);
    });

    modalContainer.addEventListener("click", fecharModalPorFundo);
    document.addEventListener("keydown", fecharModalPorTecla);

    if (modal) {
        configurarFormularios();
    }
}

function fecharModal() {
    if (modalContainer) {
        modalContainer.innerHTML = "";
    }

    document.removeEventListener("keydown", fecharModalPorTecla);
}

function fecharModalPorFundo(evento) {
    if (evento.target.classList.contains("modal-backdrop")) {
        fecharModal();
    }
}

function fecharModalPorTecla(evento) {
    if (evento.key === "Escape") {
        fecharModal();
    }
}
