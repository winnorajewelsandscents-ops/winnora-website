import { supabase } from "./supabase-config.js";
// CUSTOMER ORDERS ELEMENTS
const ordersContainer = document.getElementById("orders-container");
const ordersMessage = document.getElementById("orders-message");
const refreshOrdersButton = document.getElementById("refresh-orders-button");
// LOAD CUSTOMER ORDERS
async function loadOrders() {
    ordersMessage.textContent = "Loading customer orders...";
    ordersContainer.innerHTML = "";

    const { data, error } = await supabase
        .from("orders")
       .select("*, order_items(*, products(image_url))")
        .order("created_at", { ascending: false });

    if (error) {
        ordersMessage.textContent =
            "Could not load orders: " + error.message;
        return;
    }

    if (!data || data.length === 0) {
        ordersMessage.textContent = "No customer orders yet.";
        return;
    }

    ordersMessage.textContent =
        data.length + " customer order(s) found.";

    data.forEach(function (order) {
        const card = document.createElement("div");
        card.className = "admin-order-card";

        const heading = document.createElement("h3");
        heading.textContent = "Order #" + order.id;

        const customer = document.createElement("p");
        customer.textContent = "Customer: " + order.customer_name;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + order.customer_phone;

        const location = document.createElement("p");
        location.textContent = "Delivery Location: " + order.delivery_location;

        const notes = document.createElement("p");
        notes.textContent = "Delivery Notes: " +
            (order.delivery_notes || "None");

        const payment = document.createElement("p");
        payment.textContent = "Payment Method: " + order.payment_method;

        const paymentStatus = document.createElement("p");
        paymentStatus.textContent = "Payment Status: " + order.payment_status;
const statusDropdown = document.createElement("select");

        const orderStatuses = [
            "pending",
            "processing",
            "completed",
            "cancelled"
        ];

        orderStatuses.forEach(function (value) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent =
                value.charAt(0).toUpperCase() + value.slice(1);

            if (value === order.order_status) {
                option.selected = true;
            }

            statusDropdown.appendChild(option);
        });

        statusDropdown.addEventListener("change", function () {
            updateOrderStatus(order.id, statusDropdown.value);
        });
        const total = document.createElement("p");
        total.textContent = "Total: KES " + order.total;

        const status = document.createElement("p");
        status.textContent = "Order Status: " + order.order_status;

        const itemsHeading = document.createElement("h4");
        itemsHeading.textContent = "Items Ordered";

        const itemsList = document.createElement("ul");

       (order.order_items || []).forEach(function (item) {

    const listItem = document.createElement("li");

    const itemImage = document.createElement("img");

    itemImage.src = item.products?.image_url || "";
    itemImage.alt = item.product_name;

    itemImage.style.width = "75px";
    itemImage.style.height = "75px";
    itemImage.style.objectFit = "cover";
    itemImage.style.borderRadius = "5px";
    itemImage.style.marginRight = "12px";
    itemImage.style.verticalAlign = "middle";

    const itemDetails = document.createElement("span");

    itemDetails.textContent =
        item.product_name +
        " — Quantity: " + item.quantity +
        " — KES " + item.line_total;

    if (item.products?.image_url) {
        listItem.appendChild(itemImage);
    }

    listItem.appendChild(itemDetails);

    itemsList.appendChild(listItem);

});
        card.append(
            heading,
            customer,
            phone,
            location,
            notes,
            payment,
            paymentStatus,
            total,
            status,
            statusDropdown,
            itemsHeading,
            itemsList,
        );

        ordersContainer.appendChild(card);
    });
}
// UPDATE ORDER STATUS
async function updateOrderStatus(orderId, newStatus) {
    const { error } = await supabase
        .from("orders")
        .update({
            order_status: newStatus
        })
        .eq("id", orderId);

    if (error) {
        alert("Could not update order: " + error.message);
        return;
    }

    alert("Order status updated successfully!");

    await loadOrders();
}
const productForm = document.getElementById("product-form");
const productMessage = document.getElementById("product-message");
const productsContainer = document.getElementById("products-container");
const logoutButton = document.getElementById("logout-button");

// CHECK ADMIN LOGIN
async function checkLogin() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        window.location.href = "admin.html";
        return false;
    }
 
    return true;
}

