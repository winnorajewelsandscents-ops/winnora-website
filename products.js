import { supabase } from "./supabase-config.js";

const productGrid = document.getElementById("product-grid");

async function loadProducts() {
    if (!productGrid) return;

    const category = productGrid.dataset.category;

    productGrid.textContent = "Loading products...";

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

    if (error) {
        productGrid.textContent =
            "Could not load products: " + error.message;
        return;
    }

    productGrid.innerHTML = "";

    if (data.length === 0) {
        productGrid.textContent =
            "New products are coming soon. Please check back!";
        return;
    }

    data.forEach(function (product) {

        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image_url;
        image.alt = product.name;
        image.className = "product-image";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const price = document.createElement("p");
        price.textContent =
            "KES " + Number(product.price).toLocaleString("en-KE");

        // ADD TO CART BUTTON

        const addToCart = document.createElement("button");
        addToCart.type = "button";
        addToCart.className = "hero-button secondary-button";
        addToCart.textContent = "ADD TO CART";

        addToCart.addEventListener("click", function () {

            let cart = [];

            try {
                cart = JSON.parse(
                    localStorage.getItem("winoraCart") || "[]"
                );
            } catch (error) {
                cart = [];
            }

            const existingProduct = cart.find(function (item) {
                return String(item.id) === String(product.id);
            });

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image_url: product.image_url,
                    quantity: 1
                });
            }

            localStorage.setItem(
                "winoraCart",
                JSON.stringify(cart)
            );

            window.dispatchEvent(
                new Event("winoraCartUpdated")
            );

            addToCart.textContent = "ADDED TO CART ✓";
        });

       // ORDER NOW BUTTON - DIRECT CHECKOUT
const enquire = document.createElement("button");
enquire.type = "button";
enquire.className = "hero-button";
enquire.textContent = "ORDER NOW";
enquire.addEventListener("click", function () {

    const directOrder = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        quantity: 1
    };

    localStorage.setItem(
        "winoraDirectOrder",
        JSON.stringify(directOrder)
    );

    localStorage.setItem("winoraCheckoutMode", "direct");

    window.location.href = "checkout.html";
});
        card.append(
            image,
            name,
            description,
            price,
            addToCart,
            enquire
        );

        productGrid.appendChild(card);
    });
}

loadProducts();
