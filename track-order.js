import { supabase } from "./supabase-config.js";

const trackingForm = document.getElementById("track-order-form");
const trackingMessage = document.getElementById("tracking-message");
const trackingResult = document.getElementById("tracking-result");

trackingForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    trackingResult.replaceChildren();
    trackingMessage.textContent = "Checking your order...";

    const orderReference =
        document.getElementById("order-reference").value.trim();

    const phone =
        document.getElementById("customer-phone").value.trim();

    try {

        const { data, error } = await supabase.functions.invoke(
            "track-order",
            {
                body: {
                    orderReference: orderReference,
                    phone: phone
                }
            }
        );

        if (error) {
            let message = "We couldn't verify your order. Please check your details.";

            try {
                const details = await error.context.json();
                if (details.error) message = details.error;
            } catch (e) {}

            throw new Error(message);
        }

        if (data.error) {
            throw new Error(data.error);
        }

        const order = data.order;
        const items = data.items || [];

        trackingMessage.textContent = "Order found successfully!";

        const heading = document.createElement("h2");
        heading.textContent = "Your Order Details";

        const reference = document.createElement("p");
        reference.textContent = "Order Reference: " + order.id;

        const date = document.createElement("p");
        date.textContent = "Date: " +
            new Date(order.created_at).toLocaleDateString("en-KE");

        const status = document.createElement("p");
        status.textContent = "Order Status: " + order.order_status;

        const total = document.createElement("p");
        total.textContent = "Total: KES " +
            Number(order.total).toLocaleString("en-KE");

        const itemsHeading = document.createElement("h3");
        itemsHeading.textContent = "Items Ordered";

        const itemList = document.createElement("ul");

        items.forEach(function (item) {

            const listItem = document.createElement("li");

            listItem.textContent =
                item.product_name +
                " — Quantity: " + item.quantity +
                " — KES " + item.line_total;

            itemList.appendChild(listItem);

        });

        trackingResult.append(
            heading,
            reference,
            date,
            status,
            total,
            itemsHeading,
            itemList
        );

    } catch (error) {

        trackingMessage.textContent = error.message;

    }

});