// LOAD PRODUCTS
async function loadProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        productsContainer.textContent = "Could not load products: " + error.message;
        return;
    }

    productsContainer.innerHTML = "";

    if (data.length === 0) {
        productsContainer.textContent = "No products have been added yet.";
        return;
    }

    data.forEach(function (product) {
        const card = document.createElement("div");
        card.className = "admin-product-card";

        const image = document.createElement("img");
        image.src = product.image_url;
        image.alt = product.name;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "KES " + product.price;

        const category = document.createElement("p");
        category.textContent = product.category;

       const editButton = document.createElement("button");
editButton.textContent = "EDIT";
editButton.addEventListener("click", function () {
    editProduct(product);
});

const deleteButton = document.createElement("button");
deleteButton.textContent = "DELETE";
deleteButton.addEventListener("click", function () {
    deleteProduct(product);
});

card.append(image, name, price, category, editButton, deleteButton);
        productsContainer.appendChild(card);
    });
}
// EDIT A PRODUCT
async function editProduct(product) {
    const newName = prompt(
        "Enter the new product name:",
        product.name
    );

    if (newName === null) return;

    const newDescription = prompt(
        "Enter the new description:",
        product.description
    );

    if (newDescription === null) return;

    const newPrice = prompt(
        "Enter the new price in KES:",
        product.price
    );

    if (newPrice === null) return;

    const newCategory = prompt(
        "Enter the new category:",
        product.category
    );

    if (newCategory === null) return;

    const price = Number(newPrice);

    if (!newName.trim() || !Number.isFinite(price) || price < 0) {
        alert("Please enter a valid name and price.");
        return;
    }

    const { error } = await supabase
        .from("products")
        .update({
            name: newName.trim(),
            description: newDescription.trim(),
            price: price,
            category: newCategory.trim()
        })
        .eq("id", product.id);

    if (error) {
        alert("Could not update product: " + error.message);
        return;
    }

    alert("Product updated successfully!");
    await loadProducts();
}
// DELETE A PRODUCT AND ITS IMAGE
async function deleteProduct(product) {
    const confirmDelete = confirm(
        "Are you sure you want to delete " + product.name + "?"
    );

    if (!confirmDelete) return;

    // First, delete the product from the database
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

    if (error) {
        alert("Could not delete product: " + error.message);
        return;
    }

    // Then, remove its photograph from Supabase Storage
    if (product.image_url) {
        const marker = "/winnora-products/";
        const imagePath = product.image_url.split(marker)[1];

        if (imagePath) {
            const { error: imageError } = await supabase
                .storage
                .from("winnora-products")
                .remove([decodeURIComponent(imagePath)]);

            if (imageError) {
                alert(
                    "Product deleted, but its image could not be removed: " +
                    imageError.message
                );
                await loadProducts();
                return;
            }
        }
    }

    alert("Product and photograph deleted successfully!");
    await loadProducts();
}
// ADD A PRODUCT
productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("product-name").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const price = Number(document.getElementById("product-price").value);
    const category = document.getElementById("product-category").value;
    const imageFile = document.getElementById("product-image").files[0];

    if (!imageFile || !imageFile.type.startsWith("image/")) {
        productMessage.textContent = "Please select a valid image.";
        return;
    }

    if (!Number.isFinite(price) || price < 0) {
        productMessage.textContent = "Please enter a valid price.";
        return;
    }

    productMessage.textContent = "Uploading product...";

    const { data: userData, error: userError } =
        await supabase.auth.getUser();

    if (userError || !userData.user) {
        productMessage.textContent = "Your login has expired. Please log in again.";
        window.location.href = "admin.html";
        return;
    }

    // Create a unique image filename
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = Date.now() + "-" +
        Math.random().toString(36).slice(2) + "." + fileExtension;

    // Upload photograph
    const { error: uploadError } = await supabase.storage
        .from("winnora-products")
        .upload(fileName, imageFile, {
            contentType: imageFile.type,
            upsert: false
        });

    if (uploadError) {
        productMessage.textContent = "Image upload failed: " + uploadError.message;
        return;
    }

    // Get public image URL
    const { data: imageData } = supabase.storage
        .from("winnora-products")
        .getPublicUrl(fileName);

    // Save product information
    const { error: insertError } = await supabase
        .from("products")
        .insert([{
            name: name,
            description: description,
            price: price,
            category: category,
            image_url: imageData.publicUrl
        }]);

    if (insertError) {
        productMessage.textContent =
            "Product details could not be saved: " + insertError.message;
        return;
    }

    productMessage.textContent = "Product added successfully!";
    productForm.reset();

    await loadProducts();
});

// LOG OUT
logoutButton.addEventListener("click", async function () {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert("Could not log out: " + error.message);
        return;
    }

    window.location.href = "admin.html";
});

// REFRESH CUSTOMER ORDERS
refreshOrdersButton.addEventListener("click", async function () {
    await loadOrders();
});

// START DASHBOARD
const loggedIn = await checkLogin();

if (loggedIn) {
    await loadProducts();
    await loadOrders();
}
