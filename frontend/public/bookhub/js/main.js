(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");

  if (!header || !toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("nav-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 901px)").matches) setOpen(false);
  });

  // Catálogo (varejo) — carrinho simples no client
  var cartDrawer = document.getElementById("cart-drawer");
  var cartOpen = document.getElementById("cart-open");
  var cartClose = document.getElementById("cart-close");
  var cartClear = document.getElementById("cart-clear");
  var cartCount = document.getElementById("cart-count");
  var cartItemsEl = document.getElementById("cart-items");
  var cartTotalEl = document.getElementById("cart-total");
  var checkoutWhatsapp = document.getElementById("checkout-whatsapp");
  var checkoutForm = document.getElementById("checkout");

  // Se não estiver no catálogo, não faz nada
  if (!cartDrawer || !cartOpen || !cartClose || !cartItemsEl || !cartTotalEl || !cartCount) return;

  var CART_KEY = "acai_energy_cart_v1";
  // Troque pelo número oficial (com DDI/DDD, só dígitos). Ex: 5511999999999
  var WHATSAPP_PHONE = "5500000000000";

  function moneyBRL(value) {
    try {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    } catch (e) {
      return "R$ " + String(value).replace(".", ",");
    }
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function cartCountTotal(cart) {
    return cart.reduce(function (sum, item) {
      return sum + (item.qty || 0);
    }, 0);
  }

  function cartTotal(cart) {
    return cart.reduce(function (sum, item) {
      return sum + (item.unitPrice || 0) * (item.qty || 0);
    }, 0);
  }

  function openCart() {
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function keyForItem(item) {
    return [item.flavor, item.size, item.supp ? item.suppName : ""].join("|");
  }

  function renderCart() {
    var cart = loadCart();
    var count = cartCountTotal(cart);
    cartCount.textContent = String(count);

    // Items
    cartItemsEl.innerHTML = "";
    if (cart.length === 0) {
      var liEmpty = document.createElement("li");
      liEmpty.className = "cart-item";
      liEmpty.innerHTML =
        "<div><strong>Seu carrinho está vazio</strong><br/><small>Adicione itens no catálogo para comprar no varejo.</small></div>";
      cartItemsEl.appendChild(liEmpty);
    } else {
      cart.forEach(function (item) {
        var li = document.createElement("li");
        li.className = "cart-item";
        var title =
          item.flavor +
          " · " +
          item.size +
          " ml" +
          (item.supp ? " · + " + item.suppName : "");
        li.innerHTML =
          "<div>" +
          "<strong>" +
          title +
          "</strong><br/>" +
          "<small>" +
          moneyBRL(item.unitPrice) +
          " (un.)</small>" +
          "</div>" +
          "<div class='qty' aria-label='Quantidade'>" +
          "<button type='button' data-qty='dec' aria-label='Diminuir'>−</button>" +
          "<strong data-qty-value>" +
          item.qty +
          "</strong>" +
          "<button type='button' data-qty='inc' aria-label='Aumentar'>+</button>" +
          "</div>";

        li.querySelector("[data-qty='dec']").addEventListener("click", function () {
          updateQty(item, -1);
        });
        li.querySelector("[data-qty='inc']").addEventListener("click", function () {
          updateQty(item, +1);
        });

        cartItemsEl.appendChild(li);
      });
    }

    // Total
    cartTotalEl.textContent = moneyBRL(cartTotal(cart));
  }

  function updateQty(target, delta) {
    var cart = loadCart();
    var key = keyForItem(target);
    var idx = cart.findIndex(function (it) {
      return keyForItem(it) === key;
    });
    if (idx === -1) return;
    cart[idx].qty = Math.max(0, (cart[idx].qty || 0) + delta);
    if (cart[idx].qty === 0) cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  }

  function computeUnitPrice(cardEl) {
    var sizeEl = cardEl.querySelector(".buy-select");
    var suppEl = cardEl.querySelector(".buy-supp");
    var size = sizeEl ? sizeEl.value : "300";
    var baseKey = size === "500" ? "base500" : "base300";
    var base = Number(cardEl.dataset[baseKey] || "0");
    var extra = Number(cardEl.dataset.suppExtra || "0");
    var supp = !!(suppEl && suppEl.checked);
    return base + (supp ? extra : 0);
  }

  function syncCardPrice(cardEl) {
    var priceEl = cardEl.querySelector("[data-price]");
    if (!priceEl) return;
    priceEl.textContent = moneyBRL(computeUnitPrice(cardEl));
  }

  function addToCart(cardEl) {
    var sizeEl = cardEl.querySelector(".buy-select");
    var suppEl = cardEl.querySelector(".buy-supp");

    var flavor = cardEl.dataset.flavor || "Açaí Energy";
    var size = sizeEl ? sizeEl.value : "300";
    var supp = !!(suppEl && suppEl.checked);
    var suppName = cardEl.dataset.suppName || "Suplemento";
    var unitPrice = computeUnitPrice(cardEl);

    var cart = loadCart();
    var item = {
      flavor: flavor,
      size: size,
      supp: supp,
      suppName: suppName,
      unitPrice: unitPrice,
      qty: 1
    };

    var key = keyForItem(item);
    var idx = cart.findIndex(function (it) {
      return keyForItem(it) === key;
    });

    if (idx >= 0) cart[idx].qty += 1;
    else cart.push(item);

    saveCart(cart);
    renderCart();
    openCart();
  }

  // Bind cards
  document.querySelectorAll(".catalog-card").forEach(function (cardEl) {
    var sizeEl = cardEl.querySelector(".buy-select");
    var suppEl = cardEl.querySelector(".buy-supp");
    var addBtn = cardEl.querySelector("[data-add-to-cart]");

    // Atualiza texto do toggle com o suplemento do card
    var t = cardEl.querySelector(".toggle-text");
    if (t && cardEl.dataset.suppName) t.textContent = "+ " + cardEl.dataset.suppName;

    if (sizeEl) sizeEl.addEventListener("change", function () { syncCardPrice(cardEl); });
    if (suppEl) suppEl.addEventListener("change", function () { syncCardPrice(cardEl); });
    if (addBtn) addBtn.addEventListener("click", function () { addToCart(cardEl); });

    syncCardPrice(cardEl);
  });

  // Drawer interactions
  cartOpen.addEventListener("click", function () {
    renderCart();
    openCart();
  });
  cartClose.addEventListener("click", function () {
    closeCart();
  });
  cartDrawer.addEventListener("click", function (ev) {
    if (ev.target === cartDrawer) closeCart();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeCart();
  });

  if (cartClear) {
    cartClear.addEventListener("click", function () {
      saveCart([]);
      renderCart();
    });
  }

  if (checkoutWhatsapp) {
    checkoutWhatsapp.addEventListener("click", function () {
      var cart = loadCart();
      if (!cart.length) {
        openCart();
        return;
      }

      var nome = "";
      var telefone = "";
      var endereco = "";
      if (checkoutForm) {
        var fd = new FormData(checkoutForm);
        nome = String(fd.get("nome") || "").trim();
        telefone = String(fd.get("telefone") || "").trim();
        endereco = String(fd.get("endereco") || "").trim();
      }

      var lines = [];
      lines.push("Pedido Açai Energy (varejo)");
      lines.push("");
      cart.forEach(function (item) {
        var title =
          "- " +
          item.qty +
          "x " +
          item.flavor +
          " (" +
          item.size +
          "ml" +
          (item.supp ? " + " + item.suppName : "") +
          ")";
        lines.push(title + " — " + moneyBRL(item.unitPrice));
      });
      lines.push("");
      lines.push("Total: " + moneyBRL(cartTotal(cart)));
      if (nome || telefone || endereco) {
        lines.push("");
        if (nome) lines.push("Nome: " + nome);
        if (telefone) lines.push("Telefone: " + telefone);
        if (endereco) lines.push("Endereço: " + endereco);
      }

      var msg = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + msg;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // Inicial
  renderCart();
})();
