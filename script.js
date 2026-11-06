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