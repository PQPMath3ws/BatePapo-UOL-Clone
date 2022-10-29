window.onload = async function () {
    document.body.style.display = "block";
    let name = localStorage.getItem("username");
    if (name) {
        const checkUserURL = "https://mock-api.driven.com.br/api/v6/uol/status";
        const request = await fetch(checkUserURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${name}`
            })
        });
        if (request.ok) {
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "chat.html";
        } else {
            localStorage.removeItem("username");
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
        }
    } else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
    }
};