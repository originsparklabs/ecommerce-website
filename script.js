const products = [
  {
    id: 1,
    name: "Air Pulse 5",
    category: "tech",
    price: 149,
    rating: 4.9,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Luma Lamp",
    category: "home",
    price: 89,
    rating: 4.8,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Crest Hoodie",
    category: "style",
    price: 68,
    rating: 4.7,
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Aster Speaker",
    category: "tech",
    price: 119,
    rating: 4.9,
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Velvet Throw",
    category: "home",
    price: 73,
    rating: 4.8,
    badge: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Northline Watch",
    category: "style",
    price: 169,
    rating: 4.9,
    badge: "Featured",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Drift Headphones",
    category: "tech",
    price: 199,
    rating: 4.9,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Contour Chair",
    category: "home",
    price: 259,
    rating: 4.8,
    badge: "Editor Pick",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
  }
];

const state = {
  selectedFilter: "all",
  cart: []
};

const productGrid = document.getElementById("product-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  const visibleProducts =
    state.selectedFilter === "all"
      ? products
      : products.filter((product) => product.category === state.selectedFilter);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card" data-category="${product.category}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-badge">${product.badge}</span>
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span class="product-category">${product.category}</span>
              <span class="product-rating">★ ${product.rating}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-footer">
              <span class="product-price">${money(product.price)}</span>
              <button class="add-btn" data-add="${product.id}">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addItem(productId) {
  const product = products.find((item) => item.id === Number(productId));
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  openCart();
}

function updateCart() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (!state.cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartSubtotal.textContent = money(0);
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <p>Qty: ${item.quantity}</p>
            <strong>${money(item.price * item.quantity)}</strong>
          </div>
          <button aria-label="Remove ${item.name}" data-remove="${item.id}">×</button>
        </div>
      `
    )
    .join("");

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartSubtotal.textContent = money(subtotal);
}

function removeItem(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  updateCart();
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderProducts();
  });
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const cartToggle = event.target.closest("[data-cart-toggle]");

  if (addButton) {
    addItem(addButton.dataset.add);
  }

  if (removeButton) {
    removeItem(removeButton.dataset.remove);
  }

  if (cartToggle) {
    if (cartPanel.classList.contains("open")) {
      closeCart();
    } else {
      openCart();
    }
  }

  if (event.target === overlay) {
    closeCart();
  }
});

renderProducts();
updateCart();
																																																																																																																																													