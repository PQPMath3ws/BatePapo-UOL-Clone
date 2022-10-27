window.onload = function() {
    if (localStorage.getItem("username")) localStorage.removeItem("username");
    setTimeout(function() {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "login.html";
    }, 1000);
};