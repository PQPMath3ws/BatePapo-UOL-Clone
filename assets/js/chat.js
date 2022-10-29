let canInteract = false;

let continueLoggedInterval = null;

let usersInterval = null;
let users = [];

let messagesInterval = null;
let messages = [];

let canStayOnline = true;
let canGetMessages = true;
let canGetUsers = true;

let selectedSendMessageIndex = 0;
let selectedVisibilityIndex = 0;

let messageOptions = {
    to: "Todos",
    type: "message"
};

const hasUsername = () => localStorage.getItem("username") ? true : false;

function iAmOnline() {
    if (hasUsername()) {
        if (canStayOnline) {
            canStayOnline = false;
            let name = localStorage.getItem("username");
            const iAmOnline_url = "https://mock-api.driven.com.br/api/v6/uol/status";
            fetch(iAmOnline_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${name}`
                })
            }).then(function (response) {
                if (response.ok) {
                    document.body.style.display = "block";
                    canStayOnline = true;
                    messageOptions.from = `${localStorage.getItem("username")}`;
                } else {
                    document.body.style.display = "none";
                    alert("Você foi desconectado por inatividade!");
                    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "logout.html";
                }
            }).catch(function (error) {
                document.body.style.display = "none";
                alert("Falha na conexão - Você foi desconectado!");
                window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "logout.html";
                canStayOnline = true;
            });
        }
    } else {
        document.body.style.display = "none";
        setTimeout(function() {
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
        }, 1000);
    }
}

function getUsers() {
    if (canGetUsers) {
        canGetUsers = false;
        const users_url = "https://mock-api.driven.com.br/api/v6/uol/participants";
        fetch(users_url, {
            method: "GET"
        }).then(function(response) {
            if (response.ok) {
                response.json().then(function (json) {
                    users = [];
                    users[0] = {
                        name: "Todos",
                        icon: "people-sharp"
                    };
                    users.push(...json.map(function (user) {
                        user.icon = "person-circle-sharp";
                        return user;
                    }));
                    let i = selectedSendMessageIndex = 0;
                    for (i = 0; i < users.length; i++) {
                        if (users[i].name === messageOptions.to) {
                            selectedSendMessageIndex = i;
                            break;
                        }
                    }
                    if (i === users.length && users[users.length - 1].name !== messageOptions.to) {
                        messageOptions.to = "Todos";
                        setStatusSendMessageText();
                    }
                    let chooseTalker = document.getElementById("choose-talker");
                    chooseTalker.innerHTML = "";
                    for (let i = 0; i < users.length; i++) {
                        let option = null;
                        if (selectedSendMessageIndex === i) {
                            option = `<div class="option" onclick="setDestinatary(this)">
                                <ion-icon name="${users[i].icon}"></ion-icon>
                                <span>${users[i].name}</span>
                                <div class="check">
                                    <ion-icon name="checkmark-sharp"></ion-icon>
                                </div>
                            </div>`;
                        } else {
                            option = `<div class="option" onclick="setDestinatary(this)">
                                <ion-icon name="${users[i].icon}"></ion-icon>
                                <span>${users[i].name}</span>
                            </div>`;
                        }
                        chooseTalker.innerHTML += option;
                    }
                    canGetUsers = true;
                });
            } else canGetUsers = true;
        }).catch(function (error) {
            canGetUsers = true;
        });
    }
}

function getMessages() {
    if (canGetMessages) {
        canGetMessages = false;
        const messages_url = "https://mock-api.driven.com.br/api/v6/uol/messages";
        fetch(messages_url, {
            method: "GET"
        }).then(function(response) {
            if (response.ok) {
                response.json().then(function (json) {
                    messages = [...json];
                    let messagesDiv = document.getElementById("messages-div");
                    messagesDiv.innerHTML = "";
                    messages.forEach(function (message) {
                        let messageDivToInsert = null;
                        if (message.type === "status") {
                            messageDivToInsert = `<div class="status-message">
                                <span class="time">(${message.time})</span>
                                <span class="status"><b>${message.from}</b> ${message.text}</span>
                            </div>`;
                        } else if (message.type === "message") {
                            messageDivToInsert = `<div class="public-message">
                                <span class="time">(${message.time})</span>
                                <span class="message"><b>${message.from}</b> para <b>${message.to}</b>: ${message.text}</span>
                            </div>`;
                        } else {
                            if (message.to === localStorage.getItem("username") || message.to === "Todos" || message.from === localStorage.getItem("username")) {
                                messageDivToInsert = `<div class="reserved-message">
                                    <span class="time">(${message.time})</span>
                                    <span class="message"><b>${message.from}</b> reservadamente para <b>${message.to}</b>: ${message.text}</span>
                                </div>`;
                            }
                        }
                        if (messageDivToInsert) messagesDiv.innerHTML += messageDivToInsert;
                    });
                    canGetMessages = true;
                });
            }
            else canGetMessages = true;
        }).catch(function (error) {
            canGetMessages = true;
        });
    }
}

function configureChat() {
    if (canInteract) {
        document.body.style.display = "block";
        if (continueLoggedInterval) clearInterval(continueLoggedInterval);
        continueLoggedInterval = setInterval(iAmOnline, 3000);
        if (usersInterval) clearInterval(usersInterval);
        usersInterval = setInterval(getUsers, 3000);
        if (messagesInterval) clearInterval(messagesInterval);
        messagesInterval = setInterval(getMessages, 3000);
    }
}

function openConfigDiv() {
    if (canInteract) {
        let onlineChat = document.getElementById("online-chat");
        let optionsChat = document.getElementById("options-chat");
        optionsChat.style.opacity = 1;
        optionsChat.classList.add("fadeIn");
        onlineChat.style.display = "block";
        setTimeout(() => optionsChat.classList.remove("fadeIn"), 300);
    }
}

function closeConfigDiv() {
    if (canInteract) {
        let onlineChat = document.getElementById("online-chat");
        let optionsChat = document.getElementById("options-chat");
        optionsChat.style.opacity = 0;
        optionsChat.classList.add("fadeOut");
        setTimeout(() => {
            onlineChat.style.display = "none";
            setTimeout(() => optionsChat.classList.remove("fadeOut"), 300);
        }, 300);
    }
}

function setDestinatary(obj) {
    let chooseTalker = document.getElementById("choose-talker");
    selectedSendMessageIndex = parseInt(Array.prototype.indexOf.call(chooseTalker.children, obj));
    if (selectedSendMessageIndex > -1) {
        for (let i = 0; i < chooseTalker.children.length; i++) {
            if (chooseTalker.children[i].children[2]) chooseTalker.children[i].children[2].remove();
        }
        chooseTalker.children[selectedSendMessageIndex].innerHTML += `<div class="check">
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>`;
        messageOptions.to = `${chooseTalker.children[selectedSendMessageIndex].children[1].innerHTML}`;
        setStatusSendMessageText();
    }
}

function setVisibility(obj) {
    let chooseVisibility = document.getElementById("choose-visibility");
    selectedVisibilityIndex = parseInt(Array.prototype.indexOf.call(chooseVisibility.children, obj));
    if (selectedVisibilityIndex > -1) {
        for (let i = 0; i < chooseVisibility.children.length; i++) {
            if (chooseVisibility.children[i].children[2]) chooseVisibility.children[i].children[2].remove();
        }
        chooseVisibility.children[selectedVisibilityIndex].innerHTML += `<div class="check">
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>`;
        messageOptions.type = `${selectedVisibilityIndex === 0 ? "message" : "private_message"}`;
        setStatusSendMessageText();
    }
}

function setStatusSendMessageText() {
    let statusSendMessageText = document.getElementById("status-send-message-text");
    statusSendMessageText.innerHTML = `Enviando ${messageOptions.type === "message" ? "publicamente" : "reservadamente"} para ${messageOptions.to}`;
}

function sendMessage() {
    let messageInput = document.getElementById("message-input");
    if (messageInput.value && hasUsername()) {
        const send_message_url = "https://mock-api.driven.com.br/api/v6/uol/messages";
        messageOptions.from = `${localStorage.getItem("username")}`;
        messageOptions.text = `${messageInput.value}`;
        fetch(send_message_url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageOptions)
        });
        messageOptions.text = messageInput.value = "";
    }
}

function checkEnterPressed(event) {
    if (event.code === "Enter") {
        sendMessage();
    }
}

window.onload = async function() {
    if (hasUsername()) {
        canInteract = true;
        configureChat();
    } else {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
    }
};