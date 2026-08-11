function formatCatalogPrice(value) {
  return "R$" + Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getCatalogImage(product) {
  return product.images.find(function (image) { return image.mainImage; }) || product.images[0];
}

function getCatalogPrice(product) {
  const variations = product.variations.filter(function (variation) { return variation.active; });
  if (variations.length === 0) return "Sem variações disponíveis";
  const lowestPrice = Math.min.apply(null, variations.map(function (variation) { return Number(variation.price); }));
  return variations.length > 1 ? "A partir de " + formatCatalogPrice(lowestPrice) : formatCatalogPrice(lowestPrice);
}

function createProductCard(product) {
  const figure = document.createElement("div");
  const image = document.createElement("div");
  const name = document.createElement("p");
  const price = document.createElement("span");
  const productImage = getCatalogImage(product);

  figure.className = "figure";
  figure.dataset.productId = product.id;
  figure.tabIndex = 0;
  figure.setAttribute("role", "button");
  figure.setAttribute("aria-label", "Ver detalhes de " + product.name);
  image.className = "figure__img";
  if (productImage) {
    image.style.backgroundImage = "url(" + JSON.stringify(productImage.url) + ")";
    image.style.backgroundPosition = "center";
    image.style.backgroundRepeat = "no-repeat";
    image.style.backgroundSize = "cover";
  }
  name.className = "figure__name";
  name.textContent = product.name;
  price.className = "figure__price";
  price.textContent = getCatalogPrice(product);
  figure.append(image, name, price);
  return figure;
}

function configureCatalogCarousel(section) {
  const track = section.querySelector(".carousel__track");
  const pages = section.querySelectorAll(".carousel__page");
  const previous = section.querySelector(".carousel__btn--prev");
  const next = section.querySelector(".carousel__btn--next");
  const dots = section.querySelectorAll(".carousel__dot");
  let currentPage = 0;

  function goTo(page) {
    currentPage = Math.max(0, Math.min(page, pages.length - 1));
    track.style.transform = "translateX(-" + currentPage * 100 + "%)";
    dots.forEach(function (dot, index) { dot.classList.toggle("carousel__dot--active", index === currentPage); });
  }

  previous.addEventListener("click", function () { goTo(currentPage - 1); });
  next.addEventListener("click", function () { goTo(currentPage + 1); });
  dots.forEach(function (dot, index) { dot.addEventListener("click", function () { goTo(index); }); });
}

function createCatalogSection(template, category, products) {
  const section = template.cloneNode(true);
  const title = section.querySelector(".section__title");
  const track = section.querySelector(".carousel__track");
  const dots = section.querySelector(".carousel__dots");
  title.textContent = category.name;
  title.dataset.sectionName = category.name;
  track.innerHTML = "";
  dots.innerHTML = "";

  for (let index = 0; index < products.length; index += 6) {
    const page = document.createElement("div");
    const dot = document.createElement("span");
    page.className = "carousel__page";
    products.slice(index, index + 6).forEach(function (product) { page.appendChild(createProductCard(product)); });
    track.appendChild(page);
    dot.className = "carousel__dot" + (index === 0 ? " carousel__dot--active" : "");
    dots.appendChild(dot);
  }

  section.querySelector(".carousel__nav").hidden = products.length <= 6;
  configureCatalogCarousel(section);
  return section;
}

async function loadCatalog() {
  if (!isApiConfigured()) return;
  const main = document.querySelector(".main-home");
  const staticSections = Array.from(main.querySelectorAll(".section"));

  try {
    const products = await getProducts();
    const productsByCategory = new Map();
    products.forEach(function (product) {
      if (!product.category || !product.category.id) return;
      const entry = productsByCategory.get(product.category.id) || { category: product.category, products: [] };
      entry.products.push(product);
      productsByCategory.set(product.category.id, entry);
    });
    if (productsByCategory.size === 0) return;

    const fragment = document.createDocumentFragment();
    Array.from(productsByCategory.values()).forEach(function (entry, index) {
      fragment.appendChild(createCatalogSection(staticSections[index % staticSections.length], entry.category, entry.products));
    });
    staticSections.forEach(function (section) { section.remove(); });
    main.insertBefore(fragment, main.querySelector(".home-deco"));
  } catch (error) {
    console.error("Não foi possível carregar o catálogo.", error);
  }
}

document.addEventListener("DOMContentLoaded", loadCatalog);
