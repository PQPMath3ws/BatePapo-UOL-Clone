window.onload = async function () {
    let name = localStorage.getItem("username");
    if (name) {
        const checkUserURL = "https://mock-api.driven.com.br/api/v6/uol/participants";
        try {
            await request("POST", checkUserURL, {name});
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "chat.html";
        } catch (error) {
            localStorage.removeItem("username");
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
        }
    } else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
    }
};