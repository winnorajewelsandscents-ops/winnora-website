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
