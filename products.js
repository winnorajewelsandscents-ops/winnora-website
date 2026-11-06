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

        const enquire = document.createElement("a");
        enquire.className = "hero-button";
        enquire.textContent = "ENQUIRE ON WHATSAPP";
        enquire.href =
            "https://wa.me/254742345359?text=" +
            encodeURIComponent(
                "Hello WINNORA, I would like to enquire about " +
                product.name + "."
            );
        enquire.target = "_blank";
        enquire.rel = "noopener noreferrer";

        card.append(image, name, description, price, enquire);
        productGrid.appendChild(card);
    });
}

loadProducts();