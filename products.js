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
// DISPLAY AVAILABLE STOCK

const stock = document.createElement("p");
stock.className = "product-stock";

const stockQuantity = Number(product.stock_quantity);

if (stockQuantity > 0) {
    stock.textContent = "Available stock: " + stockQuantity;
} else {
    stock.textContent = "Currently out of stock";
}
        // QUANTITY SELECTION

const quantityLabel = document.createElement("label");
quantityLabel.textContent = "Quantity";

const quantityInput = document.createElement("input");
quantityInput.type = "number";
quantityInput.min = "1";
quantityInput.max = String(stockQuantity);
quantityInput.step = "1";
quantityInput.value = "1";
quantityInput.className = "product-quantity";

if (stockQuantity <= 0) {
    quantityInput.disabled = true;
}
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

           const selectedQuantity = Number(quantityInput.value);

if (
    !Number.isInteger(selectedQuantity) ||
    selectedQuantity < 1 ||
    selectedQuantity > stockQuantity
) {
    alert("Please select a valid quantity within the available stock.");
    return;
}

if (existingProduct) {
    if (existingProduct.quantity + selectedQuantity > stockQuantity) {
        alert("You cannot add more than the available stock.");
        return;
    }

    existingProduct.quantity += selectedQuantity;
} else {
    cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        quantity: selectedQuantity
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

   const selectedQuantity = Number(quantityInput.value);

if (
    !Number.isInteger(selectedQuantity) ||
    selectedQuantity < 1 ||
    selectedQuantity > stockQuantity
) {
    alert("Please select a valid quantity within the available stock.");
    return;
}

const directOrder = {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    quantity: selectedQuantity
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
    stock,
    quantityLabel,
    quantityInput,
    addToCart,
    enquire
);
        productGrid.appendChild(card);
    });
}

loadProducts();
