window.onload = async function () {
    let name = localStorage.getItem("username");
    name = "LocalHost";
    if (name) {
        const checkUserURL = "https://mock-api.driven.com.br/api/v6/uol/participants";
        try {
            await request("POST", checkUserURL, {name});
            window.location.href = window.location.origin + window.location.pathname + "chat.html";
        } catch (error) {
            localStorage.removeItem("username");
            window.location.href = window.location.origin + window.location.pathname + "login.html";
        }
    } else {
        window.location.href = window.location.origin + window.location.pathname + "login.html";
    }
};