window.onload = async function() {
    document.body.style.display = "block";
    document.getElementById("login-btn").addEventListener("click", async function() {
        let username = document.getElementById("username");
        if (!username.value) {
            document.getElementById("error-message").innerHTML = "Nome de usuário não pode estar vazio.";
            document.getElementById("error-message").style.display = "block";
        } else {
            let inputDiv = document.getElementById("input-div");
            let loginBtnDiv = document.getElementById("login-btn-div");
            let errorMessage = document.getElementById("error-message");
            let awaitingDiv = document.getElementById("awaiting-div");
            inputDiv.style.display = loginBtnDiv.style.display = errorMessage.style.display = "none";
            awaitingDiv.style.display = "block";
            const loginUrl = "https://mock-api.driven.com.br/api/v6/uol/participants";
            let request = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${username.value}`
                })
            });
            if (request.ok) {
                localStorage.setItem("username", username.value);
                window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "chat.html";
            } else {
                errorMessage.innerHTML = "Esse nome de usuário já está em uso.";
                awaitingDiv.style.display = "none";
                loginBtnDiv.style.display = errorMessage.style.display = "block";
                inputDiv.style.display = "flex";
            }
        }
    });
};