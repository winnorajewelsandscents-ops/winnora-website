import { supabase } from "./supabase-config.js";

const loginForm = document.getElementById("admin-login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    loginMessage.textContent = "Signing in...";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent = error.message;
        return;
    }

    loginMessage.textContent = "Login successful!";

    window.location.href = "dashboard.html";
});