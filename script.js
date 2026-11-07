// WINNORA MOBILE NAVIGATION

const menuToggle = document.querySelector("#menu-toggle");
const mainNavigation = document.querySelector("#main-navigation");

if (menuToggle && mainNavigation) {

    menuToggle.addEventListener("click", function () {

        mainNavigation.classList.toggle("open");

        const menuIsOpen = mainNavigation.classList.contains("open");

        menuToggle.setAttribute("aria-expanded", menuIsOpen);

        menuToggle.textContent = menuIsOpen ? "×" : "☰";

    });

    mainNavigation.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            mainNavigation.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.textContent = "☰";

        });

    });

}


// WINNORA WELCOME MESSAGE

const welcomeMessage = document.querySelector("#welcome-message");

if (welcomeMessage) {
    console.log("Welcome to WINNORA!");
}


// WINNORA PRODUCT IMAGE VIEWER

const productImage = document.querySelector(".product-image");
const imageViewer = document.querySelector("#image-viewer");
const enlargedImage = document.querySelector("#enlarged-image");
const closeViewer = document.querySelector("#close-viewer");

if (productImage && imageViewer && enlargedImage && closeViewer) {

    productImage.addEventListener("click", function () {
        enlargedImage.src = productImage.src;
        imageViewer.style.display = "flex";
    });

    closeViewer.addEventListener("click", function () {
        imageViewer.style.display = "none";
    });

    imageViewer.addEventListener("click", function (event) {
        if (event.target === imageViewer) {
            imageViewer.style.display = "none";
        }
    });

}
/* =================================
   WINNORA SHOPPING CART CONTROLS
================================= */

const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");

function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");

    cartPanel.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
}

function closeCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");

    cartPanel.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
}

if (cartToggle && cartPanel && cartOverlay && cartClose) {

    cartToggle.addEventListener("click", openCart);

    cartClose.addEventListener("click", closeCart);

    cartOverlay.addEventListener("click", closeCart);

}
/* =================================
   WINNORA CART DISPLAY AND TOTALS
================================= */

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

function getWinoraCart() {
    try {
        return JSON.parse(
            localStorage.getItem("winoraCart") || "[]"
        );
    } catch (error) {
        return [];
    }
}

function saveWinoraCart(cart) {
    localStorage.setItem("winoraCart", JSON.stringify(cart));

    window.dispatchEvent(
        new Event("winoraCartUpdated")
    );
}

function displayWinoraCart() {

    const cart = getWinoraCart();

    const totalItems = cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);

    const subtotal = cart.reduce(function (total, item) {
        return total + (item.price * item.quantity);
    }, 0);

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartTotal) {
        cartTotal.textContent =
            "KES " + subtotal.toLocaleString("en-KE");
    }

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your shopping bag is currently empty.</p>';
        return;
    }

    cart.forEach(function (item) {

        const itemCard = document.createElement("div");
        itemCard.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image_url;
        image.alt = item.name;
        image.className = "cart-item-image";

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            "KES " + Number(item.price).toLocaleString("en-KE");

        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Decrease quantity");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");

        decrease.addEventListener("click", function () {
            const updatedCart = getWinoraCart();
            const selected = updatedCart.find(
                product => String(product.id) === String(item.id)
            );

            if (selected) {
                selected.quantity -= 1;

                if (selected.quantity <= 0) {
                    const remaining = updatedCart.filter(
                        product => String(product.id) !== String(item.id)
                    );
                    saveWinoraCart(remaining);
                } else {
                    saveWinoraCart(updatedCart);
                }
            }
        });

        increase.addEventListener("click", function () {
            const updatedCart = getWinoraCart();
            const selected = updatedCart.find(
                product => String(product.id) === String(item.id)
            );

            if (selected) {
                selected.quantity += 1;
                saveWinoraCart(updatedCart);
            }
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        remove.className = "remove-cart-item";

        remove.addEventListener("click", function () {
            const updatedCart = getWinoraCart().filter(
                product => String(product.id) !== String(item.id)
            );

            saveWinoraCart(updatedCart);
        });

        quantityControls.append(
            decrease,
            quantity,
            increase
        );

        details.append(
            name,
            price,
            quantityControls,
            remove
        );

        itemCard.append(image, details);
        cartItems.appendChild(itemCard);
    });
}

window.addEventListener(
    "winoraCartUpdated",
    displayWinoraCart
);

displayWinoraCart();
/* =================================
   WINNORA CHECKOUT NAVIGATION
================================= */

if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {

        const cart = getWinoraCart();

        if (cart.length === 0) {
            alert("Your shopping bag is empty!");
            return;
        }

        window.location.href = "checkout.html";
    });
}
