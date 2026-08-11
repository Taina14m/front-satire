document.addEventListener("DOMContentLoaded", function () {
    const botao = document.querySelector(".accessibility-button");
    const menu = document.querySelector(".accessibility-menu");

    if (!botao || !menu) {
        return;
    }

    botao.addEventListener("click", function () {
        const aberto = botao.getAttribute("aria-expanded") === "true";
        botao.setAttribute("aria-expanded", String(!aberto));
        menu.hidden = aberto;
    });

    menu.addEventListener("click", function (evento) {
        const acao = evento.target.dataset.action;

        if (acao === "increase-text") {
            alterarTamanhoTexto(1);
        }

        if (acao === "decrease-text") {
            alterarTamanhoTexto(-1);
        }

        if (acao === "contrast") {
            document.body.classList.toggle("high-contrast");
        }

        if (acao === "dark-mode") {
            document.body.classList.toggle("dark-mode");
        }

        if (acao === "reset-accessibility") {
            document.documentElement.style.fontSize = "16px";
            document.body.classList.remove("high-contrast");
            document.body.classList.remove("dark-mode");
        }
    });
});

function alterarTamanhoTexto(valor) {
    const tamanhoAtual = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const novoTamanho = Math.min(20, Math.max(14, tamanhoAtual + valor));
    document.documentElement.style.fontSize = novoTamanho + "px";
}
