document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("modal-overlay");
  const closeButton = document.getElementById("modal-close");
  const title = document.getElementById("modal-title");
  const info = document.getElementById("modal-info");
  const price = document.getElementById("modal-price");
  const image = document.getElementById("modal-img");
  const variationSelect = document.getElementById("modal-variation");
  const addButton = document.getElementById("modal-btn-cart");

  function closeModal() {
    overlay.classList.remove("modal-overlay--active");
  }

  function setVariations(variations) {
    variationSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione uma variação";
    placeholder.selected = true;
    placeholder.disabled = true;
    variationSelect.appendChild(placeholder);

    variations.forEach(function (variation) {
      const option = document.createElement("option");
      option.value = variation.id;
      option.textContent = variation.name + " (" + variation.sku + ") — " + formatCatalogPrice(variation.price);
      option.disabled = !variation.active || variation.inventory < 1;
      variationSelect.appendChild(option);
    });

    variationSelect.disabled = variations.length === 0;
    addButton.disabled = variations.length === 0;
  }

  async function openProduct(productId) {
    title.textContent = "Carregando...";
    info.textContent = "";
    price.textContent = "";
    image.style.backgroundImage = "";
    variationSelect.innerHTML = "";
    variationSelect.disabled = true;
    addButton.disabled = true;
    overlay.classList.add("modal-overlay--active");

    try {
      const product = await getProduct(productId);
      const variations = await getVariations(product.id);
      const productImage = getCatalogImage(product);
      title.textContent = product.name;
      info.textContent = product.description || "";
      price.textContent = getCatalogPrice(product);
      if (productImage) {
        image.style.backgroundImage = "url(" + JSON.stringify(productImage.url) + ")";
        image.style.backgroundPosition = "center";
        image.style.backgroundRepeat = "no-repeat";
        image.style.backgroundSize = "cover";
      }
      setVariations(variations);
    } catch (error) {
      title.textContent = "Produto indisponível";
      info.textContent = "Não foi possível carregar os detalhes deste produto.";
      console.error("Não foi possível carregar o produto.", error);
    }
  }

  document.addEventListener("click", function (event) {
    const figure = event.target.closest(".figure[data-product-id]");
    if (figure) openProduct(figure.dataset.productId);
  });

  document.addEventListener("keydown", function (event) {
    const figure = event.target.closest && event.target.closest(".figure[data-product-id]");
    if (figure && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openProduct(figure.dataset.productId);
    }
    if (event.key === "Escape") closeModal();
  });

  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeModal();
  });

  addButton.addEventListener("click", async function () {
    const variationId = variationSelect.value;
    if (!variationId) return;
    try {
      applyCartResponse(await addCartItem(variationId, 1));
      closeModal();
    } catch (error) {
      console.error("Não foi possível adicionar o item ao carrinho.", error);
    }
  });
});
